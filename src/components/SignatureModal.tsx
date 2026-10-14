import React, { useRef, useState, useEffect } from 'react';
import { X, Check, RotateCcw, Fingerprint, PenTool } from 'lucide-react';
import { Learner } from '../types';

interface SignatureModalProps {
  learner: Learner | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (learnerId: string, type: 'firma' | 'huella', dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  learner,
  isOpen,
  onClose,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState<'firma' | 'huella'>('firma');
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen && learner) {
      setActiveTab(learner.signatureType === 'huella' ? 'huella' : 'firma');
      setHasDrawn(false);
      setTimeout(clearCanvas, 50);
    }
  }, [isOpen, learner]);

  if (!isOpen || !learner) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (activeTab === 'firma') {
      const canvas = canvasRef.current;
      const dataUrl = canvas ? canvas.toDataURL() : '';
      onSave(learner.id, 'firma', dataUrl);
    } else {
      // Huella dactilar stamp representation
      onSave(learner.id, 'huella', 'huella-stamp');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-amber-900/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Registro de Conformidad Comunitaria
            </span>
            <h3 className="text-lg font-bold">
              {learner.fullName}
            </h3>
            <p className="text-xs text-slate-300">
              {learner.documentType} {learner.documentNumber} • {learner.age} años {learner.isMinor ? '(Menor con acudiente)' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection: Signature vs Huella */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setActiveTab('firma')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'firma'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PenTool className="w-4 h-4" />
            Firma Manuscrita Digital
          </button>
          <button
            onClick={() => setActiveTab('huella')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'huella'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            Registro de Huella Dactilar
          </button>
        </div>

        {/* Body content */}
        <div className="p-6">
          {activeTab === 'firma' ? (
            <div>
              <p className="text-xs text-slate-600 mb-2">
                Firme en el recuadro con el dedo (en pantalla táctil o celular) o con el mouse:
              </p>
              <div className="border-2 border-dashed border-slate-300 rounded-xl bg-amber-50/30 overflow-hidden relative">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={170}
                  className="w-full h-44 cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs italic">
                    Trazar firma aquí sobre la línea
                  </div>
                )}
                <div className="absolute bottom-6 left-8 right-8 border-b border-slate-300 pointer-events-none" />
              </div>
              <div className="flex justify-between items-center mt-3">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Borrar y volver a firmar
                </button>
                <span className="text-[11px] text-slate-400">
                  Tinta digital segura azul marino
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-amber-50/50 rounded-xl border border-amber-200">
              <div className="w-20 h-24 mx-auto mb-4 border-2 border-dashed border-amber-600/40 rounded-full flex items-center justify-center bg-white shadow-inner">
                <Fingerprint className="w-14 h-14 text-amber-700 animate-pulse" />
              </div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">
                Registro de Huella Dactilar Comunitaria
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Opción de plena validez legal y comunitaria, pensada para garantizar la inclusión y dignidad de aprendices con dificultades de lectoescritura o adultos mayores.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-full font-medium">
                <Check className="w-3.5 h-3.5" /> Huella índice derecho lista para estampar
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-sm bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl shadow-sm flex items-center gap-2 transition-all hover:shadow"
          >
            <Check className="w-4 h-4" />
            Confirmar e Incorporar al Acta
          </button>
        </div>

      </div>
    </div>
  );
};
