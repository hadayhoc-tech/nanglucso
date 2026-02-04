// Danh sách models theo thứ tự fallback (AI_INSTRUCTIONS.md)
export const AI_MODELS = [
  {
    id: 'gemini-2.5-flash-preview-04-17',
    name: 'Gemini 2.5 Flash',
    description: 'Nhanh nhất, phù hợp cho hầu hết tác vụ',
    isDefault: true,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Cân bằng tốc độ và chất lượng',
    isDefault: false,
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    description: 'Ổn định, fallback option',
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
