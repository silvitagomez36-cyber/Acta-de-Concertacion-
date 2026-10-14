import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Fingerprint, 
  PenTool, 
  ShieldCheck, 
  BookOpen,
  Sliders
} from 'lucide-react';
import { ActaData, Learner, LogisticParameter } from '../types';
import { INITIAL_ACTA_DATA } from '../data/documentTemplate';

interface DocumentEditorProps {
  data: ActaData;
  onChange: (newData: ActaData) => void;
  onOpenSignatureModal: (learner: Learner) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  data,
  onChange,
  onOpenSignatureModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'logistica' | 'aprendices' | 'compromisos'>('general');
  const [saveToast, setSaveToast] = useState(false);

  // New learner form modal state
  const [isAddingLearner, setIsAddingLearner] = useState(false);
  const [newLearner, setNewLearner] = useState<Partial<Learner>>({
    fullName: '',
    documentType: 'CC',
    documentNumber: '',
    age: 28,
    isMinor: false,
    guardianName: '',
    guardianDoc: '',
    communityRole: '',
    phone: '',
    signatureType: 'firma'
  });

  const handleApplyPreset = (presetKey: string) => {
    if (presetKey === 'buenavista') {
      onChange(INITIAL_ACTA_DATA);
    } else if (presetKey === 'cafetera') {
      onChange({
        ...INITIAL_ACTA_DATA,
        actCode: 'ACT-CONF-RUR-2026-CAF-01',
        department: 'Caldas / Risaralda',
        municipality: 'Chinchiná',
        locality: 'Vereda La Esmeralda',
        meetingPlace: 'Kiosco Comunal del Comité de Cafeteros',
        sessionDay: 'Domingos',
        sessionTime: '08:30 AM a 11:30 AM',
        trainingCourseName: 'Uso de Redes Sociales y WhatsApp Business para la Venta Directa de Café Especial',
        generalObjective: 'Capacitar a las familias cafeteras en la fotografía de productos con celular y el uso de catálogos virtuales para vender café sin intermediarios.'
      });
    } else if (presetKey === 'riberena') {
      onChange({
        ...INITIAL_ACTA_DATA,
        actCode: 'ACT-CONF-RUR-2026-RIB-02',
        department: 'Meta / Guaviare',
        municipality: 'Puerto Concordia',
        locality: 'Caserío El Remanso Ribereño',
        meetingPlace: 'Escuela Rural Mixta San José',
        sessionDay: 'Viernes',
        sessionTime: '01:30 PM a 04:30 PM',
        trainingCourseName: 'Herramientas Digitales y Alertas Agroclimáticas para la Producción Sostenible',
        generalObjective: 'Fortalecer las capacidades comunitarias para consultar el clima, registrar inventarios comunitarios y comunicarse ante crecientes del río mediante mensajería móvil.'
      });
    }
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const updateField = <K extends keyof ActaData>(field: K, value: ActaData[K]) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleUpdateLogistic = (index: number, key: keyof LogisticParameter, value: string) => {
    const updated = [...data.logistics];
    updated[index] = { ...updated[index], [key]: value };
    updateField('logistics', updated);
  };

  const handleAddLogistic = () => {
    const newParam: LogisticParameter = {
      id: `log-${Date.now()}`,
      parameter: 'Nuevo Punto a Concertar',
      agreedDetail: 'Detalle acordado en la asamblea',
      communityObservations: 'Observación de los participantes'
    };
    updateField('logistics', [...data.logistics, newParam]);
  };

  const handleRemoveLogistic = (index: number) => {
    const updated = data.logistics.filter((_, i) => i !== index);
    updateField('logistics', updated);
  };

  const handleAddLearnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearner.fullName || !newLearner.documentNumber) return;

    const age = Number(newLearner.age) || 18;
    const isMinor = age < 18;

    const learner: Learner = {
      id: `l-${Date.now()}`,
      number: data.learners.length + 1,
      fullName: newLearner.fullName || '',
      documentType: (newLearner.documentType as any) || (isMinor ? 'TI' : 'CC'),
      documentNumber: newLearner.documentNumber || '',
      age,
      isMinor,
      guardianName: isMinor ? newLearner.guardianName : undefined,
      guardianDoc: isMinor ? newLearner.guardianDoc : undefined,
      communityRole: newLearner.communityRole || 'Habitante de la comunidad',
      phone: newLearner.phone || '',
      signatureType: newLearner.signatureType || 'firma',
      signatureDataUrl: ''
    };

