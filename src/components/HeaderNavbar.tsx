import React from 'react';
import { 
  FileText, 
  BrainCircuit, 
  Sliders, 
  Compass, 
  Printer, 
  Download, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  TreePine,
  FileDown,
  Loader2
} from 'lucide-react';
import { ActaData } from '../types';
import { generateActaMarkdown } from '../data/documentTemplate';
import { exportToWord, exportToPdf } from '../utils/documentExport';

interface HeaderNavbarProps {
  activeTab: 'acta' | 'memoria' | 'editor' | 'toolkit';
  onSelectTab: (tab: 'acta' | 'memoria' | 'editor' | 'toolkit') => void;
  actaData: ActaData;
  onPrint: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  onSelectTab,
  actaData,
  onPrint
}) => {
  const [isExportingWord, setIsExportingWord] = React.useState(false);
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);

  const handleDownloadWord = async () => {
    try {
      setIsExportingWord(true);
      await exportToWord(actaData, false);
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
      // If we are not on the 'acta' tab, switch to it so the document DOM is present
      if (activeTab !== 'acta') {
        onSelectTab('acta');
        await new Promise(r => setTimeout(r, 300));
      }
      const safeLocality = actaData.locality.replace(/\s+/g, '_');
      await exportToPdf('official-acta-document', `Acta_Concertacion_${safeLocality}_2026.pdf`);
    } catch (err) {
      console.error('Error al exportar a PDF:', err);
      onPrint();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateActaMarkdown(actaData, false);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Acta_Concertacion_${actaData.locality.replace(/\s+/g, '_')}_2026.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const meetsQuota = actaData.learners.length >= actaData.minLearners;
  const minorsCount = actaData.learners.filter(l => l.isMinor).length;

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main top bar */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white flex items-center justify-center shadow-md shadow-emerald-900/10">
              <TreePine className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Facilitación Rural & Pedagogía
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium font-sans">
                  {actaData.locality}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Acta de Concertación y Compromiso Comunitario
              </h1>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="hidden lg:flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
              meetsQuota ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-red-50 text-red-900 border-red-300'
            }`}>
              <Users className="w-3.5 h-3.5" />
              <span>{actaData.learners.length}/{actaData.minLearners} Aprendices</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>{minorsCount} Jóvenes (14-17 con Acudiente)</span>
            </div>

            <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
              1 sesión / 8 días ({actaData.sessionDay})
            </div>
          </div>

          {/* Direct Print & Export buttons */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Word button */}
            <button
              onClick={handleDownloadWord}
              disabled={isExportingWord}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs flex items-center gap-1.5 transition-all hover:shadow active:scale-95 disabled:opacity-50"
              title="Descargar acta en formato Microsoft Word (.docx)"
            >
              {isExportingWord ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Generando Word...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Word (.docx)</span>
                </>
              )}
            </button>

            {/* PDF button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white shadow-xs flex items-center gap-1.5 transition-all hover:shadow active:scale-95 disabled:opacity-50"
              title="Descargar acta en formato PDF (.pdf)"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Generando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF (.pdf)</span>
                </>
              )}
            </button>

            {/* Print button */}
            <button
              onClick={onPrint}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white shadow-xs flex items-center gap-1.5 transition-all hover:shadow"
              title="Imprimir documento en papel"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>

            {/* Markdown button */}
            <button
              onClick={handleDownloadMarkdown}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 flex items-center gap-1 transition-colors"
              title="Descargar archivo en formato Markdown .md"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">.md</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 sm:space-x-3 overflow-x-auto border-t border-slate-100 pt-2 pb-2 text-xs font-semibold">
          
          <button
            onClick={() => onSelectTab('acta')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'acta'
                ? 'bg-emerald-800 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Acta Oficial (Documento Final)</span>
          </button>

          <button
            onClick={() => onSelectTab('memoria')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'memoria'
                ? 'bg-emerald-800 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>2. Memoria de Razonamiento (4 Fases CoT)</span>
          </button>

          <button
            onClick={() => onSelectTab('editor')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'editor'
                ? 'bg-emerald-800 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>3. Editor y Roster de Aprendices</span>
          </button>

          <button
            onClick={() => onSelectTab('toolkit')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'toolkit'
                ? 'bg-emerald-800 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>4. Herramientas del Facilitador & IA</span>
          </button>

        </div>

      </div>
    </header>
  );
};
