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
  ArrowRight
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

        {/* AI Engine Status Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Gemini 3.8 Engine</span>
        </div>

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
    </header>
  );
};
