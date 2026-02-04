import { GoogleGenAI } from "@google/genai";
import { AI_MODELS, DEFAULT_MODEL_ID } from "../constants";

interface GenerateOptions {
  apiKey: string;
  lessonPlanHtml: string;
  competenceText: string;
  selectedModelId?: string;
  onModelSwitch?: (fromModel: string, toModel: string) => void;
}

interface GenerateResult {
  html: string;
  usedModel: string;
}

const SYSTEM_INSTRUCTION = `
Bạn là một trợ lý chuyên môn giáo dục, am hiểu chương trình GDPT 2018 và Công văn 5512.
Nhiệm vụ của bạn là tích hợp nội dung "Yêu cầu năng lực số" vào "Giáo án" (Kế hoạch bài dạy).

QUY TẮC QUAN TRỌNG:
1. Đọc nội dung Giáo án (dạng HTML) và Yêu cầu năng lực số (dạng văn bản).
2. Xác định các mục: "I. MỤC TIÊU" (phần năng lực) và "II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU" hoặc "III. TIẾN TRÌNH DẠY HỌC" (các hoạt động).
3. Chèn các yêu cầu năng lực số phù hợp vào các mục tiêu và hoạt động tương ứng.
4. GIỮ NGUYÊN cấu trúc HTML của giáo án gốc tối đa có thể.
5. BẮT BUỘC: Tất cả nội dung bạn chèn thêm vào phải được bao quanh bởi thẻ <span style="color: blue">...</span> để người dùng dễ nhận biết.
6. Chỉ trả về mã HTML của toàn bộ giáo án sau khi đã chỉnh sửa. Không trả về Markdown (\`\`\`html). Trả về raw string.
`;

// Attempt to call Gemini API with a specific model
async function tryGenerateWithModel(
  ai: GoogleGenAI,
  modelId: string,
  prompt: string
): Promise<string> {
  const response = await ai.models.generateContent({
    model: modelId,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { systemInstruction: SYSTEM_INSTRUCTION },
  });

  let resultHtml = response.text || "";

  // Clean up markdown code blocks if Gemini wraps them
  if (resultHtml.startsWith("```html")) {
    resultHtml = resultHtml.replace(/^```html/, "").replace(/```$/, "");
  } else if (resultHtml.startsWith("```")) {
    resultHtml = resultHtml.replace(/^```/, "").replace(/```$/, "");
  }

  return resultHtml.trim();
}

// Get list of models to try (starting with selected, then fallbacks)
function getModelsToTry(selectedModelId?: string): string[] {
  const modelIds: string[] = AI_MODELS.map(m => m.id as string);
  const startId = selectedModelId || DEFAULT_MODEL_ID;

  // Put selected model first, then others
  const startIndex = modelIds.indexOf(startId);
  if (startIndex > 0) {
    return [startId, ...modelIds.filter(id => id !== startId)];
  }
  return modelIds;
}

export const generateIntegratedContent = async (
  apiKey: string,
  lessonPlanHtml: string,
  competenceText: string
): Promise<string> => {
  const result = await generateIntegratedContentWithFallback({
    apiKey,
    lessonPlanHtml,
    competenceText,
  });
  return result.html;
};

export const generateIntegratedContentWithFallback = async (
  options: GenerateOptions
): Promise<GenerateResult> => {
  const { apiKey, lessonPlanHtml, competenceText, selectedModelId, onModelSwitch } = options;

  const ai = new GoogleGenAI({ apiKey });
  const modelsToTry = getModelsToTry(selectedModelId);

  const prompt = `
--- DỮ LIỆU ĐẦU VÀO ---

1. NỘI DUNG YÊU CẦU NĂNG LỰC SỐ (PHỤ LỤC III):
${competenceText}

2. NỘI DUNG GIÁO ÁN GỐC (HTML):
${lessonPlanHtml}

--- YÊU CẦU ---
Hãy thực hiện tích hợp năng lực số vào giáo án trên. 
Hãy tô màu xanh (style="color: blue") cho những đoạn văn bản bạn thêm vào.
Trả về kết quả là HTML đầy đủ.
  `;

  const errors: { model: string; error: string }[] = [];

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelId = modelsToTry[i];

    try {
      console.log(`[Gemini] Trying model: ${modelId}`);
      const html = await tryGenerateWithModel(ai, modelId, prompt);

      // Notify about model switch if applicable
      if (i > 0 && onModelSwitch) {
        onModelSwitch(modelsToTry[0], modelId);
      }

      return { html, usedModel: modelId };
    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      console.error(`[Gemini] Model ${modelId} failed:`, errorMessage);
      errors.push({ model: modelId, error: errorMessage });

      // Continue to next model
    }
  }

  // All models failed
  const errorDetails = errors
    .map(e => `• ${e.model}: ${e.error}`)
    .join('\n');

  throw new Error(
    `Tất cả các model AI đều thất bại:\n${errorDetails}\n\nVui lòng kiểm tra API Key hoặc thử lại sau.`
  );
};