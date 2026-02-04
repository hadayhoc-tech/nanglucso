// Danh sách models theo thứ tự fallback (AI_INSTRUCTIONS.md)
// Sử dụng tên model chính xác từ Gemini API
export const AI_MODELS = [
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Nhanh nhất, phù hợp cho hầu hết tác vụ',
    isDefault: true,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    description: 'Chất lượng cao hơn, xử lý tốt văn bản dài',
    isDefault: false,
  },
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash (Experimental)',
    description: 'Phiên bản mới nhất, đang thử nghiệm',
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
