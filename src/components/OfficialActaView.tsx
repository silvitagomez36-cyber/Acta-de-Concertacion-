import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  FileCheck, 
  Fingerprint, 
  Volume2, 
  VolumeX, 
  Printer, 
  Copy, 
  Check, 
  PenLine, 
  HeartHandshake, 
  AlertCircle,
  FileDown,
  Download,
  Loader2
} from 'lucide-react';
import { ActaData, Learner } from '../types';
import { generateActaMarkdown } from '../data/documentTemplate';
import { exportToWord, exportToPdf } from '../utils/documentExport';

interface OfficialActaViewProps {
  data: ActaData;
  onOpenSignatureModal: (learner: Learner) => void;
  onPrint: () => void;
}

export const OfficialActaView: React.FC<OfficialActaViewProps> = ({
  data,
  onOpenSignatureModal,
  onPrint
}) => {
  const [viewMode, setViewMode] = useState<'normal' | 'brackets'>('normal');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentReadingSection, setCurrentReadingSection] = useState<string>('');
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const isBracket = viewMode === 'brackets';

  const handleDownloadWord = async () => {
    try {
      setIsExportingWord(true);
      await exportToWord(data, isBracket);
    } catch (err) {
      console.error('Error al exportar a Word:', err);
      alert('Hubo un error al generar el archivo Word (.docx). Intente nuevamente.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      const safeLocality = data.locality.replace(/\s+/g, '_');
      await exportToPdf('official-acta-document', `Acta_Concertacion_${safeLocality}_2026.pdf`);
    } catch (err) {
      console.error('Error al exportar a PDF:', err);
      // Fallback to browser's native print to PDF dialog
      onPrint();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyMarkdown = () => {
    const md = generateActaMarkdown(data, isBracket);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('La síntesis de voz no está soportada en este navegador.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentReadingSection('');
      return;
    }

    const textToRead = `Acta formal de concertación y compromiso comunitario. Entidad formativa: ${data.entityName}. Programa: ${data.programName}. Curso: ${data.trainingCourseName}. Objetivo general: ${data.generalObjective}. Lugar concertado: ${data.meetingPlace}, en la vereda ${data.locality}, municipio de ${data.municipality}. Día acordado: ${data.sessionDay}, en el horario de ${data.sessionTime}, con frecuencia semanal cada 8 días. Se establece un cupo mínimo de quince aprendices registrados, incluyendo jóvenes desde los 14 años con apoyo de acudiente. Todos los acuerdos han sido leídos en asamblea pública y aprobados de manera unánime.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95; // comfortable cadence for rural community listening
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentReadingSection('Lectura asistida en curso para la comunidad...');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentReadingSection('');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentReadingSection('');
    };

    window.speechSynthesis.speak(utterance);
  };

  const renderValue = (val: string, bracketPlaceholder: string) => {
    if (isBracket) {
      return (
        <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-medium border border-amber-300">
          [{bracketPlaceholder}]
        </span>
      );
    }
    return <span>{val}</span>;
  };

  const minorsCount = data.learners.filter(l => l.isMinor).length;
  const adultsCount = data.learners.filter(l => !l.isMinor).length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Top Controls Toolbar (Hidden in print) */}
      <div className="no-print bg-white rounded-2xl shadow-xs border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 text-emerald-800 p-2 rounded-xl">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Vista del Documento Formal
            </h2>
            <p className="text-xs text-slate-500">
              Listo para asamblea pública, concertación y firma comunitaria
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setViewMode('normal')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'normal'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vista Concertada (Real)
          </button>
          <button
            onClick={() => setViewMode('brackets')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'brackets'
                ? 'bg-amber-700 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Modo Plantilla [Corchetes]
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio read-aloud button for accessibility in rural community */}
          <button
            onClick={toggleSpeech}
            title="Lectura en voz alta para la asamblea (útil para personas con dificultades de lectura)"
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSpeaking
                ? 'bg-red-100 text-red-700 hover:bg-red-200 animate-pulse'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                Detener Lectura
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                Lectura Asistida
              </>
            )}
          </button>

          {/* Word Download Button */}
          <button
            onClick={handleDownloadWord}
            disabled={isExportingWord}
            title="Descargar documento editable en formato Microsoft Word (.docx)"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs flex items-center gap-1.5 transition-all hover:shadow active:scale-95 disabled:opacity-50"
          >
            {isExportingWord ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando Word...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                Descargar Word (.docx)
              </>
            )}
          </button>

          {/* PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            title="Descargar documento oficial en formato PDF (.pdf)"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white shadow-xs flex items-center gap-1.5 transition-all hover:shadow active:scale-95 disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Descargar PDF (.pdf)
              </>
            )}
          </button>

          {/* Print dialog */}
          <button
            onClick={onPrint}
            title="Imprimir documento oficial en papel"
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-xs flex items-center gap-1.5 transition-all hover:shadow"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>

          {/* Markdown Copy */}
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-colors"
            title="Copiar texto en formato Markdown"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                MD
              </>
            )}
          </button>
        </div>
      </div>

      {/* Audio speech indicator banner */}
      {isSpeaking && (
        <div className="no-print bg-teal-600 text-white text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span>
              <strong>Leyendo en voz alta:</strong> {currentReadingSection}
            </span>
          </div>
          <button
            onClick={toggleSpeech}
            className="underline font-bold text-teal-100 hover:text-white text-xs"
          >
            Silenciar
          </button>
        </div>
      )}

      {/* Official Document Sheet (Paper representation) */}
      <div 
        id="official-acta-document"
        className="printable-document bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-slate-900"
      >
        
        {/* Document Top Bar - Institutional Watermark/Border */}
        <div className="h-3 bg-gradient-to-r from-emerald-800 via-teal-700 to-amber-700" />

        <div className="p-8 sm:p-12 space-y-8 font-serif-doc text-slate-800 leading-relaxed text-sm md:text-base">
          
          {/* Header & Seal */}
          <div className="border-b-2 border-slate-800 pb-6 text-center space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div className="text-left font-sans text-xs text-slate-500">
                <span className="font-semibold block text-slate-700">REPÚBLICA DE COLOMBIA</span>
                <span>DESARROLLO COMUNITARIO RURAL</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-300 rounded-md font-sans text-xs font-bold text-amber-900">
                <span>RADICADO:</span>
                {renderValue(data.actCode, 'CÓDIGO DE ACTA')}
              </div>
            </div>

            <div className="pt-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950 uppercase font-sans">
                {renderValue(data.entityName, 'NOMBRE DE LA ENTIDAD FORMATIVA')}
              </h1>
              <p className="text-xs md:text-sm font-sans font-semibold text-emerald-800 uppercase tracking-wide">
                {renderValue(data.programName, 'PROGRAMA DE FORMACIÓN')}
              </p>
            </div>

            <div className="pt-3">
              <div className="inline-block bg-slate-900 text-white font-sans font-bold text-base md:text-lg px-6 py-1.5 rounded-sm shadow-xs uppercase">
                Acta de Concertación y Compromiso Comunitario
              </div>
              <p className="text-xs md:text-sm font-sans font-medium text-slate-600 mt-1">
                Acción Formativa: <strong className="text-slate-900">{renderValue(data.trainingCourseName, 'NOMBRE DEL CURSO')}</strong>
              </p>
            </div>
          </div>

          {/* Section 1: Institutional & General Objective */}
          <section className="space-y-3">
            <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-2 border-b border-emerald-900/20 pb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-sans">1</span>
              Encabezado Institucional y Objetivo General
            </h2>
            <p className="text-justify leading-relaxed">
              En el marco de la estrategia de democratización del conocimiento y cierre de brechas digitales en los territorios rurales, se suscribe la presente <strong>Acta de Concertación y Compromiso Comunitario</strong> con el fin de formalizar los acuerdos pedagógicos, humanos y logísticos entre la entidad formadora y los habitantes de la comunidad.
            </p>
            <div className="p-4 bg-emerald-50/60 rounded-xl border-l-4 border-emerald-800 text-slate-800 font-sans text-xs md:text-sm">
              <strong className="block text-emerald-950 font-bold mb-1">
                Objetivo General Concertado:
              </strong>
              {renderValue(data.generalObjective, 'OBJETIVO GENERAL DE LA CAPACITACIÓN')}
            </div>
          </section>

          {/* Section 2: Territorial & Meeting Data */}
          <section className="space-y-4">
            <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-2 border-b border-emerald-900/20 pb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-sans">2</span>
              Datos Generales de Concertación Territorial
            </h2>

            <div className="font-sans grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Departamento / Municipio</span>
                <span className="font-bold text-slate-800">
                  {renderValue(data.department, 'DEPARTAMENTO')} / {renderValue(data.municipality, 'MUNICIPIO')}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Vereda o Caserío</span>
                <span className="font-bold text-emerald-900">
                  {renderValue(data.locality, 'VEREDA O LOCALIDAD')}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Sede Física Concertada</span>
                <span className="font-bold text-slate-800">
                  {renderValue(data.meetingPlace, 'SEDE FÍSICA / SALÓN COMUNAL')}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Día Pactado</span>
                <span className="font-bold text-slate-800">
                  {renderValue(data.sessionDay, 'DÍA DE LA SEMANA')}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Franja Horaria</span>
                <span className="font-bold text-slate-800">
                  {renderValue(data.sessionTime, 'FRANJA HORARIA')}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Frecuencia de Encuentros</span>
                <span className="font-bold text-emerald-900">
                  {renderValue(data.frequencyText, 'FRECUENCIA SEMANAL CADA 8 DÍAS')}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80 sm:col-span-2">
                <span className="text-slate-500 block text-[11px] font-medium">Facilitador(a) Comunitario(a)</span>
                <span className="font-bold text-slate-800">
                  {renderValue(data.facilitatorName, 'NOMBRE DEL FACILITADOR/A')} ({renderValue(data.facilitatorDocument, 'DOCUMENTO')} - Tel: {renderValue(data.facilitatorPhone, 'TELÉFONO')})
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200/80">
                <span className="text-slate-500 block text-[11px] font-medium">Representante Comunal</span>
                <span className="font-bold text-slate-800">
                  {renderValue(data.communityLeaderName, 'LÍDER JAC')} ({renderValue(data.communityLeaderRole, 'CARGO')})
                </span>
              </div>
            </div>
          </section>

          {/* Section 3: Table of Logistics & Timeline (Required Table) */}
          <section className="space-y-4">
            <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-2 border-b border-emerald-900/20 pb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-sans">3</span>
              Tabla de Logística y Cronograma Concertado
            </h2>
            <p className="text-xs text-slate-600 font-sans italic">
              Acuerdos puntuales tomados en consenso con la asamblea de participantes:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border border-slate-300 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold w-1/4 border-r border-slate-700">Parámetro</th>
                    <th className="py-2.5 px-3 font-semibold w-2/5 border-r border-slate-700">Detalle Concertado</th>
                    <th className="py-2.5 px-3 font-semibold w-1/3">Observaciones Comunitarias</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.logistics.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="py-3 px-3 font-bold text-slate-900 border-r border-slate-200 align-top">
                        {renderValue(item.parameter, item.parameter)}
                      </td>
                      <td className="py-3 px-3 text-slate-800 border-r border-slate-200 align-top">
                        {renderValue(item.agreedDetail, `Detalle de ${item.parameter}`)}
                      </td>
                      <td className="py-3 px-3 text-slate-600 italic align-top">
                        {renderValue(item.communityObservations, `Observación de la comunidad`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Conditions & Methodological Agreements */}
          <section className="space-y-4">
            <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-2 border-b border-emerald-900/20 pb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-sans">4</span>
              Condiciones y Acuerdos Metodológicos
            </h2>

            {/* 4.1 Sostenibilidad y Cupo Mínimo */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wide flex items-center gap-1.5 text-emerald-900">
                <Users className="w-4 h-4 text-emerald-700" />
                4.1. Cupo Mínimo de Aprendices (Sostenibilidad del Curso)
              </h3>
              <p className="text-justify text-xs md:text-sm">
                Se ratifica que el programa requiere un <strong>cupo mínimo formal de {data.minLearners} aprendices registrados y activos</strong> para justificar el desplazamiento técnico del facilitador y la sostenibilidad de los recursos públicos o institucionales. A la fecha de suscripción, se registran formalmente <strong>{data.learners.length} aprendices</strong> ({adultsCount} adultos y {minorsCount} jóvenes desde los 14 años). La comunidad asume la corresponsabilidad solidaria de velar por que ningún compañero deserte sin antes gestionar apoyo mutuo.
              </p>
            </div>

            {/* 4.2 Participación de Jóvenes desde 14 años y Adultos */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wide flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                4.2. Participación Inclusiva de Menores de Edad (14+ años) y Adultos Mayores
              </h3>
              <p className="text-justify text-xs md:text-sm">
                {renderValue(data.youthPolicyText, 'POLÍTICA DE PARTICIPACIÓN DE MENORES DE EDAD Y ACOMPAÑAMIENTO FAMILIAR')}
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 font-sans text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Salvaguarda Pedagógica:</strong> Todo aprendiz menor de 18 años cuenta en este registro con la identificación de su acudiente legal y se priorizará su trabajo como monitor tecnológico solidario, haciendo dupla de aprendizaje con vecinos adultos o abuelos de la vereda.
                </span>
              </div>
            </div>

            {/* 4.3 Metodología de Herramientas Digitales Adaptadas a la Brecha Rural */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wide flex items-center gap-1.5 text-emerald-900">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                4.3. Metodología de Herramientas Digitales Adaptadas al Contexto Rural
              </h3>
              <p className="text-justify text-xs md:text-sm">
                Entendiendo las limitaciones de conectividad fija en la zona y los temores naturales a la manipulación de tecnología táctil, la metodología se basará en el principio de <em>"Aprender Haciendo sin Temor"</em>, empleando recursos sencillos:
              </p>
              <ul className="list-disc list-inside font-sans text-xs space-y-1 text-slate-800 pl-2">
                {data.digitalToolsAgreed.map((tool, idx) => (
                  <li key={idx}>
                    {renderValue(tool, `Herramienta digital acordada ${idx + 1}`)}
                  </li>
                ))}
              </ul>
              <p className="text-justify text-xs md:text-sm italic text-slate-700">
                {renderValue(data.connectivityNotes, 'NOTAS DE CONECTIVIDAD Y MATERIAL OFFLINE')}
              </p>
            </div>
          </section>

          {/* Section 5: Mutual Commitments */}
          <section className="space-y-4">
            <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-2 border-b border-emerald-900/20 pb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-sans">5</span>
              Compromisos Mutuos de las Partes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
              
              {/* Facilitator commitments */}
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-950 font-bold border-b border-emerald-200 pb-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>5.1. Del Facilitador / Entidad Formativa</span>
                </div>
                <ul className="space-y-2 text-slate-800">
                  {data.facilitatorCommitments.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">
                        {renderValue(c, `Compromiso del facilitador ${idx + 1}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community commitments */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold border-b border-amber-200 pb-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-800 text-white flex items-center justify-center text-xs">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <span>5.2. De los Aprendices y la Comunidad</span>
                </div>
                <ul className="space-y-2 text-slate-800">
                  {data.communityCommitments.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">
                        {renderValue(c, `Compromiso de la comunidad ${idx + 1}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

          {/* Section 6: Final Verdict / Declaratoria de Aceptación */}
          <section className="space-y-3 bg-slate-50 p-5 rounded-xl border-2 border-dashed border-slate-300">
            <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-sans">6</span>
              Veredicto Final y Declaratoria de Aceptación Mutua
            </h2>
            <p className="text-justify font-serif-doc text-slate-800 text-sm md:text-base leading-relaxed">
              {renderValue(data.finalVerdictText, 'DECLARATORIA FORMAL DE ACEPTACIÓN MUTUA Y PALABRA EMPEÑADA')}
            </p>
            <p className="font-sans text-xs text-slate-500 font-medium">
              Suscrita en asamblea comunitaria presencial en la Vereda <strong>{renderValue(data.locality, 'VEREDA')}</strong>, Municipio de <strong>{renderValue(data.municipality, 'MUNICIPIO')}</strong>, a los <strong>[DÍA]</strong> días del mes de <strong>[MES]</strong> del año <strong>2026</strong>.
            </p>
          </section>

          {/* Section 7: Signatures Table */}
          <section className="space-y-4 page-break">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/20 pb-1">
              <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-sans">7</span>
                Sección de Firmas y Huellas de Aprendices Registrados
              </h2>
              <span className="font-sans text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {data.learners.length} Aprendices Registrados (Mínimo 15 cumplido ✓)
              </span>
            </div>

            <p className="font-sans text-xs text-slate-500 italic">
              * Para garantizar plena inclusión, se admite indistintamente la firma manuscrita tradicional o la impresión de la huella dactilar. Los menores de edad cuentan con el aval de su acudiente.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border border-slate-300 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="py-2 px-2.5 text-center font-bold w-12 border-r border-slate-700">N°</th>
                    <th className="py-2 px-3 font-semibold border-r border-slate-700">Nombre Completo del Aprendiz</th>
                    <th className="py-2 px-3 font-semibold w-40 border-r border-slate-700">Tipo y N° de Documento</th>
                    <th className="py-2 px-3 font-semibold w-48 text-center">Firma o Huella</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.learners.map((learner) => (
                    <tr key={learner.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-2 px-2.5 text-center font-bold text-slate-700 border-r border-slate-200">
                        {learner.number}
                      </td>
                      <td className="py-2 px-3 text-slate-900 font-medium border-r border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span>{learner.fullName}</span>
                          {learner.isMinor && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold shrink-0">
                              14+ años
                            </span>
                          )}
                        </div>
                        {learner.isMinor && learner.guardianName && (
                          <div className="text-[11px] text-slate-500 italic">
                            Acudiente: {learner.guardianName} ({learner.guardianDoc})
                          </div>
                        )}
                        {learner.communityRole && (
                          <div className="text-[10px] text-emerald-700 font-normal">
                            {learner.communityRole}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-700 border-r border-slate-200 whitespace-nowrap">
                        {learner.documentType} {learner.documentNumber}
                      </td>
                      <td className="py-2 px-3 text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          {learner.signatureDataUrl && learner.signatureDataUrl !== 'huella-stamp' ? (
                            <div className="h-8 flex items-center justify-center">
                              <img
                                src={learner.signatureDataUrl}
                                alt={`Firma de ${learner.fullName}`}
                                className="max-h-8 max-w-[120px] object-contain border-b border-slate-400"
                              />
                            </div>
                          ) : learner.signatureType === 'huella' ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-300 rounded text-amber-800 font-semibold text-[11px]">
                              <Fingerprint className="w-4 h-4 text-amber-700" />
                              <span>Huella Registrada</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 text-[11px]">
                              <PenLine className="w-3.5 h-3.5 text-slate-500" />
                              <span>Firma Registrada</span>
                            </div>
                          )}

                          {/* Signature interaction button (only in interactive mode) */}
                          <button
                            type="button"
                            onClick={() => onOpenSignatureModal(learner)}
                            className="no-print p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                            title="Cambiar firma o huella"
                          >
                            <PenLine className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Institutional Closing Signatures */}
          <section className="pt-8 space-y-8 font-sans">
            <p className="text-center text-xs font-semibold uppercase text-slate-500 tracking-wider">
              En señal de conformidad y concertación institucional y comunitaria:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4">
              
              {/* Facilitator signature */}
              <div className="text-center space-y-1 border-t-2 border-slate-800 pt-3">
                <p className="font-bold text-slate-900 text-sm">
                  {renderValue(data.facilitatorName, 'NOMBRE DEL FACILITADOR/A')}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {renderValue(data.facilitatorRole, 'CARGO DEL FACILITADOR')}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {renderValue(data.facilitatorDocument, 'DOCUMENTO DE IDENTIDAD')}
                </p>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase inline-block mt-1">
                  Por la Entidad Formativa
                </span>
              </div>

              {/* Community leader signature */}
              <div className="text-center space-y-1 border-t-2 border-slate-800 pt-3">
                <p className="font-bold text-slate-900 text-sm">
                  {renderValue(data.communityLeaderName, 'NOMBRE DEL REPRESENTANTE COMUNAL')}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  {renderValue(data.communityLeaderRole, 'CARGO COMUNITARIO')}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Vereda {renderValue(data.locality, 'VEREDA')} - JAC
                </p>
                <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold uppercase inline-block mt-1">
                  Por la Comunidad Rural
                </span>
              </div>

            </div>

            {/* Verification Footer Stamp */}
            <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400 font-sans">
              Documento expedido y suscrito en asamblea comunitaria • Válido para legalización institucional de matrícula y apertura de ficha formativa.
            </div>
          </section>

        </div>
      </div>

      {/* Bottom Download and Action Card (Hidden in print) */}
      <div className="no-print bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-800" />
            Descargas del Acta Formal Concertada
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Descargue el documento completo en formato oficial editable de Microsoft Word o en PDF para radicación
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadWord}
            disabled={isExportingWord}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs flex items-center gap-2 transition-all hover:shadow active:scale-95 disabled:opacity-50"
          >
            {isExportingWord ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando Word...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                Descargar en Word (.docx)
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white shadow-xs flex items-center gap-2 transition-all hover:shadow active:scale-95 disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Descargar en PDF (.pdf)
              </>
            )}
          </button>

          <button
            onClick={onPrint}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-xs flex items-center gap-2 transition-all hover:shadow"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

    </div>
  );
};
