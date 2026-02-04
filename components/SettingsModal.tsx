import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Check, Cpu } from 'lucide-react';
import { AI_MODELS, API_KEY_HELP_URL, STORAGE_KEYS, DEFAULT_MODEL_ID } from '../constants';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: string;
    onApiKeyChange: (key: string) => void;
    selectedModel: string;
    onModelChange: (modelId: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    apiKey,
    onApiKeyChange,
    selectedModel,
    onModelChange,
}) => {
    const [inputKey, setInputKey] = useState(apiKey);

    useEffect(() => {
        setInputKey(apiKey);
    }, [apiKey]);

    if (!isOpen) return null;

    const handleSaveKey = () => {
        if (inputKey.trim()) {
            onApiKeyChange(inputKey.trim());
            localStorage.setItem(STORAGE_KEYS.API_KEY, inputKey.trim());
        }
    };

    const handleModelSelect = (modelId: string) => {
        onModelChange(modelId);
        localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, modelId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Cpu className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Thiết lập Model & API Key</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Model Selection */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Chọn Model AI</h3>
                        <div className="space-y-2">
                            {AI_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => handleModelSelect(model.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selectedModel === model.id
                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-gray-800">{model.name}</span>
                                                {model.isDefault && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                        Mặc định
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{model.description}</p>
                                        </div>
                                        {selectedModel === model.id && (
                                            <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            * Nếu model chính gặp lỗi, hệ thống sẽ tự động thử các model khác
                        </p>
                    </div>

                    {/* API Key Input */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">API Key</h3>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                                placeholder="AIzaSy..."
                            />
                            <button
                                onClick={handleSaveKey}
                                disabled={!inputKey.trim() || inputKey === apiKey}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                Lưu
                            </button>
                        </div>
                        <a
                            href={API_KEY_HELP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Lấy API Key miễn phí tại đây
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};
