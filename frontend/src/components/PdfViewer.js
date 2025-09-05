import React, { useState, useMemo } from 'react';
import { Document as PdfDocument, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker from CDN to work reliably in CRA
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export default function PdfViewer({ fileUrl, className = '' }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [error, setError] = useState(null);

  const isPdf = useMemo(() => {
    return /\.pdf($|\?)/i.test(fileUrl || '');
  }, [fileUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
    setPageNumber(1);
  };

  const onDocumentLoadError = (err) => {
    setError(err?.message || 'Failed to load PDF');
  };

  const zoomIn = () => setScale((s) => clamp(parseFloat((s + 0.1).toFixed(2)), 0.5, 3));
  const zoomOut = () => setScale((s) => clamp(parseFloat((s - 0.1).toFixed(2)), 0.5, 3));
  const fitWidth = () => setScale(1.1);

  const prevPage = () => setPageNumber((p) => clamp(p - 1, 1, numPages || 1));
  const nextPage = () => setPageNumber((p) => clamp(p + 1, 1, numPages || 1));

  if (!fileUrl) {
    return (
      <div className="text-gray-600">No file to preview</div>
    );
  }

  if (!isPdf) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="text-sm text-gray-600 mb-2">Preview available for PDF files. Download to view this file.</div>
        <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Open file</a>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={zoomOut} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">-</button>
          <div className="text-sm text-gray-700 w-16 text-center">{Math.round(scale * 100)}%</div>
          <button onClick={zoomIn} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">+</button>
          <button onClick={fitWidth} className="ml-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Fit</button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevPage} disabled={pageNumber <= 1} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Prev</button>
          <div className="text-sm text-gray-700">Page {pageNumber} / {numPages || '-'}</div>
          <button onClick={nextPage} disabled={!numPages || pageNumber >= numPages} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="flex justify-center border rounded bg-white">
        <PdfDocument
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="p-6 text-gray-600">Loading PDF…</div>}
          error={<div className="p-6 text-red-600">Failed to load PDF</div>}
          options={{ cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`, cMapPacked: true }}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </PdfDocument>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}

      {/* Download link */}
      <div className="mt-3 text-center">
        <a href={fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Open original</a>
      </div>
    </div>
  );
}

