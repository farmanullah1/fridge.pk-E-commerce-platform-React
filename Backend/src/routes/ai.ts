import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

const router = Router();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient && env.geminiApiKey) {
    aiClient = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }
  return aiClient;
}

router.post('/consult', async (req, res) => {
  const { messages, userProfile } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array.' });
  }

  const userQuery = messages[messages.length - 1]?.text || '';
  const locationText = userProfile?.location || 'Pakistan';
  const userRoomText = userProfile?.roomSize || '';
  const membersCount = userProfile?.familyMembers || '3-4 members';

  try {
    const ai = getGeminiClient();
    if (ai) {
      const systemPrompt = `You are the Official AI Consultation Assistant of fridge.pk, Pakistan's leading specialized e-commerce store for smart refrigerators, deep freezers, inverter air conditioners, and kitchen coolers.
Respond with professional, friendly, localized technical advice for Pakistan (load shedding, high temperatures, voltage fluctuations, solar compatibility, NEPRA tariffs).

User facts:
- Location: ${locationText}
- Family size: ${membersCount}
- Room size: ${userRoomText || 'Not specified'}

Use clear Markdown. Recommend brands: Haier, Dawlance, PEL, Waves, Gree.`;

      const contents = messages
        .map((m: { sender: string; text: string }) =>
          m.sender === 'user' ? m.text : `Assistant: ${m.text}`
        )
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `${contents}\n\nUser Question: ${userQuery}`,
        config: { systemInstruction: systemPrompt, temperature: 0.7 },
      });

      const text = response.text;
      if (text) return res.json({ text });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Gemini API Error, using fallback:', message);
  }

  const queryLower = userQuery.toLowerCase();
  let reply = '';

  if (
    queryLower.includes('ac') ||
    queryLower.includes('air cond') ||
    queryLower.includes('ton') ||
    queryLower.includes('room')
  ) {
    reply = `### **fridge.pk AI Expert AC Recommendation** ❄️\n\nBased on your location (**${locationText}**):\n\n- **Under 120 sq ft**: 1.0 Ton Inverter AC\n- **120–180 sq ft**: 1.5 Ton (Gree GS-18PITH11W or Haier Pearl)\n- **Over 180 sq ft**: 2.0 Ton split system\n\nModern T3 compressors run well on solar/UPS once temperature is locked.`;
  } else if (
    queryLower.includes('fridge') ||
    queryLower.includes('refrigerator') ||
    queryLower.includes('double door')
  ) {
    reply = `### **fridge.pk Refrigerator Recommendation** ❄️\n\nFor **${membersCount}** in **${locationText}**:\n\n- **1–2 persons**: Haier HR-135G single-door\n- **3–5 persons**: 250–350L double door (Pel Pride 3300, Dawlance Reflex)\n- **6+ persons**: Haier Quad-Inverter luxury four-door\n\nInverter models run on 140V–260V without external stabilizers.`;
  } else if (
    queryLower.includes('solar') ||
    queryLower.includes('bill') ||
    queryLower.includes('watt')
  ) {
    reply = `### **Energy & Solar Insights** 🌞\n\n- Inverter fridges: ~70–130W when locked\n- Inverter AC ECO: ~300–600W\n- Use our **Bill Calculator** in the menu for savings estimates.`;
  } else {
    reply = `### **Welcome to fridge.pk AI Hub** ❄️\n\nAsk about AC tonnage, inverter refrigerators for UPS/solar, or Vitamin Fresh technology. Location: **${locationText}**, family: **${membersCount}**.`;
  }

  res.json({ text: reply });
});

export default router;
