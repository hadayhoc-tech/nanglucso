// Danh sách models theo thứ tự fallback (AI_INSTRUCTIONS.md)
// Model mặc định: gemini-3-flash-preview
// Fallback: gemini-3-pro-preview -> gemini-2.5-flash
export const AI_MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Mặc định - Nhanh và ổn định',
    isDefault: true,
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Chất lượng cao, xử lý văn bản dài tốt',
    isDefault: false,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Phiên bản ổn định, fallback option',
    isDefault: false,
  },
] as const;

export const DEFAULT_MODEL_ID = AI_MODELS[0].id;

// Local storage keys
export const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  SELECTED_MODEL: 'gemini_selected_model',
} as const;

// API Key help link
export const API_KEY_HELP_URL = 'https://aistudio.google.com/apikey';
