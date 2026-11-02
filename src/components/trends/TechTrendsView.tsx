import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TECH_TRENDS_DATA, COMPANIES_DATA } from '../../data/mockData';
import { TechnologyTrend } from '../../types';
import { TechDetailModal } from './TechDetailModal';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  Cpu, 
  Building2, 
  Filter, 
  Sparkles, 
  ArrowUpRight, 
  Info, 
  Search,
  ExternalLink,
  Target
} from 'lucide-react';

export const TechTrendsView: React.FC = () => {
  const { 
    activeTechKeyword, 
    setActiveTechKeyword, 
    currentCompany,
    navigateToInterview 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [activeModalTrend, setActiveModalTrend] = useState<TechnologyTrend | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // If activeTechKeyword was passed from process flow or search, auto open or filter
  const selectedTrendFromContext = useMemo(() => {
    if (!activeTechKeyword) return null;
    return TECH_TRENDS_DATA.find((t) =>
      t.name.toLowerCase().includes(activeTechKeyword.toLowerCase()) ||
      activeTechKeyword.toLowerCase().includes(t.name.toLowerCase()) ||
      t.keySkills.some((s) => s.toLowerCase().includes(activeTechKeyword.toLowerCase()))
    );
  }, [activeTechKeyword]);

  // Filtered Tech list
  const filteredTrends = useMemo(() => {
    return TECH_TRENDS_DATA.filter((trend) => {
      const matchCategory =
        selectedCategory === 'all' || trend.category === selectedCategory;
      const matchCompany =
        selectedCompanyFilter === 'all' ||
        trend.companies.some((c) => c.includes(selectedCompanyFilter));
      const matchSearch =
        !searchQuery.trim() ||
        trend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trend.keySkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchCompany && matchSearch;
    });
  }, [selectedCategory, selectedCompanyFilter, searchQuery]);

  // 1. Bar Chart Data: Mention Frequency
  const frequencyChartData = useMemo(() => {
    return filteredTrends.map((t) => ({
      name: t.name.length > 12 ? t.name.slice(0, 11) + '..' : t.name,
      fullName: t.name,
      언급빈도: t.mentionFrequency,
      채용공고수: t.relatedJobsCount,
    }));
  }, [filteredTrends]);

  // 2. Timeline Trend Data (2024 ~ 2026)
  const timelineChartData = useMemo(() => {
    const periods = ['2024 상반기', '2024 하반기', '2025 상반기', '2025 하반기', '2026 상반기'];
    return periods.map((period) => {
      const entry: any = { period };
      TECH_TRENDS_DATA.slice(0, 4).forEach((trend) => {
        const hist = trend.trendHistory.find((h) => h.period === period);
        entry[trend.name.split(' ')[0]] = hist ? hist.count : 0;
      });
      return entry;
    });
  }, []);

  // 3. Radar Chart Data: Company Tech Focus Comparison
  const radarChartData = [
    { subject: '스마트팩토리', 현대차: 95, 기아: 88, 오토에버: 98, 모비스: 90 },
    { subject: '제조DX/SDF', 현대차: 90, 기아: 85, 오토에버: 100, 모비스: 82 },
    { subject: '머신비전/AI', 현대차: 94, 기아: 89, 오토에버: 92, 모비스: 96 },
    { subject: '설비예지보전', 현대차: 88, 기아: 82, 오토에버: 86, 모비스: 91 },
    { subject: 'AMR자율물류', 현대차: 92, 기아: 94, 오토에버: 85, 모비스: 89 },
    { subject: '전동화/배터리', 현대차: 96, 기아: 95, 오토에버: 70, 모비스: 99 },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Automotive Tech Trends & Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            자동차 산업 기술 트렌드 및 채용시장 분석
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            스마트팩토리, 제조DX, Software Defined Factory(SDF), 머신비전 및 배터리 생산기술 등 자동차 산업에서 요구하는 최신 기술 동향을 시각화합니다.
          </p>
        </div>

        {/* Selected Trend Quick Alert if navigated from process */}
        {selectedTrendFromContext && (
          <div className="p-3 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-between space-x-3 shrink-0">
            <div className="text-xs">
              <span className="font-semibold text-blue-300">선택된 연계 기술:</span>{' '}
              <span className="text-white font-bold">{selectedTrendFromContext.name}</span>
            </div>
            <button
              onClick={() => setActiveModalTrend(selectedTrendFromContext)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
            >
              심층 리포트
            </button>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="기술명, 역량 키워드 검색..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">전체 기술 분야 ({TECH_TRENDS_DATA.length})</option>
              <option value="스마트팩토리">스마트팩토리</option>
              <option value="제조DX">제조DX</option>
              <option value="Software Defined Factory (SDF)">SDF 플랫폼</option>
              <option value="품질/비전">머신비전 & 품질</option>
              <option value="자동화">자동화 물류 (AMR)</option>
              <option value="전동화/배터리">전동화 & 배터리</option>
              <option value="Physical AI">Physical AI</option>
            </select>
          </div>

          {/* Company Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">전체 기업 도입 현황</option>
              <option value="현대자동차">현대자동차</option>
              <option value="기아">기아</option>
              <option value="현대오토에버">현대오토에버</option>
              <option value="현대모비스">현대모비스</option>
              <option value="현대위아">현대위아</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center space-x-1">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>공식 보도자료 및 채용공고 빈도수 통계 (데모 데이터 포함)</span>
        </div>
      </div>

      {/* Visual Analytics Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Bar Chart: Tech Keyword Mention & Job Demand */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-100">
                기술 키워드별 언급 빈도 및 관련 채용공고 수
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">지수화 점수 (0-100)</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  angle={-25} 
                  textAnchor="end" 
                  interval={0} 
                />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="언급빈도" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="채용공고수" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Timeline Area Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100">
                연도별 핵심 기술 관심도 및 채용 수요 추이
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">+52% 상승세</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorSmart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSdf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="스마트팩토리" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSmart)" />
                <Area type="monotone" dataKey="Software" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSdf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Radar Chart: Enterprise Focus Comparison */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                현대차그룹 주요 계열사별 기술 투자 및 역량 집중도 레이더 분석
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">현대자동차 vs 현대오토에버 vs 현대모비스</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Radar name="현대자동차" dataKey="현대차" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name="현대오토에버" dataKey="오토에버" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
                <Radar name="현대모비스" dataKey="모비스" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Technology Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-slate-100">
              핵심 기술 상세 카드 및 필요 역량 ({filteredTrends.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">카드를 클릭하여 Gemini AI 기술 심층 분석을 열어보세요</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrends.map((trend) => (
            <div
              key={trend.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm transition hover:shadow-xl flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Card Top Badges */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {trend.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    채용 {trend.growthRate}
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition">
                    {trend.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {trend.description}
                  </p>
                </div>

                {/* Required Skills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    요구 전공 역량:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {trend.keySkills.slice(0, 4).map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Leading Companies */}
                <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1 truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{trend.companies.join(', ')}</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveModalTrend(trend)}
                  className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center space-x-1.5 group-hover:border-blue-500/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>AI 기술 분석</span>
                </button>

                <button
                  onClick={() => navigateToInterview(currentCompany.name, trend.name)}
                  className="py-2 px-3 text-xs font-semibold rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition flex items-center space-x-1"
                  title="이 기술 관련 면접 질문 생성"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>면접 질문</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources & Transparency Section */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="font-bold text-slate-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-400" />
          <span>데이터 출처 및 투명성 안내 (Citations)</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          본 플랫폼의 기술 트렌드 및 역량 분석은 현대자동차 HMG 저널 공식 테크 칼럼, 현대오토에버 테크블로그, 한국자동차연구원(KATECH) 미래차 산업 동향 보고서 및 2024~2026년 공개 채용공고의 직무 기술서(Job Description)를 기반으로 지수화되었습니다. 실시간 외부 웹 무단 크롤링을 수행하지 않으며 검증된 공학적 데이터셋을 제공합니다.
        </p>
      </div>

      {/* Deep Tech Detail Modal */}
      <TechDetailModal
        trend={activeModalTrend}
        onClose={() => setActiveModalTrend(null)}
      />
    </div>
  );
};
