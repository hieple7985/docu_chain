const axios = require('axios');
const FormData = require('form-data');

class FoxitService {
  constructor() {
    this.docGenBaseUrl = 'https://na1.fusion.foxit.com';
    this.pdfBaseUrl = 'https://na1.fusion.foxit.com';
    this.docGenId = process.env.FOXIT_DOCGEN_ID;
    this.docGenSecret = process.env.FOXIT_DOCGEN_SECRET;
    this.pdfId = process.env.FOXIT_PDF_ID;
    this.pdfSecret = process.env.FOXIT_PDF_SECRET;
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
            'Authorization': `Bearer ${this.docGenId}:${this.docGenSecret}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Foxit conversion error:', error);
      throw new Error('Failed to convert document to PDF');
    }
  }

  // Optimize PDF (reduce file size)
  async optimizePDF(pdfBuffer) {
    try {
      const formData = new FormData();
      formData.append('file', pdfBuffer, 'document.pdf');
      formData.append('optimization', 'true');
      formData.append('compression', 'high');

      const response = await axios.post(
        `${this.pdfBaseUrl}/api/v1/optimize`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${this.pdfId}:${this.pdfSecret}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Foxit optimization error:', error);
      throw new Error('Failed to optimize PDF');
    }
  }

  // Extract text from PDF
  async extractText(pdfBuffer) {
    try {
      const formData = new FormData();
      formData.append('file', pdfBuffer, 'document.pdf');
      formData.append('extractText', 'true');

      const response = await axios.post(
        `${this.pdfBaseUrl}/api/v1/extract`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${this.pdfId}:${this.pdfSecret}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Foxit text extraction error:', error);
      throw new Error('Failed to extract text from PDF');
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
            'Authorization': `Bearer ${this.pdfId}:${this.pdfSecret}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Foxit split error:', error);
      throw new Error('Failed to split PDF');
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
            'Authorization': `Bearer ${this.pdfId}:${this.pdfSecret}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Foxit merge error:', error);
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
            'Authorization': `Bearer ${this.pdfId}:${this.pdfSecret}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Foxit protection error:', error);
      throw new Error('Failed to protect PDF');
    }
  }
}

module.exports = new FoxitService();
