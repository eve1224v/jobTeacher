import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANIES_DATA, TECH_TRENDS_DATA, SAMPLE_JOB_POSTINGS } from '../../data/mockData';
import { 
  Search, 
  Car, 
  ChevronDown, 
  Moon, 
  Sun, 
  Sparkles, 
  Building2, 
  CheckCircle2,
  Briefcase,
  X,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const { 
    currentCompany, 
    setSelectedCompanyId, 
    currentJob, 
    userProfile, 
    isDarkMode, 
    setIsDarkMode,
    setActiveTab,
    navigateToProcessNode,
    navigateToTechTrend,
    navigateToExperienceMatch
  } = useApp();

  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic AI status check for Vercel / server
  const [aiStatus, setAiStatus] = useState<{
    hasApiKey: boolean;
    keyName?: string | null;
    model: string;
    environment?: string;
  } | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetch('/api/gemini/status')
      .then((res) => {
        const ct = res.headers.get('content-type') || '';
        return res.ok && ct.includes('application/json') ? res.json() : null;
      })
      .then((data) => {
        if (data) setAiStatus(data);
      })
      .catch((err) => {
        console.warn('AI status check failed:', err);
      });
  }, []);

  // Click outside listener for search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = searchQuery.toLowerCase().trim();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return null;

    const matchedCompanies = COMPANIES_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(normalizedQuery) ||
        c.keyTechnologies.some((t) => t.toLowerCase().includes(normalizedQuery))
    ).slice(0, 3);

    const matchedProcesses = COMPANIES_DATA.flatMap((c) =>
      c.nodes
        .filter(
          (n) =>
            n.name.toLowerCase().includes(normalizedQuery) ||
            n.appliedTech.some((t) => t.toLowerCase().includes(normalizedQuery))
        )
        .map((node) => ({ company: c, node }))
    ).slice(0, 3);

    const matchedTrends = TECH_TRENDS_DATA.filter(
      (t) =>
        t.name.toLowerCase().includes(normalizedQuery) ||
        t.keySkills.some((s) => s.toLowerCase().includes(normalizedQuery))
    ).slice(0, 3);

    const matchedJobs = SAMPLE_JOB_POSTINGS.filter(
      (j) =>
        j.title.toLowerCase().includes(normalizedQuery) ||
        j.companyName.toLowerCase().includes(normalizedQuery)
    ).slice(0, 2);

    return {
      companies: matchedCompanies,
      processes: matchedProcesses,
      trends: matchedTrends,
      jobs: matchedJobs,
      totalCount:
        matchedCompanies.length +
        matchedProcesses.length +
        matchedTrends.length +
        matchedJobs.length,
    };
  }, [normalizedQuery]);

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-slate-800 text-slate-100 px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Branding & Tagline */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                AutoInsight <span className="text-blue-400 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              자동차 산업 맞춤형 AI 취업 플랫폼
            </p>
          </div>
        </div>
      </div>

      {/* Center: Global Search & Quick Switcher */}
      <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center space-x-3">
        {/* Real Search Input Box (No placeholder text) */}
        <div ref={searchContainerRef} className="relative w-full">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchFocused(false);
                }
              }}
              className="w-full pl-9 pr-8 py-2 text-xs text-slate-100 bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800 border border-slate-700/80 focus:border-blue-500 rounded-lg transition shadow-inner focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown */}
          {isSearchFocused && searchResults && searchResults.totalCount > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
              {/* Companies */}
              {searchResults.companies.length > 0 && (
                <div className="px-2 py-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    기업
                  </div>
                  {searchResults.companies.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => {
                        setSelectedCompanyId(comp.id);
                        setActiveTab('process');
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs hover:bg-slate-800 text-slate-200 transition"
                    >
                      <span className="flex items-center space-x-2">
                        <span>{comp.logo}</span>
                        <span className="font-semibold">{comp.name}</span>
                        <span className="text-[10px] text-slate-400">{comp.category}</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}

              {/* Processes */}
              {searchResults.processes.length > 0 && (
                <div className="px-2 py-1 border-t border-slate-800">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    제조공정
                  </div>
                  {searchResults.processes.map(({ company, node }) => (
                    <button
                      key={`${company.id}-${node.id}`}
                      onClick={() => {
                        navigateToProcessNode(company.id, node.id);
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs hover:bg-slate-800 text-slate-200 transition"
                    >
                      <div className="truncate">
                        <span className="text-[10px] px-1 py-0.5 rounded bg-slate-800 text-slate-400 mr-1.5">
                          {company.name}
                        </span>
                        <span className="font-semibold">{node.name}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              )}

              {/* Tech Trends */}
              {searchResults.trends.length > 0 && (
                <div className="px-2 py-1 border-t border-slate-800">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    기술 트렌드
                  </div>
                  {searchResults.trends.map((trend) => (
                    <button
                      key={trend.id}
                      onClick={() => {
                        navigateToTechTrend(trend.name);
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs hover:bg-slate-800 text-slate-200 transition"
                    >
                      <span className="font-semibold truncate">{trend.name}</span>
                      <span className="text-[10px] text-emerald-400 shrink-0 ml-1">{trend.growthRate}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Jobs */}
              {searchResults.jobs.length > 0 && (
                <div className="px-2 py-1 border-t border-slate-800">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    채용공고
                  </div>
                  {searchResults.jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => {
                        navigateToExperienceMatch(job.id);
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs hover:bg-slate-800 text-slate-200 transition"
                    >
                      <span className="font-semibold truncate">[{job.companyName}] {job.title}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Company Quick Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
            className="flex items-center space-x-2 px-3 py-2 text-xs font-medium bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg transition whitespace-nowrap text-slate-200"
          >
            <span className="text-base">{currentCompany.logo}</span>
            <span className="font-semibold">{currentCompany.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {companyDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span>기업 선택</span>
                <span className="text-[10px] text-blue-400">{COMPANIES_DATA.length}개사 등록됨</span>
              </div>
              <div className="max-h-72 overflow-y-auto py-1">
                {COMPANIES_DATA.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setSelectedCompanyId(comp.id);
                      setCompanyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition ${
                      comp.id === currentCompany.id ? 'bg-blue-600/15 text-blue-400' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">{comp.logo}</span>
                      <div>
                        <div className="text-xs font-medium">{comp.name}</div>
                        <div className="text-[10px] text-slate-500">{comp.category}</div>
                      </div>
                    </div>
                    {comp.id === currentCompany.id && (
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, AI Status, User Profile */}
      <div className="flex items-center space-x-3">
        {/* Mobile Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* AI Engine Status Badge (Click to see Vercel/Key setup guide) */}
        <button
          onClick={() => setShowStatusModal(true)}
          className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition cursor-pointer ${
            aiStatus?.hasApiKey
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
          }`}
          title="AI 상태 및 Vercel 환경변수 설정 가이드 보기"
        >
          {aiStatus?.hasApiKey ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Gemini AI 활성</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>AI 키 확인/설정</span>
            </>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsDarkMode((prev) => !prev)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
            isDarkMode
              ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
              : 'bg-white text-indigo-600 border-slate-300 hover:bg-slate-100 shadow-sm'
          }`}
          title={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">라이트</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline text-[11px]">다크</span>
            </>
          )}
        </button>

        {/* User Profile Chip */}
        <div 
          onClick={() => setActiveTab('experience')}
          className="flex items-center space-x-2.5 pl-2 cursor-pointer group"
          title="나의 프로필 및 경험 관리로 이동"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-md group-hover:ring-2 ring-blue-400 transition">
            {userProfile.name.slice(0, 1)}
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition">
              {userProfile.name}
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[100px]">
              {userProfile.major}
            </div>
          </div>
        </div>
      </div>

      {/* Vercel & AI Configuration Guide Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Gemini AI 연동 및 Vercel 배포 상태</h3>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">API 키 인식 상태:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    aiStatus?.hasApiKey
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {aiStatus?.hasApiKey ? '연결 완료 (Ready)' : '키 미인식 (데모 모드)'}
                  </span>
                </div>
                {aiStatus?.keyName && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">인식된 변수명:</span>
                    <span className="text-blue-300 font-mono">{aiStatus.keyName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">사용 모델:</span>
                  <span className="text-slate-200 font-mono">gemini-3.8-flash</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">실행 런타임:</span>
                  <span className="text-indigo-300 font-mono">{aiStatus?.environment || 'node-server'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
                  <span>🚀 Vercel 배포 시 AI 키 설정 3단계 가이드</span>
                </h4>
                <div className="space-y-1.5 text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 leading-relaxed">
                    <strong>1. 환경변수 등록:</strong> Vercel 대시보드 ➔ <strong>Settings</strong> ➔ <strong>Environment Variables</strong>에 Key: <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-300 font-mono">GEMINI_API_KEY</code>, Value: 발급받은 키 입력 후 <strong>Save</strong>합니다.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 leading-relaxed text-amber-200 bg-amber-950/20 border-amber-500/30">
                    <strong>2. 반드시 Redeploy 실행 (필수):</strong> Vercel은 환경변수를 추가한 후 반드시 <strong>Deployments</strong> 탭 ➔ 최신 배포 ➔ <strong>Redeploy</strong>를 해야 서버리스 함수에 새 키가 주입됩니다!
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 leading-relaxed">
                    <strong>3. 동작 확인:</strong> <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300 font-mono">/api/gemini/status</code> 경로에 접속하여 <code className="text-emerald-400 font-mono">"hasApiKey": true</code> 확인 가능합니다.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
