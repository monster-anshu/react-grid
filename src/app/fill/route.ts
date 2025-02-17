import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  content: z.array(z.array(z.string())),
});

export async function POST(request: Request) {
  const json = await request.json();
  const data = requestSchema.parse(json);

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

  const prompt = `You are a spreadsheet autofill assistant.  Given the following data representing a column in a spreadsheet, complete the missing values by continuing the existing pattern. Return the completed data as a valid JSON array of strings.
Data:
${JSON.stringify(data, null, 2)}
`;
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return NextResponse.json({ content: JSON.parse(text) });
}
