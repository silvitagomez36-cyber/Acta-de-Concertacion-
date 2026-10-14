import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, context } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Falta el prompt de consulta' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply: `Orientación Pedagógica para ${context?.vereda || 'la comunidad'}:\n1. En reuniones rurales, inicie siempre con una ronda de saludo reconociendo el esfuerzo del traslado a pie o a caballo.\n2. Forme duplas de un joven de 15 años con un adulto mayor: el joven le ayuda con la pantalla táctil y el adulto comparte su visión productiva.\n3. Recuerde que el acta no es un contrato punitivo, sino un pacto comunitario de palabra respaldado en papel.`
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
        temperature: 0.4
      }
    });

    res.status(200).json({ reply: response.text || 'Sin respuesta generada.' });
  } catch (error: any) {
    console.error('Error en API Vercel:', error);
    res.status(500).json({ error: error.message || 'Error procesando solicitud con IA' });
  }
}
