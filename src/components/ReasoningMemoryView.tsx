import React, { useState } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  HelpCircle, 
  FileText, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { REASONING_PHASES } from '../data/documentTemplate';

export const ReasoningMemoryView: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [copiedMemory, setCopiedMemory] = useState(false);

  const currentPhase = REASONING_PHASES.find(p => p.phaseNumber === selectedPhase) || REASONING_PHASES[0];

  const handleCopyMarkdownMemory = () => {
    let md = `# MEMORIA DE RAZONAMIENTO PREVIO (CADENA DE PENSAMIENTO TÉCNICO-PEDAGÓGICA)
*Proyecto de Formación en Comunidades Rurales - Facilitación y Concertación*\n\n`;

    REASONING_PHASES.forEach((phase) => {
      md += `## ${phase.title}\n**${phase.subtitle}**\n\n### Puntos Clave de Análisis:\n`;
      phase.keyInsights.forEach(insight => {
        md += `- ${insight}\n`;
      });
      md += `\n### Estrategias Pedagógicas Aplicadas:\n`;
      phase.pedagogicalStrategies.forEach(strat => {
        md += `- **Desafío identificado:** ${strat.challenge}\n  - *Acción adoptada:* ${strat.actionTaken}\n  - *Justificación pedagógica:* ${strat.rationale}\n`;
      });
      md += `\n**Aplicación al Contexto Rural:**\n${phase.ruralContextApplication}\n\n---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMemory(true);
    setTimeout(() => setCopiedMemory(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-teal-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-500/30">
              <BrainCircuit className="w-3.5 h-3.5" />
              Cadena de Razonamiento Previo (Zero-Shot CoT)
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Memoria de Razonamiento Técnico-Pedagógico
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Desglose analítico de las cuatro fases previas a la redacción del acta: evaluación lingüística, blindaje legal de menores y riesgos, estructura pedagógica semanal de 8 días y formulación del instrumento.
            </p>
          </div>

          <button
            onClick={handleCopyMarkdownMemory}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            {copiedMemory ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                ¡Memoria Copiada!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Memoria en Markdown
              </>
            )}
          </button>
        </div>

        {/* Phase Navigator Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6 pt-6 border-t border-white/10">
          {REASONING_PHASES.map((phase) => (
            <button
              key={phase.phaseNumber}
              onClick={() => setSelectedPhase(phase.phaseNumber)}
              className={`p-3 rounded-xl text-left transition-all relative ${
                selectedPhase === phase.phaseNumber
                  ? 'bg-emerald-600/90 text-white shadow-md ring-2 ring-emerald-400'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80 mb-0.5">
                Fase {phase.phaseNumber}
              </div>
              <div className="text-xs font-semibold line-clamp-1">
                {phase.title.split(': ')[1] || phase.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Phase Detail Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-6">
        
        {/* Phase Title & Subtitle */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              0{currentPhase.phaseNumber}
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {currentPhase.title}
              </h2>
              <p className="text-xs text-emerald-800 font-medium">
                {currentPhase.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Key Analysis Insights */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-700" />
            1. Puntos Críticos y Criterios Analizados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPhase.keyInsights.map((insight, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pedagogical Strategies & Rationale */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            2. Desafíos en Terreno vs. Respuestas Metodológicas
          </h3>
          <div className="space-y-3">
            {currentPhase.pedagogicalStrategies.map((strat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50/40 via-white to-emerald-50/30 space-y-2 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[11px] shrink-0">
                    Desafío {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {strat.challenge}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-0.5">
                      ✓ Acción Adoptada en el Acta
                    </span>
                    <p className="text-slate-700 text-xs">
                      {strat.actionTaken}
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                      ℹ Justificación Pedagógica y Cultural
                    </span>
                    <p className="text-slate-600 text-xs italic">
                      {strat.rationale}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Context Application */}
        <div className="p-4 bg-emerald-900 text-white rounded-xl text-xs space-y-1">
          <span className="text-emerald-300 font-bold uppercase tracking-wide text-[10px] block">
            Impacto Directo en la Práctica Rural
          </span>
          <p className="leading-relaxed text-slate-100">
            {currentPhase.ruralContextApplication}
          </p>
        </div>

      </div>

      {/* Comparative Matrix: Bureaucratic vs Community Tonal Approach */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-800" />
          <h3 className="font-bold text-slate-900 text-base">
            Matriz de Adaptación de Lenguaje: Del Trámite Frío a la Alianza Comunitaria
          </h3>
        </div>
        <p className="text-xs text-slate-600">
          Cómo se transformaron las cláusulas técnicas tradicionales para comunidades con escolaridad básica sin perder su validez jurídica:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-1/4">Concepto Institucional</th>
                <th className="py-2.5 px-3 font-semibold w-1/3 text-red-900">Enfoque Burocrático Frío (Evitado)</th>
                <th className="py-2.5 px-3 font-semibold w-5/12 text-emerald-900">Enfoque Comunitario Empático (Adoptado en el Acta)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Asistencia mínima</td>
                <td className="py-2.5 px-3 text-red-700 font-mono text-[11px]">
                  «La inasistencia injustificada al 15% de las horas causará cancelación automática de matrícula y sanción.»
                </td>
                <td className="py-2.5 px-3 text-emerald-900 bg-emerald-50/50">
                  <strong>«Pacto de permanencia solidaria»:</strong> Asistir puntualmente cada 8 días y avisar con anticipación para ponerse al día con su compañero de dupla.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Jóvenes de 14 años</td>
                <td className="py-2.5 px-3 text-red-700 font-mono text-[11px]">
                  «Se prohíbe el ingreso de menores sin poder notariado y póliza extracontractual de responsabilidad.»
                </td>
                <td className="py-2.5 px-3 text-emerald-900 bg-emerald-50/50">
                  <strong>«Relevo generacional con respaldo familiar»:</strong> Admisión de 14+ años con aval del acudiente en el acta y conformación de duplas con adultos mayores.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Herramientas digitales</td>
                <td className="py-2.5 px-3 text-red-700 font-mono text-[11px]">
                  «El discente deberá ingresar al LMS institucional con credenciales SSO y conexión banda ancha de 10 Mbps.»
                </td>
                <td className="py-2.5 px-3 text-emerald-900 bg-emerald-50/50">
                  <strong>«Aprender haciendo con lo propio»:</strong> Uso de su propio teléfono celular, WhatsApp, notas de voz y materiales descargados previamente sin gastar datos.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50">Firma del documento</td>
                <td className="py-2.5 px-3 text-red-700 font-mono text-[11px]">
                  «Solo se admitirá firma autógrafa cotejada o certificado de firma digital con token.»
                </td>
                <td className="py-2.5 px-3 text-emerald-900 bg-emerald-50/50">
                  <strong>«Inclusión y dignidad»:</strong> Se admite por igual la firma tradicional o la impresión de la huella dactilar tras la lectura pública en voz alta en la asamblea.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