    updateField('learners', [...data.learners, learner]);
    setIsAddingLearner(false);
    setNewLearner({
      fullName: '',
      documentType: 'CC',
      documentNumber: '',
      age: 28,
      isMinor: false,
      guardianName: '',
      guardianDoc: '',
      communityRole: '',
      phone: '',
      signatureType: 'firma'
    });
    triggerSaveToast();
  };

  const handleRemoveLearner = (id: string) => {
    const updated = data.learners
      .filter(l => l.id !== id)
      .map((l, idx) => ({ ...l, number: idx + 1 }));
    updateField('learners', updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Desea restaurar todos los datos originales del acta con los 16 aprendices?')) {
      onChange(INITIAL_ACTA_DATA);
      triggerSaveToast();
    }
  };

  const meetsQuota = data.learners.length >= data.minLearners;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Top Banner with Presets */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-slate-900">
              Personalizador del Acta y Concertación Territorial
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Ajuste los datos de la comunidad, fechas, acuerdos logísticos y la lista de aprendices
          </p>
        </div>

        {/* Presets and actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <span className="text-[11px] text-slate-500 font-semibold px-2">Cargar Ejemplo Rural:</span>
            <button
              onClick={() => handleApplyPreset('buenavista')}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg text-slate-700 font-medium shadow-xs border border-slate-200"
            >
              Vereda Buena Vista (Agro)
            </button>
            <button
              onClick={() => handleApplyPreset('cafetera')}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg text-slate-700 font-medium shadow-xs border border-slate-200"
            >
              Comunidad Cafetera
            </button>
            <button
              onClick={() => handleApplyPreset('riberena')}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg text-slate-700 font-medium shadow-xs border border-slate-200"
            >
              Caserío Ribereño
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-xs flex items-center gap-1"
            title="Restaurar valores de fábrica"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quota & Safe Alert Indicator */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
        meetsQuota 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
          : 'bg-red-50 border-red-200 text-red-900'
      }`}>
        <div className="flex items-center gap-2.5">
          {meetsQuota ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <div>
            <span className="font-bold">
              Estado del Cupo Mínimo: {data.learners.length} de {data.minLearners} requeridos
            </span>
            <p className="text-[11px] opacity-90">
              {meetsQuota 
                ? 'El umbral mínimo de 15 aprendices está cumplido para viabilidad y certificación.' 
                : '¡Advertencia! Se necesitan al menos 15 aprendices para formalizar el curso sin riesgo de cancelación.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-white/80 rounded-lg font-bold border border-emerald-300">
            {data.learners.filter(l => !l.isMinor).length} Adultos
          </span>
          <span className="px-2.5 py-1 bg-amber-100 rounded-lg font-bold text-amber-900 border border-amber-300">
            {data.learners.filter(l => l.isMinor).length} Jóvenes (14-17 años con acudiente)
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('general')}
            className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'general'
                ? 'border-emerald-800 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            1. Institución y Territorio
          </button>

          <button
            onClick={() => setActiveSubTab('logistica')}
            className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'logistica'
                ? 'border-emerald-800 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            2. Tabla Logística y Horarios
          </button>

          <button
            onClick={() => setActiveSubTab('aprendices')}
            className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'aprendices'
                ? 'border-emerald-800 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            3. Registro de Aprendices ({data.learners.length})
          </button>

          <button
            onClick={() => setActiveSubTab('compromisos')}
            className={`py-3 px-5 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeSubTab === 'compromisos'
                ? 'border-emerald-800 text-emerald-900 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            4. Compromisos y Veredicto
          </button>
        </div>

        {/* Tab 1: General & Territorial */}
        {activeSubTab === 'general' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Entidad Formativa Convocante</label>
                <input
                  type="text"
                  value={data.entityName}
                  onChange={(e) => updateField('entityName', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Programa de Formación</label>
                <input
                  type="text"
                  value={data.programName}
                  onChange={(e) => updateField('programName', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Nombre del Curso / Acción Formativa</label>
                <input
                  type="text"
                  value={data.trainingCourseName}
                  onChange={(e) => updateField('trainingCourseName', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none font-semibold text-emerald-900"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Objetivo General</label>
                <textarea
                  rows={3}
                  value={data.generalObjective}
                  onChange={(e) => updateField('generalObjective', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Departamento</label>
                <input
                  type="text"
                  value={data.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Municipio</label>
                <input
                  type="text"
                  value={data.municipality}
                  onChange={(e) => updateField('municipality', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Vereda o Caserío</label>
                <input
                  type="text"
                  value={data.locality}
                  onChange={(e) => updateField('locality', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sede Física Concertada (Salón Comunal)</label>
                <input
                  type="text"
                  value={data.meetingPlace}
                  onChange={(e) => updateField('meetingPlace', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nombre del Facilitador(a)</label>
                <input
                  type="text"
                  value={data.facilitatorName}
                  onChange={(e) => updateField('facilitatorName', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Documento y Teléfono Facilitador(a)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.facilitatorDocument}
                    onChange={(e) => updateField('facilitatorDocument', e.target.value)}
                    placeholder="Doc"
                    className="w-1/2 text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={data.facilitatorPhone}
                    onChange={(e) => updateField('facilitatorPhone', e.target.value)}
                    placeholder="Tel"
                    className="w-1/2 text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Líder Comunitario / JAC Testigo</label>
                <input
                  type="text"
                  value={data.communityLeaderName}
                  onChange={(e) => updateField('communityLeaderName', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Cargo del Representante Comunitario</label>
                <input
                  type="text"
                  value={data.communityLeaderRole}
                  onChange={(e) => updateField('communityLeaderRole', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Logistics & Schedule */}
        {activeSubTab === 'logistica' && (
          <div className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Día Pactado (ej. Sábados)</label>
                <input
                  type="text"
                  value={data.sessionDay}
                  onChange={(e) => updateField('sessionDay', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Franja Horaria (ej. 2:00 a 5:00 PM)</label>
                <input
                  type="text"
                  value={data.sessionTime}
                  onChange={(e) => updateField('sessionTime', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Frecuencia Semanal</label>
                <input
                  type="text"
                  value={data.frequencyText}
                  onChange={(e) => updateField('frequencyText', e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Filas de la Tabla de Logística y Cronograma Concertado
                </h3>
                <button
                  type="button"
                  onClick={handleAddLogistic}
                  className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1 hover:bg-emerald-900 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar Parámetro
                </button>
              </div>

              <div className="space-y-3">
                {data.logistics.map((item, idx) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-700">Parámetro #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLogistic(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                        title="Eliminar fila"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <input
                        type="text"
                        value={item.parameter}
                        onChange={(e) => handleUpdateLogistic(idx, 'parameter', e.target.value)}
                        placeholder="Parámetro"
                        className="p-2 border border-slate-300 rounded-lg bg-white font-semibold"
                      />
                      <input
                        type="text"
                        value={item.agreedDetail}
                        onChange={(e) => handleUpdateLogistic(idx, 'agreedDetail', e.target.value)}
                        placeholder="Detalle Concertado"
                        className="p-2 border border-slate-300 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        value={item.communityObservations}
                        onChange={(e) => handleUpdateLogistic(idx, 'communityObservations', e.target.value)}
                        placeholder="Observación Comunitaria"
                        className="p-2 border border-slate-300 rounded-lg bg-white italic"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Learners Roster Manager */}
        {activeSubTab === 'aprendices' && (
          <div className="p-6 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Padrón de Aprendices de la Comunidad ({data.learners.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Mínimo obligatorio: {data.minLearners} aprendices (jóvenes desde 14 años y adultos)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingLearner(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Registrar Nuevo Aprendiz
              </button>
            </div>

            {/* Modal for adding a new learner */}
            {isAddingLearner && (
              <form onSubmit={handleAddLearnerSubmit} className="p-4 bg-emerald-50/70 border-2 border-dashed border-emerald-400 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase text-emerald-950 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-emerald-700" />
                    Formulario de Registro Comunitario
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingLearner(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={newLearner.fullName}
                      onChange={(e) => setNewLearner({ ...newLearner, fullName: e.target.value })}
                      placeholder="Ej. Rosa Helena Cárdenas"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Edad en años</label>
                    <input
                      type="number"
                      min={14}
                      max={99}
                      required
                      value={newLearner.age}
                      onChange={(e) => {
                        const age = Number(e.target.value);
                        setNewLearner({
                          ...newLearner,
                          age,
                          isMinor: age < 18,
                          documentType: age < 18 ? 'TI' : 'CC'
                        });
                      }}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Tipo Documento</label>
                    <select
                      value={newLearner.documentType}
                      onChange={(e) => setNewLearner({ ...newLearner, documentType: e.target.value as any })}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="TI">Tarjeta de Identidad (TI)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="PEP">PEP</option>
                      <option value="RC">Registro Civil (RC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">N° Documento</label>
                    <input
                      type="text"
                      required
                      value={newLearner.documentNumber}
                      onChange={(e) => setNewLearner({ ...newLearner, documentNumber: e.target.value })}
                      placeholder="Ej. 1.054.890.123"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Rol en la Comunidad</label>
                    <input
                      type="text"
                      value={newLearner.communityRole}
                      onChange={(e) => setNewLearner({ ...newLearner, communityRole: e.target.value })}
                      placeholder="Ej. Productora de queso, Estudiante"
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  {newLearner.age && newLearner.age < 18 && (
                    <>
                      <div className="sm:col-span-2 bg-amber-100/70 p-2.5 rounded-lg border border-amber-300">
                        <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                          Nombre del Acudiente / Padre / Madre (Requerido para menor de 18 años)
                        </label>
                        <input
                          type="text"
                          required
                          value={newLearner.guardianName}
                          onChange={(e) => setNewLearner({ ...newLearner, guardianName: e.target.value })}
                          placeholder="Nombre del acudiente responsable"
                          className="w-full p-1.5 border border-amber-400 rounded bg-white text-xs"
                        />
                      </div>
                      <div className="bg-amber-100/70 p-2.5 rounded-lg border border-amber-300">
                        <label className="block text-[11px] font-bold text-amber-900 mb-0.5">
                          C.C. del Acudiente
                        </label>
                        <input
                          type="text"
                          required
                          value={newLearner.guardianDoc}
                          onChange={(e) => setNewLearner({ ...newLearner, guardianDoc: e.target.value })}
                          placeholder="C.C. del acudiente"
                          className="w-full p-1.5 border border-amber-400 rounded bg-white text-xs"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-xs"
                  >
                    Guardar e Incorporar
                  </button>
                </div>
              </form>
            )}

            {/* List of learners */}
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
              {data.learners.map((learner) => (
                <div key={learner.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                      {learner.number}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{learner.fullName}</span>
                        {learner.isMinor ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            {learner.age} años (Menor 14+)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">
                            {learner.age} años
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {learner.documentType} {learner.documentNumber} • {learner.communityRole || 'Comunidad'}
                      </div>
                      {learner.isMinor && (
                        <div className="text-[10px] text-amber-800 italic">
                          Acudiente: {learner.guardianName} ({learner.guardianDoc})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Signature status / action */}
                    <button
                      type="button"
                      onClick={() => onOpenSignatureModal(learner)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        learner.signatureType === 'huella'
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : learner.signatureDataUrl
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {learner.signatureType === 'huella' ? (
                        <>
                          <Fingerprint className="w-3.5 h-3.5 text-amber-700" /> Huella
                        </>
                      ) : (
                        <>
                          <PenTool className="w-3.5 h-3.5 text-emerald-700" /> Firma
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveLearner(learner.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Eliminar de la lista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 4: Commitments & Final Verdict */}
        {activeSubTab === 'compromisos' && (
          <div className="p-6 space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Declaratoria Final de Conformidad y Aceptación</label>
              <textarea
                rows={4}
                value={data.finalVerdictText}
                onChange={(e) => updateField('finalVerdictText', e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl font-serif-doc"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Política de Acompañamiento a Jóvenes 14+ años</label>
              <textarea
                rows={3}
                value={data.youthPolicyText}
                onChange={(e) => updateField('youthPolicyText', e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Condiciones de Conectividad y Contenidos Offline</label>
              <textarea
                rows={2}
                value={data.connectivityNotes}
                onChange={(e) => updateField('connectivityNotes', e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl"
              />
            </div>

          </div>
        )}

      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce z-50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>¡Cambios actualizados en el acta!</span>
        </div>
      )}

    </div>
  );
};
