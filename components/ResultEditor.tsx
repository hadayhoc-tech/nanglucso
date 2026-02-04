import React, { useState } from 'react';
import { Download, RefreshCw, Edit3, Save } from 'lucide-react';
import { downloadAsDoc } from '../utils/fileUtils';

interface ResultEditorProps {
  initialHtml: string;
  fileName: string;
  onRetry: () => void;
}

export const ResultEditor: React.FC<ResultEditorProps> = ({ initialHtml, fileName, onRetry }) => {
  // We use simple contentEditable for a lightweight editor that preserves the HTML structure
  // In a production app, use Quill or Tiptap
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    downloadAsDoc(htmlContent, fileName);
  };

  const toggleEdit = () => {
    if (isEditing && contentRef.current) {
      setHtmlContent(contentRef.current.innerHTML);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="w-full max-w-6xl animate-fade-in flex flex-col h-[85vh]">
      <div className="bg-white rounded-t-xl shadow-sm p-4 border-b flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 hidden md:block">Kết quả Tích hợp</h2>
            <div className="flex gap-2 text-sm">
                <div className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                    Nội dung bổ sung (Màu xanh)
                </div>
            </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Làm lại
          </button>
          
          <button 
            onClick={toggleEdit}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${isEditing ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditing ? 'Lưu chỉnh sửa' : 'Chỉnh sửa'}
          </button>

          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm font-bold"
          >
            <Download className="w-4 h-4" />
            Tải về (.doc)
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-8 flex justify-center">
            <div className="bg-white shadow-2xl min-h-[29.7cm] w-[21cm] p-[2.5cm] origin-top">
                <div 
                    ref={contentRef}
                    className={`word-preview outline-none ${isEditing ? 'border-2 border-blue-300 p-2 rounded' : ''}`}
                    contentEditable={isEditing}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    spellCheck={false}
                />
            </div>
        </div>
      </div>
    </div>
  );
};