import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { FileData } from '../types';
import { readDocxToHtml, readFileToText } from '../utils/fileUtils';

interface FileUploadProps {
  onFilesReady: (lessonPlan: FileData, appendix: FileData) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesReady }) => {
  const [lessonPlan, setLessonPlan] = useState<FileData | null>(null);
  const [appendix, setAppendix] = useState<FileData | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const processFile = async (file: File, type: 'lesson' | 'appendix') => {
    setIsLoading(true);
    setError('');
    try {
      if (type === 'lesson') {
        // For lesson plan, we need HTML to preserve formatting for later
        const html = await readDocxToHtml(file);
        setLessonPlan({ name: file.name, content: html, originalFile: file });
      } else {
        // For appendix, we just need raw text for the AI context
        const text = await readFileToText(file);
        setAppendix({ name: file.name, content: text, originalFile: file });
      }
    } catch (err) {
      console.error(err);
      setError(`Lỗi khi đọc file: ${file.name}. Vui lòng đảm bảo đúng định dạng .docx`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (lessonPlan && appendix) {
      onFilesReady(lessonPlan, appendix);
    } else {
      setError("Vui lòng tải lên cả hai file cần thiết.");
    }
  };

  return (
    <div className="w-full max-w-4xl animate-fade-in">
      <h2 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-md">Tải lên dữ liệu</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Lesson Plan Upload */}
        <UploadCard 
          title="1. Giáo án (Kế hoạch bài dạy)"
          description="File Word (.docx) giáo án hiện tại của bạn"
          accept=".docx"
          fileData={lessonPlan}
          onFileSelect={(f) => processFile(f, 'lesson')}
          isLoading={isLoading}
        />

        {/* Appendix Upload */}
        <UploadCard 
          title="2. Phụ lục Năng lực số"
          description="File Word (.docx) chứa yêu cầu cần đạt"
          accept=".docx,.txt"
          fileData={appendix}
          onFileSelect={(f) => processFile(f, 'appendix')}
          isLoading={isLoading}
        />
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleNext}
          disabled={!lessonPlan || !appendix || isLoading}
          className={`
            px-10 py-4 rounded-full text-lg font-bold shadow-lg transition-all transform
            ${(!lessonPlan || !appendix || isLoading) 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 active:scale-95'}
          `}
        >
          {isLoading ? 'Đang xử lý file...' : 'Bắt đầu tích hợp AI 🚀'}
        </button>
      </div>
    </div>
  );
};

interface UploadCardProps {
  title: string;
  description: string;
  accept: string;
  fileData: FileData | null;
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const UploadCard: React.FC<UploadCardProps> = ({ title, description, accept, fileData, onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isLoading) fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      onClick={handleClick}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`
        relative bg-white/95 backdrop-blur rounded-2xl p-8 text-center cursor-pointer
        border-2 border-dashed transition-all duration-300 group
        ${fileData ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-300 hover:border-blue-400'}
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        accept={accept}
        className="hidden"
      />
      
      <div className="mb-4 flex justify-center">
        {fileData ? (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce-short">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        ) : (
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <UploadCloud className="w-8 h-8 text-blue-500" />
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-4">{description}</p>
      
      {fileData ? (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
          <FileText className="w-4 h-4" />
          <span className="truncate max-w-[200px]">{fileData.name}</span>
        </div>
      ) : (
        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
          Click hoặc Kéo thả file
        </span>
      )}
    </div>
  );
};