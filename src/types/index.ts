export interface Learner {
  id: string;
  number: number;
  fullName: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PEP' | 'RC' | 'Otro';
  documentNumber: string;
  age: number;
  isMinor: boolean;
  guardianName?: string;
  guardianDoc?: string;
  phone?: string;
  signatureType: 'firma' | 'huella' | 'pendiente';
  signatureDataUrl?: string;
  communityRole?: string; // ej. Productor agrícola, Líder comunal, Joven estudiante, Artesana
}

export interface LogisticParameter {
  id: string;
  parameter: string;
  agreedDetail: string;
  communityObservations: string;
}

export interface CommitmentItem {
  id: string;
  party: 'facilitador' | 'comunidad';
  title: string;
  description: string;
  iconName?: string;
}

export interface ActaData {
  // Institutional Header
  entityName: string;
  programName: string;
  trainingCourseName: string;
  actCode: string;
  generalObjective: string;
  
  // Territorial & Meeting Data
  department: string;
  municipality: string;
  locality: string; // Vereda o Caserío
  meetingPlace: string; // Sede comunal o escuela
  sessionDay: string; // Ej. Sábados
  sessionTime: string; // Ej. 2:00 PM a 5:00 PM
  frequencyText: string; // 1 sesión semanal (cada 8 días)
  startDate: string;
  endDate: string;
  totalHours: number;
  
  // Facilitator
  facilitatorName: string;
  facilitatorRole: string;
  facilitatorDocument: string;
  facilitatorPhone: string;
  communityLeaderName: string;
  communityLeaderRole: string;

  // Logistics & Schedule
  logistics: LogisticParameter[];

  // Methodological Agreements
  minLearners: number;
  digitalToolsAgreed: string[];
  connectivityNotes: string;
  youthPolicyText: string;

  // Commitments
  facilitatorCommitments: string[];
  communityCommitments: string[];

  // Final Verdict
  finalVerdictText: string;

  // Signatures
  learners: Learner[];
}

export interface ReasoningPhase {
  phaseNumber: number;
  title: string;
  subtitle: string;
  keyInsights: string[];
  pedagogicalStrategies: {
    challenge: string;
    actionTaken: string;
    rationale: string;
  }[];
  ruralContextApplication: string;
}
