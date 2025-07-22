import { BenefitClass, PaymentType, PlanNumber } from "../types/benefitcalculator";


export const BENEFIT_CLASSES: BenefitClass[] = [
  { id: 'C', value: 'C' },
  { id: 'CHAZ', value: 'CHAZ' },
  { id: 'CLY', value: 'CLY' },
  { id: 'CUE', value: 'CUE' },
  { id: 'CYAL', value: 'CYAL' },
  { id: 'FA', value: 'FA' },
  { id: 'FB', value: 'FB' },
  { id: 'ALCAN', value: 'ALCAN' },
  { id: 'CRA', value: 'CRA' },
  { id: 'BOC-DB', value: 'BOC-DB' }
];

export const PLAN_NUMBERS: PlanNumber[] = [
  { id: 'EQ9004', value: 'Citipower(EQ9004)' },
  { id: 'EQ9008', value: 'EnergyAustralia(EQ9008)' },
  { id: 'EQ9009', value: 'EcoGen(EQ9009)' },
  { id: 'EQ9012', value: 'Tenix(EQ9012)' },
  { id: 'EQ9018', value: 'Ausnet Transmission Group Pty Ltd(EQ9018)' },
  { id: 'EQ9021', value: 'Hazelwood Power Corporation(EQ9021)' },
  { id: 'EQ9023', value: 'Loy Yang(EQ9023)' },
  { id: 'EQ9028', value: 'Energy Safe(EQ9028)' },
  { id: 'EQ9030', value: 'Origin (EQ9030)' },
  { id: 'EQ9032', value: 'Powercor(EQ9032)' },
  { id: 'EQ9036', value: 'Snowy Hydro(EQ9036)' },
  { id: 'EQ9037', value: 'AGL(EQ9037)' },
  { id: 'EQ9046', value: 'Australian Energy Market Operator Ltd (AEMO) (Legals: Vencorp)(EQ9046)' },
  { id: 'EQ9048', value: 'EnergyAustralia Yallourn(EQ9048)' },
  { id: 'EQ9074', value: 'AusNet Electricity Services Pty Ltd(EQ9074)' },
  { id: 'EQ9084', value: 'Jemena(EQ9084)' },
  { id: 'EQ9092', value: 'UE and Multinet Pty Ltd(EQ9092)' }
];

