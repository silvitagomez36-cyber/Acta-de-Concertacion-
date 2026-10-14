import React, { useState } from 'react';
import { 
  Compass, 
  CheckSquare, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Lightbulb, 
  ShieldCheck, 
  Users, 
  Clock, 
  Zap, 
  ArrowRight,
  HelpCircle,
  Coffee,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { ActaData } from '../types';

interface FacilitatorToolkitProps {
  actaData: ActaData;
}

export const FacilitatorToolkit: React.FC<FacilitatorToolkitProps> = ({ actaData }) => {
  // Checklist items state
  const [checklist, setChecklist] = useState<{ id: string; text: string; done: boolean; category: string }[]>([
    { id: 'c1', text: 'Confirmar cupo mínimo de al menos 15 aprendices inscritos (actual: ' + actaData.learners.length + ')', done: actaData.learners.length >= 15, category: 'Institucional' },
    { id: 'c2', text: 'Verificar autorizaciones y acudientes registrados para menores de 14 a 17 años', done: true, category: 'Protección y Legal' },
    { id: 'c3', text: 'Coordinar con el Presidente de la JAC la llave del Salón Comunal y 25 sillas', done: true, category: 'Logística' },
    { id: 'c4', text: 'Probar tomas de energía y llevar multicontacto (regulador de voltaje)', done: false, category: 'Logística' },
    { id: 'c5', text: 'Verificar que la franja horaria acordada permita el regreso a las fincas con luz de día', done: true, category: 'Seguridad' },
    { id: 'c6', text: 'Llevar copias impresas del acta y almohadilla de tinta para huellas dactilares', done: false, category: 'Documental' },
    { id: 'c7', text: 'Preparar grupo de WhatsApp comunitario con audios cortos explicativos de bienvenida', done: true, category: 'Pedagógico' },
    { id: 'c8', text: 'Asegurar botellón de agua o coordinar el refrigerio comunitario tradicional', done: false, category: 'Convivencia' },
  ]);

  // AI Prompting
  const [userPrompt, setUserPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAskAi = async (promptToSend?: string) => {
    const q = promptToSend || userPrompt;
    if (!q.trim()) return;

    setIsLoadingAi(true);
    setAiError('');

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          context: {
            vereda: actaData.locality,
            municipio: actaData.municipality,
            curso: actaData.trainingCourseName,
            dia: actaData.sessionDay,
            horario: actaData.sessionTime,
            aprendices: actaData.learners.length,
            menores: actaData.learners.filter(l => l.isMinor).length
          }
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al conectar con el asistente');
      }
      setAiResponse(data.reply);
    } catch (err: any) {
      console.warn('Fallback offline advice activated:', err);
      // Helpful offline curated pedagogical advice fallback
      setAiResponse(`Consejo Pedagógico para ${actaData.locality}:
1. En reuniones rurales, inicie siempre con una ronda de saludo reconociendo el esfuerzo del traslado a pie o a caballo.
2. Forme duplas de un joven de 15 años con un adulto mayor: el joven le ayuda a perder el miedo a la pantalla táctil y el adulto comparte su experiencia productiva.
3. Recuerde que el acta no es un contrato punitivo, sino un pacto comunitario de palabra respaldado en papel.`);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const completedCount = checklist.filter(c => c.done).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Toolkit Header */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-slate-900">
              Caja de Herramientas del Facilitador Comunitario Rural
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Protocolos de asamblea, lista de chequeo operativo en vereda y asesor pedagógico
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{completedCount} de {checklist.length} requisitos listos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Step-by-Step Community Assembly Protocol */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-800" />
              Protocolo de 5 Pasos para la Asamblea de Concertación
            </h3>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
              Guía en Campo
            </span>
          </div>

          <div className="space-y-3 text-xs">
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                  1
                </span>
                <span className="font-bold text-slate-900">Apertura y Reconocimiento de Saberes</span>
              </div>
              <p className="text-slate-600 pl-7 leading-relaxed">
                Saludar cordialmente, agradecer la presencia y aclarar que la tecnología viene a fortalecer la agricultura y la vida comunitaria, no a reemplazar sus tradiciones.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                  2
                </span>
                <span className="font-bold text-slate-900">Demostración Práctica "Cero Miedo"</span>
              </div>
              <p className="text-slate-600 pl-7 leading-relaxed">
                Mostrar en 5 minutos una función práctica y útil en un celular (ej. enviar una nota de voz a un comprador, consultar el pronóstico de lluvias o tomar una foto nítida de una hoja enferma).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                  3
                </span>
                <span className="font-bold text-slate-900">Concertación Abierta de Horarios y Sedes</span>
              </div>
              <p className="text-slate-600 pl-7 leading-relaxed">
                Someter a votación a mano alzada el día de la semana y las horas. Confirmar que no coincida con el mercado municipal ni con faenas críticas de recolección.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                  4
                </span>
                <span className="font-bold text-slate-900">Lectura en Voz Alta del Acta Completa</span>
              </div>
              <p className="text-slate-600 pl-7 leading-relaxed">
                Leer con voz clara y pausada cada uno de los puntos, haciendo pausas para verificar que no queden dudas en términos de compromisos o cuidado de los equipos.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-[10px]">
                  5
                </span>
                <span className="font-bold text-slate-900">Suscripción Comunitaria y Copia a la JAC</span>
              </div>
              <p className="text-slate-600 pl-7 leading-relaxed">
                Llamar a los 15+ participantes para estampar su firma manuscrita o su huella dactilar. Entregar formalmente una copia física firmada al Presidente de la JAC para el archivo veredal.
              </p>
            </div>

          </div>
        </div>

        {/* Operational Checklist */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-800" />
              Lista de Chequeo Operativo en Terreno
            </h3>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Antes de Iniciar
            </span>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item) => (
              <label
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  item.done
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => {}}
                  className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4"
                />
                <div className="flex-1 text-xs">
                  <span className={item.done ? 'line-through text-slate-500 font-medium' : 'font-semibold text-slate-800'}>
                    {item.text}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
                    Categoría: {item.category}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

      </div>

      {/* AI Pedagogical Advisor for Rural Contexts */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Asesor Técnico-Pedagógico para Situaciones Rurales
              </h3>
              <p className="text-xs text-slate-500">
                Consulte con IA cómo adaptar cláusulas ante lluvias, cosechas, préstamos de celulares o resistencia tecnológica
              </p>
            </div>
          </div>
        </div>

        {/* Quick query chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold self-center">Consultas frecuentes:</span>
          <button
            onClick={() => {
              setUserPrompt('¿Cómo redactar un acuerdo si la mitad del grupo comparte un solo celular por familia?');
              handleAskAi('¿Cómo redactar un acuerdo si la mitad del grupo comparte un solo celular por familia?');
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg text-slate-700 transition-colors border border-slate-200"
          >
            📱 Celulares compartidos por familia
          </button>
          <button
            onClick={() => {
              setUserPrompt('¿Qué hacer si la época de lluvias intensas bloquea el camino veredal un día pactado?');
              handleAskAi('¿Qué hacer si la época de lluvias intensas bloquea el camino veredal un día pactado?');
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg text-slate-700 transition-colors border border-slate-200"
          >
            🌧️ Caminos tapados por lluvias
          </button>
          <button
            onClick={() => {
              setUserPrompt('¿Cómo motivar a un adulto mayor campesino que dice que la tecnología no es para él?');
              handleAskAi('¿Cómo motivar a un adulto mayor campesino que dice que la tecnología no es para él?');
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 rounded-lg text-slate-700 transition-colors border border-slate-200"
          >
            👵 Desbloqueo emocional adultos mayores
          </button>
        </div>

        {/* Search input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
            placeholder="Escriba su consulta pedagógica o situación especial en la vereda..."
            className="flex-1 text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
          />
          <button
            onClick={() => handleAskAi()}
            disabled={isLoadingAi || !userPrompt.trim()}
            className="px-4 py-3 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            {isLoadingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Consultar
          </button>
        </div>

        {/* AI Response Card */}
        {aiResponse && (
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2 animate-fadeIn text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-950">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              Orientación Pedagógica del Facilitador Experto:
            </div>
            <div className="text-slate-800 whitespace-pre-line leading-relaxed pl-6">
              {aiResponse}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
