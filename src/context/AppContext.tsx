import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company, JobPosting, UserProfile, InterviewQuestion, InterviewAnswer, CareerReport, ProjectExperience } from '../types';
import { COMPANIES_DATA, SAMPLE_JOB_POSTINGS, INITIAL_USER_PROFILE } from '../data/mockData';

export type NavTab = 
  | 'dashboard'
  | 'process'
  | 'trends'
  | 'jobs'
  | 'interview'
  | 'experience'
  | 'report';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  currentCompany: Company;
  selectedProcessNodeId: string | null;
  setSelectedProcessNodeId: (id: string | null) => void;
  activeTechKeyword: string | null;
  setActiveTechKeyword: (keyword: string | null) => void;
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  currentJob: JobPosting;
  jobPostings: JobPosting[];
  addJobPosting: (job: JobPosting) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addProjectExperience: (project: ProjectExperience) => void;
  deleteProjectExperience: (id: string) => void;
  interviewQuestions: InterviewQuestion[];
  setInterviewQuestions: (questions: InterviewQuestion[]) => void;
  interviewAnswers: InterviewAnswer[];
  recordInterviewAnswer: (answer: InterviewAnswer) => void;
  careerReport: CareerReport | null;
  setCareerReport: (report: CareerReport | null) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  // Deep navigation helpers
  navigateToProcessNode: (companyId: string, nodeId: string) => void;
  navigateToTechTrend: (keyword: string) => void;
  navigateToInterview: (companyName?: string, jobTitle?: string, tech?: string) => void;
  navigateToExperienceMatch: (jobId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('hyundai-motor');
  const [selectedProcessNodeId, setSelectedProcessNodeId] = useState<string | null>(null);
  const [activeTechKeyword, setActiveTechKeyword] = useState<string | null>(null);
  
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(() => {
    const saved = localStorage.getItem('autoinsight_job_postings');
    return saved ? JSON.parse(saved) : SAMPLE_JOB_POSTINGS;
  });
  const [selectedJobId, setSelectedJobId] = useState<string>(jobPostings[0]?.id || 'job-hmc-dx');

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('autoinsight_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const [interviewAnswers, setInterviewAnswers] = useState<InterviewAnswer[]>(() => {
    const saved = localStorage.getItem('autoinsight_interview_answers');
    return saved ? JSON.parse(saved) : [];
  });

  const [careerReport, setCareerReport] = useState<CareerReport | null>(() => {
    const saved = localStorage.getItem('autoinsight_career_report');
    return saved ? JSON.parse(saved) : null;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('autoinsight_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('autoinsight_job_postings', JSON.stringify(jobPostings));
  }, [jobPostings]);

  useEffect(() => {
    localStorage.setItem('autoinsight_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('autoinsight_interview_answers', JSON.stringify(interviewAnswers));
  }, [interviewAnswers]);

  useEffect(() => {
    if (careerReport) {
      localStorage.setItem('autoinsight_career_report', JSON.stringify(careerReport));
    }
  }, [careerReport]);

  useEffect(() => {
    localStorage.setItem('autoinsight_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const currentCompany = COMPANIES_DATA.find((c) => c.id === selectedCompanyId) || COMPANIES_DATA[0];
  const currentJob = jobPostings.find((j) => j.id === selectedJobId) || jobPostings[0] || SAMPLE_JOB_POSTINGS[0];

  const addJobPosting = (newJob: JobPosting) => {
    setJobPostings((prev) => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const addProjectExperience = (project: ProjectExperience) => {
    setUserProfile((prev) => ({
      ...prev,
      projects: [project, ...prev.projects]
    }));
  };

  const deleteProjectExperience = (id: string) => {
    setUserProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  const recordInterviewAnswer = (answer: InterviewAnswer) => {
    setInterviewAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== answer.questionId);
      return [answer, ...filtered];
    });
  };

  // Cross-feature flow links
  const navigateToProcessNode = (companyId: string, nodeId: string) => {
    setSelectedCompanyId(companyId);
    setSelectedProcessNodeId(nodeId);
    setActiveTab('process');
  };

  const navigateToTechTrend = (keyword: string) => {
    setActiveTechKeyword(keyword);
    setActiveTab('trends');
  };

  const navigateToInterview = (companyName?: string, jobTitle?: string) => {
    if (companyName) {
      const found = COMPANIES_DATA.find((c) => c.name.includes(companyName) || companyName.includes(c.name));
      if (found) setSelectedCompanyId(found.id);
    }
    setActiveTab('interview');
  };

  const navigateToExperienceMatch = (jobId?: string) => {
    if (jobId) setSelectedJobId(jobId);
    setActiveTab('experience');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCompanyId,
        setSelectedCompanyId,
        currentCompany,
        selectedProcessNodeId,
        setSelectedProcessNodeId,
        activeTechKeyword,
        setActiveTechKeyword,
        selectedJobId,
        setSelectedJobId,
        currentJob,
        jobPostings,
        addJobPosting,
        userProfile,
        updateUserProfile,
        addProjectExperience,
        deleteProjectExperience,
        interviewQuestions,
        setInterviewQuestions,
        interviewAnswers,
        recordInterviewAnswer,
        careerReport,
        setCareerReport,
        isDarkMode,
        setIsDarkMode,
        navigateToProcessNode,
        navigateToTechTrend,
        navigateToInterview,
        navigateToExperienceMatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
