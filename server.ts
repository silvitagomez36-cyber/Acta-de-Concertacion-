import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Server-side Gemini API route for pedagogical adaptation
app.post('/api/gemini/assist', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Falta el prompt de consulta' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ 
        error: 'API Key de Gemini no configurada en el servidor. Puede continuar utilizando las funciones locales del acta.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Eres un Facilitador Comunitario y Redactor Técnico-Pedagógico de élite con 20 años de experiencia en alfabetización digital rural. 
Tu rol es orientar a facilitadores en campo sobre cómo adaptar acuerdos, resolver inquietudes de comunidades campesinas con baja escolaridad, diseñar dinámicas sin tecnicismos y redactar cláusulas claras, empáticas y con validez legal.
Usa un tono cálido, respetuoso del campesinado, práctico y libre de burocracia abstracta.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Contexto comunitario:\n${JSON.stringify(context || {})}\n\nConsulta pedagógica del facilitador:\n${prompt}` }
          ]
        }
      ],
      config: {
        systemInstruction,
        temperature: 0.4,
      }
    });

    const reply = response.text || 'Sin respuesta generada.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error al consultar Gemini:', error);
    res.status(500).json({ error: error.message || 'Error procesando solicitud con IA' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
