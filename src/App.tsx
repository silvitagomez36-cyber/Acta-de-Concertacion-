import React, { useState } from 'react';
import { HeaderNavbar } from './components/HeaderNavbar';
import { OfficialActaView } from './components/OfficialActaView';
import { ReasoningMemoryView } from './components/ReasoningMemoryView';
import { DocumentEditor } from './components/DocumentEditor';
import { FacilitatorToolkit } from './components/FacilitatorToolkit';
import { SignatureModal } from './components/SignatureModal';
import { INITIAL_ACTA_DATA } from './data/documentTemplate';
import { ActaData, Learner } from './types';
import { HeartHandshake, ShieldCheck, TreePine, Sparkles } from 'lucide-react';

export default function App() {
  const [actaData, setActaData] = useState<ActaData>(INITIAL_ACTA_DATA);
  const [activeTab, setActiveTab] = useState<'acta' | 'memoria' | 'editor' | 'toolkit'>('acta');
  const [signingLearner, setSigningLearner] = useState<Learner | null>(null);

  const handlePrint = () => {
    // If user prints from another tab, switch to 'acta' first to guarantee the printable document is rendered
    if (activeTab !== 'acta') {
      setActiveTab('acta');
      setTimeout(() => {
        window.print();
      }, 250);
    } else {
      window.print();
    }
  };

  const handleOpenSignatureModal = (learner: Learner) => {
    setSigningLearner(learner);
  };

  const handleCloseSignatureModal = () => {
    setSigningLearner(null);
  };

  const handleSaveSignature = (learnerId: string, type: 'firma' | 'huella', dataUrl: string) => {
    setActaData(prev => ({
      ...prev,
      learners: prev.learners.map(l => {
        if (l.id === learnerId) {
          return {
            ...l,
            signatureType: type,
            signatureDataUrl: dataUrl
          };
        }
        return l;
      })
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Top Navbar */}
      <HeaderNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        actaData={actaData}
        onPrint={handlePrint}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'acta' && (
          <OfficialActaView
            data={actaData}
            onOpenSignatureModal={handleOpenSignatureModal}
            onPrint={handlePrint}
          />
        )}

        {activeTab === 'memoria' && (
          <ReasoningMemoryView />
        )}

        {activeTab === 'editor' && (
          <DocumentEditor
            data={actaData}
            onChange={setActaData}
            onOpenSignatureModal={handleOpenSignatureModal}
          />
        )}

        {activeTab === 'toolkit' && (
          <FacilitatorToolkit actaData={actaData} />
        )}
      </main>

      {/* Signature and Fingerprint Modal */}
      <SignatureModal
        learner={signingLearner}
        isOpen={!!signingLearner}
        onClose={handleCloseSignatureModal}
        onSave={handleSaveSignature}
      />

      {/* Footer (Hidden in print) */}
      <footer className="no-print mt-12 border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <TreePine className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold text-slate-700">
              Facilitación Comunitaria Rural y Pedagogía Popular
            </span>
            <span>•</span>
            <span>Instrumento de Concertación Veredal 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Protección legal y salvaguarda de menores de edad
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
              Pacto de honor y palabra empeñada
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
