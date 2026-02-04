import React, { useState, useEffect } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { FileUpload } from './components/FileUpload';
import { ResultEditor } from './components/ResultEditor';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SettingsModal } from './components/SettingsModal';
import { AppStep, FileData, ProcessingState } from './types';
import { generateIntegratedContentWithFallback } from './services/geminiService';
import { Layers, Settings, ExternalLink } from 'lucide-react';
import { STORAGE_KEYS, DEFAULT_MODEL_ID, API_KEY_HELP_URL } from './constants';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.API_KEY);
  const [files, setFiles] = useState<{ lesson: FileData | null, appendix: FileData | null }>({ lesson: null, appendix: null });
  const [processing, setProcessing] = useState<ProcessingState>({ isLoading: false, message: '' });
  const [resultHtml, setResultHtml] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [usedModel, setUsedModel] = useState<string>('');

  useEffect(() => {
    const storedKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    const storedModel = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL);

    if (storedKey) {
      setApiKey(storedKey);
      setCurrentStep(AppStep.UPLOAD);
    }
    if (storedModel) {
      setSelectedModel(storedModel);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    setCurrentStep(AppStep.UPLOAD);
  };

  const handleFilesReady = async (lesson: FileData, appendix: FileData) => {
    setFiles({ lesson, appendix });
    processIntegration(lesson, appendix);
  };

  const processIntegration = async (lesson: FileData, appendix: FileData) => {
    setCurrentStep(AppStep.PROCESSING);
    setProcessing({
      isLoading: true,
      message: 'Gemini đang phân tích cấu trúc giáo án và yêu cầu năng lực số...'
    });

    try {
      const result = await generateIntegratedContentWithFallback({
        apiKey,
        lessonPlanHtml: lesson.content,
        competenceText: appendix.content,
        selectedModelId: selectedModel,
        onModelSwitch: (from, to) => {
          setProcessing(prev => ({
            ...prev,
            message: `Model ${from} gặp lỗi, đang thử với ${to}...`
          }));
        }
      });

      setResultHtml(result.html);
      setUsedModel(result.usedModel);
      setCurrentStep(AppStep.PREVIEW);
    } catch (error: any) {
      setProcessing({
        isLoading: false,
        message: '',
        error: error.message || "Có lỗi xảy ra trong quá trình xử lý."
      });
      setCurrentStep(AppStep.UPLOAD);
      alert(error.message || "Có lỗi xảy ra trong quá trình xử lý.");
    } finally {
      setProcessing(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRetry = () => {
    setCurrentStep(AppStep.UPLOAD);
    setFiles({ lesson: null, appendix: null });
    setResultHtml('');
    setUsedModel('');
  };

  const resetKey = () => {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    setApiKey('');
    setCurrentStep(AppStep.API_KEY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A90E2] to-[#FF9500] font-sans text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 text-white p-4 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white text-blue-600 p-2 rounded-lg shadow-lg">
              <Layers className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">TICH HOP NLS<span className="text-orange-200">.</span></h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Settings Button - Always visible with red text */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings (API Key)</span>
            </button>

            {/* Get API Key link - Red text */}
            <a
              href={API_KEY_HELP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-red-200 hover:text-red-100 font-medium"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Lấy API key để sử dụng app</span>
            </a>

            {apiKey && (
              <button
                onClick={resetKey}
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
              >
                Reset Key
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full">
        {currentStep === AppStep.API_KEY && (
          <ApiKeyInput onSave={handleSaveKey} />
        )}

        {currentStep === AppStep.UPLOAD && (
          <FileUpload onFilesReady={handleFilesReady} />
        )}

        {currentStep === AppStep.PROCESSING && (
          <LoadingOverlay message={processing.message} />
        )}

        {currentStep === AppStep.PREVIEW && (
          <ResultEditor
            initialHtml={resultHtml}
            fileName={files.lesson?.name || 'Giao_an_moi'}
            onRetry={handleRetry}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-white/60 text-sm">
        <p>© 2024 Tích hợp Năng lực số - Powered by Google Gemini</p>
        {usedModel && currentStep === AppStep.PREVIEW && (
          <p className="text-xs mt-1">Model đã sử dụng: {usedModel}</p>
        )}
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleSaveKey}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    </div>
  );
};

export default App;