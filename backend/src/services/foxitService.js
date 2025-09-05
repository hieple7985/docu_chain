const axios = require('axios');
const FormData = require('form-data');


// Normalize known Foxit host typos in env (developer.api -> developer-api)
function normalizeFoxitBase(url) {
  if (!url) return url;
  const fixed = url.replace('developer.api.', 'developer-api.');
  return fixed.replace(/\/$/, '');
}

class FoxitService {
  constructor() {
    const base = process.env.FOXIT_BASE_URL || 'https://na1.fusion.foxit.com';
    this.baseUrl = base;
    this.docGenBaseUrl = base;
    const pdfBaseEnv = normalizeFoxitBase(process.env.FOXIT_PDF_BASE_URL) || 'https://app.developer-api.foxit.com';
    this.pdfBaseUrl = pdfBaseEnv;
    this.pdfApiBase = normalizeFoxitBase(process.env.FOXIT_PDF_API_BASE) || `${this.pdfBaseUrl}/pdf-services/api`;
    this.oauthTokenUrl = process.env.FOXIT_OAUTH_TOKEN_URL || `${base}/oauth2/token`;
    this.docGenId = process.env.FOXIT_DOCGEN_ID;
    this.docGenSecret = process.env.FOXIT_DOCGEN_SECRET;
    this.pdfId = process.env.FOXIT_PDF_ID;
    this.pdfSecret = process.env.FOXIT_PDF_SECRET;
    this.docGenScope = process.env.FOXIT_DOCGEN_SCOPE || '';
    this.pdfScope = process.env.FOXIT_PDF_SCOPE || '';
    this._tokens = {
      docgen: { token: null, expiresAt: 0 },
      pdf: { token: null, expiresAt: 0 },
    };
  }

