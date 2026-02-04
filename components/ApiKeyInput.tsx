import React, { useState } from 'react';
import { Key, ArrowRight, ShieldCheck } from 'lucide-react';

interface ApiKeyInputProps {
  onSave: (key: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onSave(inputKey.trim());
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
        <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Cấu hình Gemini AI</h2>
        <p className="text-blue-100 text-sm">Nhập API Key để bắt đầu trợ lý ảo</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              Google Gemini API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
              placeholder="AIzaSy..."
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              API Key của bạn được lưu an toàn trong trình duyệt (LocalStorage) và gửi trực tiếp đến Google. Chúng tôi không thu thập dữ liệu này.
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A90E2] to-[#FF9500] hover:from-blue-600 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
          >
            <span>Tiếp tục</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Chưa có key? Lấy API Key miễn phí tại đây
          </a>
        </div>
      </div>
    </div>
  );
};