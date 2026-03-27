'use server';

import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export async function autoFill(content: (string | number)[][]) {
  const GEMINI_KEY = process.env.GEMINI_KEY as string;
  const schema = {
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
    },
  };

  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });

  const prompt = `You are a spreadsheet autofill assistant. Given the following data representing a column or row in a spreadsheet, complete the missing values by continuing the existing pattern. Return the completed data as a valid JSON array of strings or numbers.
Data:
${JSON.stringify(content, null, 1)}
`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return JSON.parse(text) as (string | number)[][];
}
