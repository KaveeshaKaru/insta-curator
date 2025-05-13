import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { caption } = await request.json();

    if (!caption || typeof caption !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing caption' }, { status: 400 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY as string,
    });

    const config = {
      responseMimeType: 'text/plain',
    };
    const model = 'gemini-2.5-flash-preview-04-17';
    
    // Prompt to enhance the Instagram caption
    const prompt = `You are an expert social media content creator specializing in Instagram. Enhance the following caption to make it more engaging, concise, and suitable for an Instagram audience. Keep the tone natural, add relevant emojis where appropriate, and ensure it aligns with Instagram's style (e.g., positive, inspiring, or trendy). If the caption is empty or very short, suggest a creative caption instead. Append exactly five popular and relatable hashtags that perfectly match the caption's content and are likely to boost interaction (e.g., trending, widely used hashtags relevant to the theme). Return only the enhanced caption text followed by the five hashtags, separated by spaces.

Original caption: "${caption}"`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let enhancedCaption = '';
    for await (const chunk of response) {
      enhancedCaption += chunk.text || '';
    }

    return NextResponse.json({ enhancedCaption }, { status: 200 });
  } catch (error) {
    console.error('Error enhancing caption:', error);
    return NextResponse.json({ error: 'Failed to enhance caption' }, { status: 500 });
  }
}