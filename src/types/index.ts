export type ProcessCategory = 
  | 'press' 
  | 'body' 
  | 'paint' 
  | 'assembly' 
  | 'inspection' 
  | 'battery_pe' 
  | 'it_platform' 
  | 'machining' 
  | 'parts_module';

export interface ManufacturingProcessNode {
  id: string;
  name: string;
  category: ProcessCategory;
  shortDesc: string;
  order: number;
  mainTasks: string[];
  equipment: string[];
  appliedTech: string[];
  relatedJobs: string[];
  qualityMetrics: {
    name: string;
    target: string;
    description: string;
  }[];
  relatedTrendKeywords: string[];
  badgeColor?: string;
}

export interface ProcessConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface Company {
  id: string;
  name: string;
  englishName: string;
  logo: string;
  category: '완성차' | '부품/전동화' | '제조IT/솔루션' | '공작기계/소재';
  tagline: string;
  description: string;
  headquarters: string;
  keyBusiness: string[];
  keyProducts: string[];
  keyTechnologies: string[];
  isDemoSample?: boolean;
  nodes: ManufacturingProcessNode[];
  edges: ProcessConnection[];
}

export interface TechnologyTrend {
  id: string;
  name: string;
  category: '스마트팩토리' | '제조DX' | 'Physical AI' | '자동화' | '품질/비전' | '전동화/배터리';
  mentionFrequency: number; // e.g. 85
  growthRate: string; // e.g. +24% YoY
  relatedJobsCount: number; // e.g. 142
  companies: string[];
  appliedProcesses: string[];
  keySkills: string[];
  trendHistory: { period: string; count: number; jobIndex: number }[];
  importance: '최우선' | '핵심' | '성장';
  description: string;
}

export interface JobPosting {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  department: string;
  experienceLevel: '신입' | '인턴' | '경력' | '신입/인턴';
  location: string;
  deadline: string;
  rawText?: string;
  mainDuties: string[];
  requiredQualifications: string[];
  preferredQualifications: string[];
  coreTechnologies: string[];
  competencyKeywords: string[];
  summary: string;
}

export interface ProjectExperience {
  id: string;
  title: string;
  period: string;
  purpose: string;
  role: string;
  techStack: string[];
  features: string[];
  problemSolved: string;
  actionTaken: string;
  resultMetric: string;
  learnings: string;
}

export interface UserProfile {
  name: string;
  university: string;
  major: string;
  doubleMajor?: string;
  academicYear: string;
  graduationDate: string;
  targetJobRoles: string[];
  targetCompanies: string[];
  skills: string[];
  certifications: string[];
  completedCourses: string[];
  projects: ProjectExperience[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: '개념 설명형' | '비교 설명형' | '코드·SQL 기반' | '제조 현장 상황형' | '프로젝트 경험 연결형';
  category: string;
  difficulty: '기초' | '중급' | '심화';
  hint: string;
  modelAnswer: string;
  keyEvaluationPoints: string[];
  company?: string;
  jobTitle?: string;
}

export interface InterviewAnswer {
  questionId: string;
  questionText: string;
  userAnswer: string;
  submittedAt: string;
  evaluation?: {
    overallScore: number;
    scores: {
      accuracy: number;
      coreConcepts: number;
      logicalFlow: number;
      jobRelevance: number;
    };
    strengths: string[];
    weaknesses: string[];
    detailedFeedback: string;
    suggestedFollowUpQuestion?: string;
  };
}

export interface ExperienceMatchResult {
  jobPostingId: string;
  projectId: string;
  overallMatchRate: number;
  fulfilledCompetencies: string[];
  missingCompetencies: string[];
  starRestructuring: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  resumeBulletPoints: string[];
  interviewQuestions: string[];
  recommendations: string[];
}

export interface CareerReport {
  id: string;
  createdAt: string;
  companyName: string;
  targetJob: string;
  companyOverview: {
    business: string;
    marketPosition: string;
    manufacturingStrategy: string;
  };
  processAndTech: {
    coreProcesses: string[];
    keyTechs: string[];
    relevanceToJob: string;
  };
  industryTrends: {
    topTrends: string[];
    strategicInsight: string;
  };
  jobRequirementsSummary: {
    mustHave: string[];
    niceToHave: string[];
  };
  competencyAnalysis: {
    matchPercentage: number;
    strengths: string[];
    weaknesses: string[];
  };
  recommendedProjects: string[];
  expectedInterviewQuestions: {
    question: string;
    type: string;
    coreKeyword: string;
  }[];
  weeklyRoadmap: {
    week: string;
    goal: string;
    actions: string[];
  }[];
}
