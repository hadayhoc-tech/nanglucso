/**
 * Reads a .docx file and converts it to HTML using Mammoth (loaded via CDN)
 */
export const readDocxToHtml = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (!window.mammoth) {
          reject(new Error("Thư viện Mammoth chưa được tải."));
          return;
        }
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Reads a file (.docx, .txt) and extracts raw text
 */
export const readFileToText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // If it's a docx, use mammoth to extract raw text
    if (file.name.endsWith('.docx')) {
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          if (!window.mammoth) {
            reject(new Error("Thư viện Mammoth chưa được tải."));
            return;
          }
          const result = await window.mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Fallback for text files
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    }
  });
};

/**
 * Downloads HTML content as a .doc/.docx file compatible with Word
 * Note: Browser-only true .docx generation with formatting is complex. 
 * We use the MHT/HTML method which Word opens gracefully with preserved colors/formatting.
 */
export const downloadAsDoc = (htmlContent: string, fileName: string) => {
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Export HTML to Word Document with JavaScript</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid black; padding: 5px; }
      </style>
    </head>
    <body>
  `;
  const footer = "</body></html>";
  const sourceHTML = header + htmlContent + footer;

  const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
  
  const fileDownload = document.createElement("a");
  document.body.appendChild(fileDownload);
  fileDownload.href = source;
  fileDownload.download = fileName.replace('.docx', '') + '_NLS.doc'; // saving as .doc is often safer for HTML content
  fileDownload.click();
  document.body.removeChild(fileDownload);
};