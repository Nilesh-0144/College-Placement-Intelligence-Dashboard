export interface StudentRecord {
  Student_ID: string;
  Branch: string;
  CGPA: number;
  Tenth_Percentage: number;
  Twelfth_Percentage: number;
  Internship: "Yes" | "No";
  Skills: string;
  Company: string;
  Package: number;
  Placed: "Yes" | "No";
  LeetCode_Problems?: number;
  Projects_Count?: number;
}

export interface FilterOptions {
  branch: string;
  placementStatus: "All" | "Placed" | "Not Placed";
  minCgpa: number;
  maxCgpa: number;
  searchQuery: string;
}

export interface KPIData {
  totalStudents: number;
  studentsPlaced: number;
  placementRate: number;
  averagePackage: number;
  modelAccuracy: number;
}

export interface ConfusionMatrixData {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  totalTested: number;
}

export interface ClassificationReportRow {
  label: string;
  precision: number;
  recall: number;
  f1Score: number;
  support: number;
}

export interface FeatureWeight {
  featureName: string;
  weight: number;
  direction: "positive" | "negative";
  impact: string;
}

export interface PredictionInput {
  branch: string;
  cgpa: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  collegeMarksPercentage?: number;
  internship: "Yes" | "No";
  skills: string;
  leetcode: number;
  projects: number;
  projectDomain?: string;
}

export interface PredictionResult {
  predictedPlaced: boolean;
  probability: number;
  confidenceScore: number;
  academicRating: "Outstanding" | "Competitive" | "Moderate" | "Needs Attention";
  factors: {
    title: string;
    description: string;
    type: "positive" | "neutral" | "warning";
  }[];
  recommendations: string[];
}