  async _getToken(kind) {
    const now = Math.floor(Date.now() / 1000);
    const cache = this._tokens[kind];
    if (cache && cache.token && cache.expiresAt - 30 > now) return cache.token;

    let clientId, clientSecret, scope;
    if (kind === 'docgen') {
      clientId = this.docGenId; clientSecret = this.docGenSecret; scope = this.docGenScope;
    } else if (kind === 'pdf') {
      clientId = this.pdfId; clientSecret = this.pdfSecret; scope = this.pdfScope;
    } else {
      throw new Error('Unknown Foxit token kind');
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId || '');
    params.append('client_secret', clientSecret || '');
    if (scope) params.append('scope', scope);
    const tokenUrl = this.oauthTokenUrl;
    const resp = await axios.post(tokenUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const { access_token, expires_in } = resp.data || {};
    if (!access_token) throw new Error('Failed to obtain Foxit access token');
    const expiresAt = now + (Number(expires_in) || 3600);
    this._tokens[kind] = { token: access_token, expiresAt };
    return access_token;
  }

  async _authHeader(kind) {
    if (kind === 'pdf') {
      const id = this.pdfId || '';
      const secret = this.pdfSecret || '';
      const basic = Buffer.from(`${id}:${secret}`).toString('base64');
      return { Authorization: `Basic ${basic}` };
    }
    const token = await this._getToken(kind);
    return { Authorization: `Bearer ${token}` };
  }

  // Convert document to PDF
  async convertToPDF(fileBuffer, originalFileName) {
    try {
      const formData = new FormData();
      formData.append('file', fileBuffer, originalFileName);
      formData.append('outputFormat', 'pdf');

      const response = await axios.post(
        `${this.docGenBaseUrl}/api/v1/convert`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            ...(await this._authHeader('docgen'))
          }
        }
      );

      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      console.error('Foxit conversion error:', { status, data, message: error.message });
      throw new Error('Failed to convert document to PDF');
    }
  }

  // Optimize PDF (reduce file size)
  async optimizePDF(pdfBuffer) {
    try {
      // This method will be refactored to the new documentId flow soon.
      // Keep for compatibility if called elsewhere.
      const formData = new FormData();
      formData.append('file', pdfBuffer, 'document.pdf');
      // Upload then linearize per official API
      const uploadUrl = `${this.pdfApiBase}/documents/upload`;
      let uploadResp;
      try {
        uploadResp = await axios.post(
          uploadUrl,
          formData,
          { headers: { ...(await this._authHeader('pdf')), ...formData.getHeaders() }, timeout: 10000 }
        );
      } catch (error) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('Foxit upload error (optimizePDF):', { url: uploadUrl, status, data, message: error.message });
        throw error;
      }
      const documentId = uploadResp.data?.documentId;
      if (!documentId) throw new Error('Upload did not return documentId');

      const opUrl = `${this.pdfApiBase}/documents/optimize/pdf-linearize`;
      let response;
      try {
        response = await axios.post(
          opUrl,
          { documentId },
          { headers: { 'Content-Type': 'application/json', ...(await this._authHeader('pdf')) } }
        );
      } catch (error) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('Foxit linearize error:', { url: opUrl, status, data, message: error.message });
        throw error;
      }
      return response.data; // expected to contain taskId (202)
    } catch (error) {
      // Fallback: local re-save using pdf-lib (may reduce size slightly)
      try {
        const { PDFDocument } = require('pdf-lib');
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const optimized = await pdfDoc.save({ useObjectStreams: true });
        return {
          beforeSize: pdfBuffer.length,
          afterSize: optimized.length,
          note: 'local-fallback'
        };
      } catch (localErr) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('Foxit optimization error:', { status, data, message: error.message });
        console.error('Local optimize fallback error:', { message: localErr.message });
        throw new Error('Failed to optimize PDF');
      }
    }
  }

  // Extract text from PDF
  async extractText(pdfBuffer) {
    // Primary path: Foxit PDF Services
    try {
      const formData = new FormData();
      formData.append('file', pdfBuffer, 'document.pdf');
      const uploadUrl = `${this.pdfApiBase}/documents/upload`;
      let uploadResp;
      try {
        uploadResp = await axios.post(
          uploadUrl,
          formData,
          { headers: { ...(await this._authHeader('pdf')), ...formData.getHeaders() }, timeout: 10000 }
        );
      } catch (error) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('Foxit upload error (extractText):', { url: uploadUrl, status, data, message: error.message });
        throw error;
      }
      const documentId = uploadResp.data?.documentId;
      if (!documentId) throw new Error('Upload did not return documentId');

      const opUrl = `${this.pdfApiBase}/documents/modify/pdf-extract`;
      let response;
      try {
        response = await axios.post(
          opUrl,
          { documentId, extractType: 'TEXT' },
          { headers: { 'Content-Type': 'application/json', ...(await this._authHeader('pdf')) }, timeout: 10000 }
        );
      } catch (error) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('Foxit extract error:', { url: opUrl, status, data, message: error.message });
        throw error;
      }
      return response.data; // expected to contain taskId (202)
    } catch (error) {
      // Fallback path: local extraction using pdf-parse (no external service)
      try {
        const pdfParse = require('pdf-parse');
        const parsed = await pdfParse(pdfBuffer);
        // Normalize to the same shape used in frontend expectations
        return { text: parsed.text };
      } catch (localErr) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('Foxit text extraction error:', { status, data, message: error.message });
        console.error('Local pdf-parse fallback error:', { message: localErr.message });
        throw new Error('Failed to extract text from PDF');
      }
    }
  }

  // Split PDF
  async splitPDF(pdfBuffer, pages) {
    try {
      const formData = new FormData();
      formData.append('file', pdfBuffer, 'document.pdf');
      formData.append('pages', pages.join(','));

      const response = await axios.post(
        `${this.pdfBaseUrl}/api/v1/split`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            ...(await this._authHeader('pdf'))
          }
        }
      );

      return response.data;
    } catch (error) {
      // Fallback: local split using pdf-lib
      try {
        const { PDFDocument } = require('pdf-lib');
        const srcDoc = await PDFDocument.load(pdfBuffer);
        const outFiles = [];
        for (const p of pages) {
          const targetDoc = await PDFDocument.create();
          const [copied] = await targetDoc.copyPages(srcDoc, [p - 1]);
          targetDoc.addPage(copied);
          const bytes = await targetDoc.save();
          outFiles.push({ page: p, buffer: Buffer.from(bytes) });
        }
        return { files: outFiles, note: 'local-fallback' };
      } catch (localErr) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('Foxit split error:', { status, data, message: error.message });
        console.error('Local split fallback error:', { message: localErr.message });
        throw new Error('Failed to split PDF');
      }
    }
  }

  // Merge PDFs
  async mergePDFs(pdfBuffers) {
    try {
      const formData = new FormData();

      pdfBuffers.forEach((buffer, index) => {
        formData.append('files', buffer, `document_${index}.pdf`);
      });

      const response = await axios.post(
        `${this.pdfBaseUrl}/api/v1/merge`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            ...(await this._authHeader('pdf'))
          }
        }
      );

      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      console.error('Foxit merge error:', { status, data, message: error.message });
      throw new Error('Failed to merge PDFs');
    }
  }

  // Add password protection to PDF
  async protectPDF(pdfBuffer, password) {
    try {
      const formData = new FormData();
      formData.append('file', pdfBuffer, 'document.pdf');
      formData.append('password', password);
      formData.append('permissions', 'print,read');

      const response = await axios.post(
        `${this.pdfBaseUrl}/api/v1/protect`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            ...(await this._authHeader('pdf'))
          }
        }
      );

      return response.data;
    } catch (error) {
      // Fallback: pseudo-protect with pdf-lib re-save (visual demo only)
      try {
        const { PDFDocument } = require('pdf-lib');
        const src = await PDFDocument.load(pdfBuffer);
        await src.save({ useObjectStreams: true });
        return { password, note: 'local-fallback' };
      } catch (localErr) {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('Foxit protection error:', { status, data, message: error.message });
        console.error('Local protect fallback error:', { message: localErr.message });
        throw new Error('Failed to protect PDF');
      }
    }
  }

  // Safe auth check (no token value is returned)
  async checkAuth(kind) {
    try {
      if (kind === 'pdf') {
        // Probe the upload endpoint with Basic auth to verify credentials
        const resp = await axios.options(`${this.pdfApiBase}/documents/upload`, {
          headers: { ...(await this._authHeader('pdf')) }
        });
        return { ok: resp.status >= 200 && resp.status < 300 };
      }
      await this._getToken(kind);
      return { ok: true };
    } catch (e) {
      const status = e.response?.status;
      const data = e.response?.data;
      console.error('Foxit auth check failed:', { kind, status, data, message: e.message });
      return { ok: false, error: e.message, status };
    }
  }
}

module.exports = new FoxitService();
