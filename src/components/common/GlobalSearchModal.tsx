import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANIES_DATA, TECH_TRENDS_DATA, SAMPLE_JOB_POSTINGS } from '../../data/mockData';
import { 
  Search, 
  X, 
  Building2, 
  GitGraph, 
  TrendingUp, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    setSelectedCompanyId, 
    navigateToProcessNode, 
    navigateToTechTrend, 
    navigateToExperienceMatch,
    setActiveTab 
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  // Search Companies
  const matchingCompanies = COMPANIES_DATA.filter(
    (c) =>
      c.name.toLowerCase().includes(normalizedQuery) ||
      c.englishName.toLowerCase().includes(normalizedQuery) ||
      c.keyBusiness.some((b) => b.toLowerCase().includes(normalizedQuery)) ||
      c.keyTechnologies.some((t) => t.toLowerCase().includes(normalizedQuery))
  );

  // Search Processes
  const matchingProcesses = COMPANIES_DATA.flatMap((c) =>
    c.nodes
      .filter(
        (n) =>
          n.name.toLowerCase().includes(normalizedQuery) ||
          n.shortDesc.toLowerCase().includes(normalizedQuery) ||
          n.appliedTech.some((t) => t.toLowerCase().includes(normalizedQuery)) ||
          n.relatedJobs.some((j) => j.toLowerCase().includes(normalizedQuery))
      )
      .map((node) => ({ company: c, node }))
  );

  // Search Tech Trends
  const matchingTrends = TECH_TRENDS_DATA.filter(
    (t) =>
      t.name.toLowerCase().includes(normalizedQuery) ||
      t.category.toLowerCase().includes(normalizedQuery) ||
      t.keySkills.some((s) => s.toLowerCase().includes(normalizedQuery))
  );

  // Search Jobs
  const matchingJobs = SAMPLE_JOB_POSTINGS.filter(
    (j) =>
      j.title.toLowerCase().includes(normalizedQuery) ||
      j.companyName.toLowerCase().includes(normalizedQuery) ||
      j.coreTechnologies.some((t) => t.toLowerCase().includes(normalizedQuery))
  );

  const hasResults =
    matchingCompanies.length > 0 ||
    matchingProcesses.length > 0 ||
    matchingTrends.length > 0 ||
    matchingJobs.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-850">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="기업명(현대차, 모비스 등), 공정(차체, 도장), 기술(비전, MES), 직무 검색..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {!hasResults && query && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">검색어 "{query}"에 대한 결과가 없습니다.</p>
              <p className="text-xs text-slate-500 mt-1">현대자동차, 기아, 비전 검사, 배터리, 스마트팩토리 등의 키워드로 검색해보세요.</p>
            </div>
          )}

          {/* Quick suggestions when query is empty */}
          {!query && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>추천 탐색 키워드</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['현대자동차 차체 공정', '비전 검사 기술', '현대오토에버 MES', '배터리 EOL 검사', 'AMR 물류', '제조DX 면접 질문'].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => setQuery(sug.split(' ')[0])}
                    className="px-3 py-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Companies */}
          {matchingCompanies.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>기업 ({matchingCompanies.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCompanyId(c.id);
                      setActiveTab('process');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition text-left group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{c.logo}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition">
                          {c.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{c.category} · 공정 {c.nodes.length}개</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Processes */}
          {matchingProcesses.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <GitGraph className="w-3.5 h-3.5 text-blue-400" />
                <span>제조공정 단계 ({matchingProcesses.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingProcesses.slice(0, 5).map(({ company, node }) => (
                  <button
                    key={`${company.id}-${node.id}`}
                    onClick={() => {
                      navigateToProcessNode(company.id, node.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition text-left group"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-medium">
                          {company.name}
                        </span>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition">
                          {node.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {node.shortDesc}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Tech Trends */}
          {matchingTrends.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>기술 트렌드 ({matchingTrends.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingTrends.slice(0, 4).map((trend) => (
                  <button
                    key={trend.id}
                    onClick={() => {
                      navigateToTechTrend(trend.name);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition text-left group"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition">
                          {trend.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
                          {trend.growthRate}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        관련 채용공고 {trend.relatedJobsCount}건 · 스택: {trend.keySkills.slice(0, 3).join(', ')}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Job Postings */}
          {matchingJobs.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>채용공고 ({matchingJobs.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchingJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => {
                      navigateToExperienceMatch(job.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition text-left group"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-medium">
                          {job.companyName}
                        </span>
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition">
                          {job.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {job.department} · {job.coreTechnologies.slice(0, 4).join(', ')}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span>[Enter] 선택</span>
            <span>[Esc] 닫기</span>
          </div>
          <span>AutoInsight AI Unified Index</span>
        </div>
      </div>
    </div>
  );
};
