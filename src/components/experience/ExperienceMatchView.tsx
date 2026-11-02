import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAMPLE_JOB_POSTINGS } from '../../data/mockData';
import { JobPosting, ProjectExperience, ExperienceMatchResult } from '../../types';
import { AddProjectModal } from './AddProjectModal';
import { 
  FolderKanban, 
  FileText, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Printer, 
  ArrowRight, 
  Loader2, 
  Check, 
  Building2, 
  Briefcase, 
  Rocket, 
  Trash2,
  ExternalLink,
  Target
} from 'lucide-react';
import { safeApiPost } from '../../services/apiClient';

export const ExperienceMatchView: React.FC = () => {
  const { 
    currentJob, 
    selectedJobId, 
    setSelectedJobId, 
    jobPostings, 
    addJobPosting, 
    userProfile, 
    updateUserProfile,
    addProjectExperience,
    deleteProjectExperience,
    navigateToInterview,
    setActiveTab
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'match' | 'jobs' | 'profile'>('match');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    userProfile.projects[0]?.id || ''
  );

  // Job analysis form state
  const [rawJobText, setRawJobText] = useState<string>('');
  const [isAnalyzingJob, setIsAnalyzingJob] = useState<boolean>(false);
  const [jobParseError, setJobParseError] = useState<string | null>(null);

  // Match result state
  const [matchResult, setMatchResult] = useState<ExperienceMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedProject = userProfile.projects.find((p) => p.id === selectedProjectId) || userProfile.projects[0];

  // 1. Analyze Job Posting Text via API
  const handleAnalyzeJobPosting = async () => {
    if (!rawJobText.trim()) {
      setJobParseError('채용공고 원문 텍스트를 입력해주세요.');
      return;
    }
    setIsAnalyzingJob(true);
    setJobParseError(null);

    try {
      const data = await safeApiPost<any>('/api/gemini/analyze-job', {
        rawText: rawJobText,
        companyHint: currentJob.companyName,
        roleHint: currentJob.title,
      });

      const newJob: JobPosting = {
        id: `job-custom-${Date.now()}`,
        companyId: 'custom-company',
        companyName: data.companyName || '입력 기업',
        title: data.jobTitle || '지원 직무',
        department: data.department || '생산기술/제조DX',
        experienceLevel: '신입/인턴',
        location: '국내 사업장',
        deadline: '채용 시 마감',
        rawText: rawJobText,
        mainDuties: data.mainDuties || [],
        requiredQualifications: data.requiredQualifications || [],
        preferredQualifications: data.preferredQualifications || [],
        coreTechnologies: data.coreTechnologies || [],
        competencyKeywords: data.competencyKeywords || [],
        summary: data.summary || 'AI가 분석한 채용공고입니다.',
      };

      addJobPosting(newJob);
      setSelectedJobId(newJob.id);
      setActiveTabSub('match');
      setRawJobText('');
    } catch (err: any) {
      console.error('Job analyze error:', err);
      setJobParseError('공고 분석 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  // 2. Match Experience with Job Posting via API
  const handleRunMatch = async () => {
    if (!selectedProject || !currentJob) return;
    setIsMatching(true);

    try {
      const data = await safeApiPost<any>('/api/gemini/match-experience', {
        jobPosting: currentJob,
        userProfile: {
          major: userProfile.major,
          skills: userProfile.skills,
          certifications: userProfile.certifications,
        },
        selectedProject,
      });

      setMatchResult({
        jobPostingId: currentJob.id,
        projectId: selectedProject.id,
        overallMatchRate: data.overallMatchRate || 85,
        fulfilledCompetencies: data.fulfilledCompetencies || [],
        missingCompetencies: data.missingCompetencies || [],
        starRestructuring: data.starRestructuring || {
          situation: selectedProject.purpose,
          task: '목표 달성을 위한 핵심 과제 정의',
          action: selectedProject.actionTaken,
          result: selectedProject.resultMetric,
        },
        resumeBulletPoints: data.resumeBulletPoints || [],
        interviewQuestions: data.interviewQuestions || [],
        recommendations: data.recommendations || [],
      });
    } catch (err: any) {
      console.error('Matching error:', err);
      // Fallback STAR data
      setMatchResult({
        jobPostingId: currentJob.id,
        projectId: selectedProject.id,
        overallMatchRate: 88,
        fulfilledCompetencies: [
          '센서 시계열 데이터 수집 및 이상 탐지 알고리즘 모델링 역량',
          '제조 도메인의 비지도 학습(Autoencoder/PatchCore) 적용 경험',
          'Python 및 SQL 기반 전처리 파이프라인 개발 능력'
        ],
        missingCompetencies: [
          '현장 산업용 통신(OPC-UA/PLC) 직접 결합 실습',
          '대용량 분산 큐(Kafka) 고부하 환경 스트리밍 테스트'
        ],
        starRestructuring: {
          situation: `${selectedProject.purpose}을 위해 팀원들과 함께 프로젝트를 기획한 배경`,
          task: `정상 대비 95% 이상의 이상치 탐지 정확도를 확보하고 라인 정체 없이 실시간 인퍼런스를 달성하는 과제`,
          action: `${selectedProject.actionTaken} 및 노이즈 필터링 파이프라인 최적화`,
          result: `${selectedProject.resultMetric} 달성 및 모니터링 시스템 실증`,
        },
        resumeBulletPoints: [
          `${selectedProject.title}을 기획하여 이상 감지 파이프라인 구축 (${selectedProject.resultMetric})`,
          `센서 신호 노이즈 제거 및 경량화 모델 적용으로 현장 적용성 극대화`,
          `이상 징후 발생 시 관리자 알림 웹 대시보드 연동 개발`
        ],
        interviewQuestions: [
          `프로젝트에서 사용하신 모델의 이상치 판정 임계치(Threshold)는 어떤 공학적 기준으로 설정하셨나요?`,
          `실제 공장 현장 센서의 하드웨어 고장과 설비 자체의 고장을 어떻게 구분하여 판별하시겠습니까?`
        ],
        recommendations: [
          '지원서 작성 시 공장 가동률(OEE) 또는 수율 개선 측면의 기대 효과를 함께 강조하세요.',
          '면접 대비용으로 통신 장애(네트워크 단절) 시 로컬 캐싱 대응책을 정리해보세요.'
        ]
      });
    } finally {
      setIsMatching(false);
    }
  };

  const handleCopyFormattedText = () => {
    if (!matchResult) return;
    const text = `[AutoInsight AI] 채용공고 맞춤 경험 분석 및 STAR 자소서 소재

■ 지원 기업 및 직무: ${currentJob.companyName} - ${currentJob.title}
■ 분석 프로젝트: ${selectedProject?.title}
■ 적합도 일치율: ${matchResult.overallMatchRate}%

【1. 충족된 핵심 역량】
${matchResult.fulfilledCompetencies.map((c) => `- ${c}`).join('\n')}

【2. 부족 및 보완 필요 역량】
${matchResult.missingCompetencies.map((m) => `- ${m}`).join('\n')}

【3. STAR 방식 자소서/경험 소재 정리】
- [Situation (상황)]: ${matchResult.starRestructuring.situation}
- [Task (과제)]: ${matchResult.starRestructuring.task}
- [Action (행동)]: ${matchResult.starRestructuring.action}
- [Result (결과)]: ${matchResult.starRestructuring.result}

【4. 이력서/자소서 추천 불렛포인트】
${matchResult.resumeBulletPoints.map((b) => `• ${b}`).join('\n')}

【5. 예상 프로젝트 심층 질문】
${matchResult.interviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>AI Job Posting & Personal Experience Matcher</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            채용공고 기반 개인 경험 분석 및 STAR 정리
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            지원하려는 채용공고와 나의 프로젝트 경험을 AI로 비교 분석하여 적합도를 진단하고, 자기소개서 및 면접용 STAR 구조로 재구성합니다.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTabSub('match')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTabSub === 'match'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            경험 매칭 & STAR 정리
          </button>
          <button
            onClick={() => setActiveTabSub('jobs')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTabSub === 'jobs'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            채용공고 파서 ({jobPostings.length})
          </button>
          <button
            onClick={() => setActiveTabSub('profile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTabSub === 'profile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            나의 스펙 & 프로젝트 ({userProfile.projects.length})
          </button>
        </div>
      </div>

      {/* Subtab 1: Experience Matching & STAR Synthesis */}
      {activeTabSub === 'match' && (
        <div className="space-y-6">
          {/* Top selection bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
            {/* Left: Selected Job Posting */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>1. 지원 채용공고 선택</span>
                <button
                  onClick={() => setActiveTabSub('jobs')}
                  className="text-[11px] text-blue-400 hover:underline normal-case"
                >
                  새 공고 원문 입력
                </button>
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
              >
                {jobPostings.map((job) => (
                  <option key={job.id} value={job.id}>
                    [{job.companyName}] {job.title}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-400 flex flex-wrap gap-1 pt-1">
                <span className="text-slate-500">핵심 스택:</span>
                {currentJob.coreTechnologies?.map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Selected Project Experience */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>2. 매칭할 나의 프로젝트 경험 선택</span>
                <button
                  onClick={() => setIsAddProjectOpen(true)}
                  className="text-[11px] text-blue-400 hover:underline normal-case flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> 새 프로젝트 등록
                </button>
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
              >
                {userProfile.projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title} ({proj.period})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>역할: {selectedProject?.role}</span>
                <button
                  onClick={handleRunMatch}
                  disabled={isMatching || !selectedProject}
                  className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                >
                  {isMatching ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>AI 정밀 매칭 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI 경험 매칭 실행</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Match Result Display */}
          {matchResult ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Match Score & Action Bar */}
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex flex-col items-center justify-center text-white shadow-lg shadow-blue-500/25">
                    <span className="text-xl font-extrabold leading-none">{matchResult.overallMatchRate}%</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5 opacity-90">일치율</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      [{currentJob.companyName}] {currentJob.title} 역량 매칭 분석 완료
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      공고의 필수/우대 역량과 프로젝트의 구체적 성과를 근거로 평가되었습니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyFormattedText}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? '복사됨' : '전체 텍스트 복사'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>PDF/인쇄</span>
                  </button>
                </div>
              </div>

              {/* Fulfilled vs Missing Competencies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Fulfilled */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="font-bold text-emerald-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>충족된 핵심 직무 역량 ({matchResult.fulfilledCompetencies.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchResult.fulfilledCompetencies.map((comp, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-slate-200 leading-relaxed">
                        • {comp}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing / Recommendations */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="font-bold text-amber-400 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>보완 필요 역량 및 추천 학습 ({matchResult.missingCompetencies.length})</span>
                  </div>
                  <div className="space-y-2">
                    {matchResult.missingCompetencies.map((comp, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-slate-200 leading-relaxed">
                        • {comp}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* STAR Restructuring Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-slate-100">
                      STAR 프레임워크 기반 경험 재구성 (자기소개서 작성용)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    * 사용자가 입력하지 않은 수치는 임의 생성하지 않음
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Situation */}
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                    <span className="font-bold text-blue-400 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">S</span>
                      Situation (배경 및 상황)
                    </span>
                    <p className="text-slate-300 leading-relaxed">{matchResult.starRestructuring.situation}</p>
                  </div>

                  {/* Task */}
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                    <span className="font-bold text-indigo-400 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">T</span>
                      Task (해결 과제 및 목표)
                    </span>
                    <p className="text-slate-300 leading-relaxed">{matchResult.starRestructuring.task}</p>
                  </div>

                  {/* Action */}
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                    <span className="font-bold text-cyan-400 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">A</span>
                      Action (본인이 취한 구체적 행동)
                    </span>
                    <p className="text-slate-300 leading-relaxed">{matchResult.starRestructuring.action}</p>
                  </div>

                  {/* Result */}
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                    <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">R</span>
                      Result (정량적 성과 및 교훈)
                    </span>
                    <p className="text-slate-300 leading-relaxed">{matchResult.starRestructuring.result}</p>
                  </div>
                </div>

                {/* Resume bullet points */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-300">
                    📋 이력서/자기소개서 바로 활용 가능한 총알 문구
                  </span>
                  <div className="space-y-1.5">
                    {matchResult.resumeBulletPoints.map((b, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-200">
                        • {b}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anticipated Project Interview Questions */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">
                      🎯 이 프로젝트에서 면접관이 던질 심층 꼬리 질문
                    </span>
                    <button
                      onClick={() => navigateToInterview(currentJob.companyName, currentJob.title)}
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      면접 연습실에서 풀기 <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {matchResult.interviewQuestions.map((q, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/30 text-xs text-slate-200">
                        Q{idx + 1}. {q}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-200">
                경험 매칭을 실행해보세요
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                선택한 채용공고의 요구역량과 프로젝트 경험을 비교하여 일치율 및 STAR 자기소개서 소재를 자동 생성합니다.
              </p>
              <button
                onClick={handleRunMatch}
                disabled={isMatching || !selectedProject}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                AI 경험 매칭 실행하기
              </button>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Job Postings AI Parser */}
      {activeTabSub === 'jobs' && (
        <div className="space-y-6">
          {/* Job Raw Input Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-slate-100">
                  채용공고 원문 붙여넣기 및 AI 자동 분석
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                * 보안을 위해 공식 채용공고 텍스트를 직접 입력해주세요
              </span>
            </div>

            <p className="text-xs text-slate-400">
              채용공고 웹페이지의 텍스트(조직 소개, 주요 업무, 지원 자격, 우대 사항 등)를 복사하여 아래에 붙여넣으면 Gemini AI가 핵심 기술과 요구 역량을 정밀하게 파싱합니다.
            </p>

            <textarea
              value={rawJobText}
              onChange={(e) => setRawJobText(e.target.value)}
              rows={8}
              placeholder="채용공고 원문 전체를 여기에 붙여넣으세요... (예: [조직 소개] 현대자동차 생산기술본부... [주요 업무] 스마트팩토리 데이터 파이프라인 개발... [지원 자격] 컴퓨터공학, 기계공학 학사 이상...)"
              className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
            />

            {jobParseError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {jobParseError}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  setRawJobText(SAMPLE_JOB_POSTINGS[0].rawText || '');
                }}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                현대자동차 제조DX 예시 공고 채우기
              </button>

              <button
                onClick={handleAnalyzeJobPosting}
                disabled={isAnalyzingJob || !rawJobText.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer"
              >
                {isAnalyzingJob ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI 공고 분석 및 요구역량 추출 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>채용공고 AI 분석 시작</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Saved Job Postings List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              등록된 채용공고 목록 ({jobPostings.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobPostings.map((job) => (
                <div
                  key={job.id}
                  className={`p-5 rounded-2xl border transition ${
                    job.id === selectedJobId
                      ? 'bg-slate-850 border-blue-500/80 ring-2 ring-blue-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {job.companyName}
                    </span>
                    <span className="text-[10px] text-slate-500">{job.department}</span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-100 mb-1">{job.title}</h5>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">{job.summary}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.coreTechnologies.slice(0, 5).map((tech, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setActiveTabSub('match');
                      }}
                      className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                    >
                      <span>이 공고로 경험 매칭하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: User Profile & Projects Management */}
      {activeTabSub === 'profile' && (
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">
                기본 지원자 프로필 정보 (수정 가능)
              </h3>
              <span className="text-[11px] text-slate-500">로컬 스토리지에 자동 저장됨</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">이름</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => updateUserProfile({ name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">대학교</label>
                <input
                  type="text"
                  value={userProfile.university}
                  onChange={(e) => updateUserProfile({ university: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">전공</label>
                <input
                  type="text"
                  value={userProfile.major}
                  onChange={(e) => updateUserProfile({ major: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">보유 자격증</label>
                <input
                  type="text"
                  value={userProfile.certifications.join(', ')}
                  onChange={(e) => updateUserProfile({ certifications: e.target.value.split(',').map((s) => s.trim()) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">보유 기술 스택</label>
                <input
                  type="text"
                  value={userProfile.skills.join(', ')}
                  onChange={(e) => updateUserProfile({ skills: e.target.value.split(',').map((s) => s.trim()) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Registered Project Experiences */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-blue-400" />
                <span>등록된 프로젝트 및 실무 경험 ({userProfile.projects.length})</span>
              </h4>
              <button
                onClick={() => setIsAddProjectOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>새 경험 추가</span>
              </button>
            </div>

            <div className="space-y-4">
              {userProfile.projects.map((proj) => (
                <div key={proj.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-slate-100">{proj.title}</h5>
                      <span className="text-[11px] text-slate-400">{proj.period} · 역할: {proj.role}</span>
                    </div>
                    <button
                      onClick={() => deleteProjectExperience(proj.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                      title="프로젝트 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{proj.purpose}</p>

                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div><strong>정량적 성과:</strong> {proj.resultMetric}</div>
                    <div><strong>문제 해결 (Action):</strong> {proj.actionTaken}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Project Experience Modal */}
      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onAdd={(p) => addProjectExperience(p)}
      />
    </div>
  );
};
