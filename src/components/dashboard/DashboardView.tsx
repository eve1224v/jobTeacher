import React from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANIES_DATA, TECH_TRENDS_DATA } from '../../data/mockData';
import { 
  Building2, 
  GitGraph, 
  TrendingUp, 
  FileText, 
  MessageSquareCode, 
  FolderKanban, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ChevronRight,
  Gauge,
  Play,
  Layers,
  Cpu
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentCompany, 
    setSelectedCompanyId, 
    currentJob, 
    userProfile, 
    interviewAnswers, 
    setActiveTab, 
    navigateToProcessNode,
    navigateToTechTrend,
    navigateToInterview,
    navigateToExperienceMatch
  } = useApp();

  // Average interview score
  const avgScore = interviewAnswers.length > 0
    ? Math.round(
        interviewAnswers.reduce((acc, curr) => acc + (curr.evaluation?.overallScore || 75), 0) /
          interviewAnswers.length
      )
    : 85;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-500/30 p-6 lg:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              AutoInsight AI 취업 준비 허브
            </span>
            <span className="text-xs text-slate-400">
              {userProfile.university} {userProfile.major} {userProfile.name}님 환영합니다.
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            자동차 산업을 이해하고, 나에게 맞는 취업 전략을 설계하다.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            완성차 제조공정(프레스·차체·도장·의장·검사)부터 스마트팩토리, 제조DX, AI 비전 품질검사, 전동화 부품까지. 기업 분석부터 실전 기술 면접, STAR 경험 정리까지 원스톱으로 준비하세요.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('process')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center space-x-2 cursor-pointer"
            >
              <GitGraph className="w-4 h-4" />
              <span>{currentCompany.name} 공정 흐름도 탐색</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center space-x-2"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>취업 준비 리포트 발급</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      {/* Recommended Interactive Scenario Chain (Prompt Scenario) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">
              추천 사용자 여정: 현대자동차 제조DX 직무 지원 시나리오 가이드
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">6단계 유기적 연결 프로세스</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Step 1 */}
          <div 
            onClick={() => setActiveTab('process')}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 cursor-pointer transition space-y-1.5 group"
          >
            <span className="text-[10px] font-bold text-blue-400">STEP 1</span>
            <div className="font-bold text-slate-200 group-hover:text-blue-300">기업 & 공정 탐색</div>
            <p className="text-[10px] text-slate-400 line-clamp-2">현대자동차 5대 완성차 제조공정 확인</p>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => navigateToProcessNode('hyundai-motor', 'hmc-p2')}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 cursor-pointer transition space-y-1.5 group"
          >
            <span className="text-[10px] font-bold text-indigo-400">STEP 2</span>
            <div className="font-bold text-slate-200 group-hover:text-indigo-300">차체 공정 분석</div>
            <p className="text-[10px] text-slate-400 line-clamp-2">로봇 용접 및 비전 검사 기술 확인</p>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => navigateToTechTrend('머신비전 AI 품질검사')}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 cursor-pointer transition space-y-1.5 group"
          >
            <span className="text-[10px] font-bold text-cyan-400">STEP 3</span>
            <div className="font-bold text-slate-200 group-hover:text-cyan-300">기술 트렌드 학습</div>
            <p className="text-[10px] text-slate-400 line-clamp-2">비전 AI 및 SDF 기술 동향 분석</p>
          </div>

          {/* Step 4 */}
          <div 
            onClick={() => setActiveTab('jobs')}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 cursor-pointer transition space-y-1.5 group"
          >
            <span className="text-[10px] font-bold text-amber-400">STEP 4</span>
            <div className="font-bold text-slate-200 group-hover:text-amber-300">채용공고 AI 분석</div>
            <p className="text-[10px] text-slate-400 line-clamp-2">제조DX 공고 필수/우대 역량 추출</p>
          </div>

          {/* Step 5 */}
          <div 
            onClick={() => navigateToInterview('현대자동차', '제조DX')}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition space-y-1.5 group"
          >
            <span className="text-[10px] font-bold text-emerald-400">STEP 5</span>
            <div className="font-bold text-slate-200 group-hover:text-emerald-300">전공 면접 시뮬</div>
            <p className="text-[10px] text-slate-400 line-clamp-2">예상 질문 풀기 및 AI 정밀 채점</p>
          </div>

          {/* Step 6 */}
          <div 
            onClick={() => setActiveTab('experience')}
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 cursor-pointer transition space-y-1.5 group"
          >
            <span className="text-[10px] font-bold text-purple-400">STEP 6</span>
            <div className="font-bold text-slate-200 group-hover:text-purple-300">STAR 경험 매칭</div>
            <p className="text-[10px] text-slate-400 line-clamp-2">내 프로젝트 자소서 소재 재구성</p>
          </div>
        </div>
      </div>

      {/* 4 Pillars Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Target Company Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                관심 기업
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">
                {currentCompany.category}
              </span>
            </div>
            <div className="flex items-center space-x-2.5 pt-1">
              <span className="text-2xl p-1 bg-slate-800 rounded-lg">{currentCompany.logo}</span>
              <div>
                <h4 className="font-bold text-sm text-slate-100">{currentCompany.name}</h4>
                <p className="text-[11px] text-slate-400">{currentCompany.englishName}</p>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              핵심 공정 {currentCompany.nodes.length}개 단계 시각화됨
            </div>
          </div>

          <button
            onClick={() => setActiveTab('process')}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 transition flex items-center justify-between"
          >
            <span>공정 흐름도 열기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Target Job Posting */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                목표 채용공고
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                {currentJob.experienceLevel}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{currentJob.title}</h4>
              <p className="text-[11px] text-slate-400">{currentJob.department}</p>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {currentJob.coreTechnologies?.slice(0, 3).map((t, idx) => (
                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('experience')}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 transition flex items-center justify-between"
          >
            <span>경험 매칭 진단</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Skills & Competencies */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                기술 역량 보유도
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">
                {userProfile.skills.length}개 보유
              </span>
            </div>
            <div>
              <div className="text-xl font-extrabold text-cyan-400">88%</div>
              <p className="text-[11px] text-slate-400">자동차 DX 엔지니어 요구 스펙 부합</p>
            </div>
            <div className="text-[11px] text-slate-400">
              추천 보완 학습: <span className="text-amber-400 font-medium">OPC-UA 산업용 통신</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('trends')}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition flex items-center justify-between"
          >
            <span>기술 트렌드 학습</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4: Interview Simulation Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold">
                <MessageSquareCode className="w-3.5 h-3.5 text-emerald-400" />
                면접 준비 현황
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                {interviewAnswers.length}문항 완료
              </span>
            </div>
            <div>
              <div className="text-xl font-extrabold text-emerald-400">
                {interviewAnswers.length > 0 ? `${avgScore}점` : '준비 시작'}
              </div>
              <p className="text-[11px] text-slate-400">
                {interviewAnswers.length > 0 ? 'AI 모의 면접 평균 득점' : '실전 질문을 풀고 채점받으세요'}
              </p>
            </div>
            <div className="text-[11px] text-slate-400">
              취약 개념: <span className="text-slate-300">네트워크 병목 및 결함 불균형</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('interview')}
            className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition flex items-center justify-between"
          >
            <span>면접 연습 계속하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Company Process Snapshot & Registered Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Manufacturing Process Quick Snapshot */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-100">
                {currentCompany.name} 제조공정 단계별 핵심 기술
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('process')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              전체 공정도 보기 <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {currentCompany.nodes.map((node, i) => (
              <div
                key={node.id}
                onClick={() => navigateToProcessNode(currentCompany.id, node.id)}
                className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-slate-200 group-hover:text-blue-400 transition">
                      {node.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{node.shortDesc}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline-block">
                    {node.appliedTech[0]}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Personal Projects & Portfolio */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100">
                나의 모빌리티/제조 프로젝트 경험 ({userProfile.projects.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('experience')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              경험 관리로 이동 <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {userProfile.projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setActiveTab('experience')}
                className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-slate-200 group-hover:text-indigo-400 transition line-clamp-1">
                    {proj.title}
                  </h5>
                  <span className="text-[10px] text-slate-500 shrink-0">{proj.period.split(' ')[0]}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{proj.purpose}</p>
                <div className="flex flex-wrap gap-1">
                  {proj.techStack.slice(0, 4).map((tech, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