export const PAYMENT_TYPES: PaymentType[] = [
  {
    id: 'LSBEN',
    value: 'Leaving Service Benefit',
    benefitClasses: [
      { id: 'C', minAge: -1, maxAge: 55 },
      { id: 'CHAZ', minAge: -1, maxAge: 55 },
      { id: 'CLY', minAge: -1, maxAge: 55 },
      { id: 'CUE', minAge: -1, maxAge: 55 },
      { id: 'CYAL', minAge: -1, maxAge: 55 },
      { id: 'FA', minAge: 56, maxAge: -1 },
      { id: 'FB', minAge: 56, maxAge: -1 },
      { id: 'ALCAN', minAge: -1, maxAge: 54 },
      { id: 'CRA', minAge: -1, maxAge: 56 },
      { id: 'BOC-DB', minAge: -1, maxAge: 54 }
    ]
  },
  {
    id: 'RBEN',
    value: 'Retrenchment Benefit',
    benefitClasses: [
       { id: 'C', minAge: -1, maxAge: 55 },
      { id: 'CHAZ', minAge: -1, maxAge: 55 },
      { id: 'CLY', minAge: -1, maxAge: 55 },
      { id: 'CUE', minAge: -1, maxAge: 55 },
      { id: 'CYAL', minAge: -1, maxAge: 55 },
      { id: 'FA', minAge: -1, maxAge: -1 },
      { id: 'FB', minAge: -1, maxAge: -1 },
      { id: 'CRA', minAge: -1, maxAge: -1 }
    ]
  },
  {
    id: 'ERBEN',
    value: 'Early Retirement Benefit',
    benefitClasses: [
      { id: 'C', minAge: 55, maxAge: 64 },
      {id: 'CHAZ', minAge: 55, maxAge: 64 },
      { id: 'CLY', minAge: 55, maxAge: 64 },
      { id: 'CUE', minAge: 55, maxAge: 64 },
      { id: 'CYAL', minAge: 55, maxAge: 64 },
      { id: 'FA', minAge: -1, maxAge: -1 },
      { id: 'FB', minAge: -1, maxAge: -1 },
      { id: 'ALCAN', minAge: -1, maxAge: -1 },
      { id: 'CRA', minAge: -1, maxAge: -1 },
      { id: 'BOC-DB', minAge: -1, maxAge: -1 }
    ]
  },
  {
    id: 'NRBEN',
    value: 'Normal Retirement Benefit',
    benefitClasses: [
      { id: 'C', minAge: 65, maxAge: 65 },
      { id: 'CHAZ', minAge: 65, maxAge: 65 },
      { id: 'CLY', minAge: 65, maxAge: 65 },
      { id: 'CUE', minAge: 65, maxAge: 65 },
      { id: 'CYAL', minAge: 65, maxAge: 65 },
      { id: 'FA', minAge: -1, maxAge: -1 },
      { id: 'FB', minAge: -1, maxAge: -1 },
      { id: 'ALCAN', minAge: -1, maxAge: -1 },
      { id: 'CRA', minAge: -1, maxAge: -1 },
      { id: 'BOC-DB', minAge: -1, maxAge: -1 }
    ]
  },
  {
    id: 'LRBEN',
    value: 'Late Retirement Benefit',
    benefitClasses: [
      { id: 'C', minAge: 65, maxAge: -1 },
      { id: 'FA', minAge: -1, maxAge: -1 },
      { id: 'FB', minAge: -1, maxAge: -1 },
      { id: 'ALCAN', minAge: -1, maxAge: -1 },
      { id: 'CRA', minAge: -1, maxAge: -1 }
    ]
  },
  {
    id: 'DBEN',
    value: 'Death Benefit',
    benefitClasses: [
      { id: 'C', minAge: -1, maxAge: 64 },
      { id: 'CHAZ', minAge: -1, maxAge: 64 },
      { id: 'CLY', minAge: -1, maxAge: 64 },
      { id: 'CUE', minAge: -1, maxAge: 64 },
      { id: 'CYAL', minAge: -1, maxAge: 64 },
      { id: 'FA', minAge: -1, maxAge: -1 },
      { id: 'FB', minAge: -1, maxAge: -1 },
      { id: 'ALCAN', minAge: -1, maxAge: -1 },
      { id: 'CRA', minAge: -1, maxAge: -1 },
      { id: 'BOC-DB', minAge: -1, maxAge: -1 }
    ]
  },
  {
    id: 'TPDBEN',
    value: 'Total and Permanent Disablement',
    benefitClasses: [
      { id: 'C', minAge: -1, maxAge: 64 },
      { id: 'CHAZ', minAge: -1, maxAge: 64 },
      { id: 'CLY', minAge: -1, maxAge: 64 },
      { id: 'CUE', minAge: -1, maxAge: 64 },
      { id: 'CYAL', minAge: -1, maxAge: 64 },
      { id: 'FA', minAge: -1, maxAge: -1 },
      { id: 'FB', minAge: -1, maxAge: -1 },
      { id: 'ALCAN', minAge: -1, maxAge: -1 },
      { id: 'CRA', minAge: -1, maxAge: -1 },
      { id: 'BOC-DB', minAge: -1, maxAge: -1 }
    ]
  },
  {
    id: 'TEMPDIS',
    value: 'Temporary Disablement',
    benefitClasses: [
      { id: 'C', minAge: -1, maxAge: 64 },
      { id: 'CHAZ', minAge: -1, maxAge: 64 },
      { id: 'CLY', minAge: -1, maxAge: 64 },
      { id: 'CUE', minAge: -1, maxAge: 64 },
      { id: 'CYAL', minAge: -1, maxAge: 64 },
      { id: 'FA', minAge: -1, maxAge: -1 },
      { id: 'FB', minAge: -1, maxAge: -1 }
    ]
  },
  {
    id: 'DEFBEN',
    value: 'Deferred Benefit',
    benefitClasses: [
      { id: 'C', minAge: -1, maxAge: -1 },
      { id: 'CHAZ', minAge: -1, maxAge: -1 },
      { id: 'CLY', minAge: -1, maxAge: -1 },
      { id: 'CUE', minAge: -1, maxAge: -1 },
      { id: 'CYAL', minAge: -1, maxAge: -1 }
    ]
  },
  {
    id: 'MRB1',
    value: 'Minimum Requisite Benefit 1',
    benefitClasses: [
      { id: 'C', minAge: -1, maxAge: -1 }
    ]
  },
  {
    id: 'ILLHBEN',
    value: 'Ill Health Benefit',
    benefitClasses: [
      { id: 'C', minAge: -1, maxAge: 55 },
      { id: 'CHAZ', minAge: -1, maxAge: 55 },
      { id: 'CLY', minAge: -1, maxAge: 55 },
      { id: 'CUE', minAge: -1, maxAge: 55 },
      { id: 'CYAL', minAge: -1, maxAge: 55 },
      { id: 'FA', minAge: -1, maxAge: -1 },
      { id: 'FB', minAge: -1, maxAge: -1 },
      { id: 'CRA', minAge: -1, maxAge: -1 }
    ]
  }
];

