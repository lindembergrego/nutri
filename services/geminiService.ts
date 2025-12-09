import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface FoodAnalysisResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

export const analyzeFoodDescription = async (description: string): Promise<FoodAnalysisResult | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analise o seguinte alimento ou refeição e estime as calorias e macronutrientes. Seja preciso. Se a quantidade não for especificada, assuma uma porção média padrão: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Nome curto e claro do prato" },
            calories: { type: Type.NUMBER, description: "Total de calorias (kcal)" },
            protein: { type: Type.NUMBER, description: "Proteínas em gramas" },
            carbs: { type: Type.NUMBER, description: "Carboidratos em gramas" },
            fat: { type: Type.NUMBER, description: "Gorduras em gramas" },
            confidence: { type: Type.NUMBER, description: "Nível de confiança na estimativa (0-100)" }
          },
          required: ["name", "calories", "protein", "carbs", "fat", "confidence"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FoodAnalysisResult;
    }
    return null;
  } catch (error) {
    console.error("Erro ao analisar comida com Gemini:", error);
    return null;
  }
};

export const getHealthTip = async (userProfile: any, currentIntake: number): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `O usuário tem o objetivo de ${userProfile.goal}. Sua meta diária é ${userProfile.tdee} kcal. Hoje ele consumiu ${currentIntake} kcal. Dê uma dica curta, motivacional e prática de saúde em uma frase.`,
        });
        return response.text || "Mantenha o foco na sua saúde!";
    } catch (e) {
        return "Hidrate-se bem hoje!";
    }
}