export const PLAN_BENEFIT_MAPPING = [
  { planNumber: "EQ9006", benefitClass: "C" },
  { planNumber: "EQ9008", benefitClass: "C" },
  { planNumber: "EQ9009", benefitClass: "C" },
  { planNumber: "EQ9012", benefitClass: "C" },
  { planNumber: "EQ9018", benefitClass: "C" },
  { planNumber: "EQ9021", benefitClass: "CHAZ" },
  { planNumber: "EQ9023", benefitClass: "CLY" },
  { planNumber: "EQ9028", benefitClass: "C" },
  { planNumber: "EQ9030", benefitClass: "C" },
  { planNumber: "EQ9032", benefitClass: "C" },
  { planNumber: "EQ9036", benefitClass: "C" },
  { planNumber: "EQ9037", benefitClass: "C" },
  { planNumber: "EQ9037", benefitClass: "CUE" },
  { planNumber: "EQ9046", benefitClass: "C" },
  { planNumber: "EQ9048", benefitClass: "CYAL" },
  { planNumber: "EQ9074", benefitClass: "C" },
  { planNumber: "EQ9074", benefitClass: "CUE" },
  { planNumber: "EQ9084", benefitClass: "C" },
  { planNumber: "EQ9084", benefitClass: "CUE" },
  { planNumber: "EQ9092", benefitClass: "CUE" }
];

export const CALCULATOR_CARDS = [
  {
    id: 'standard' as const,
    title: 'Standard Calculator',
    description: 'Calculate benefits for individual cases with detailed parameters',
    icon: '📊',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    buttonColor: 'hover:bg-teal-700'
  },
  {
    id: 'bulk' as const,
    title: 'Bulk Calculator',
    description: 'Upload and process multiple benefit calculations at once',
    icon: '📁',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonColor: 'hover:bg-blue-700'
  }
];


export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_NUMBER: 'Please enter a valid number',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_VALUE: (min: number) => `Value must be at least ${min}`,
  MAX_VALUE: (max: number) => `Value must be at most ${max}`,
  NETWORK_ERROR: 'Failed to submit the form. Please try again.',
} as const;

export const INPUT_STYLES = {
  base: "w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors",
  valid: "border-gray-300 focus:ring-blue-500",
  invalid: "border-red-300 focus:ring-red-500",
  checkbox: "w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
} as const;