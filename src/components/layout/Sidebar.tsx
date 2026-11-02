import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  GitGraph, 
  TrendingUp, 
  FileText, 
  MessageSquareCode, 
  FolderKanban, 
  Award, 
  ChevronRight,
  ShieldCheck,
  Building2,
  Briefcase
} from 'lucide-react';

interface SidebarItem {
  id: NavTab;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const MENU_ITEMS: SidebarItem[] = [
  {
    id: 'dashboard',
    label: '취업 대시보드',
    sublabel: '준비 현황 및 종합 지표',
    icon: LayoutDashboard,
  },
  {
    id: 'process',
    label: '기업 및 공정 분석',
    sublabel: '인터랙티브 제조공정 흐름도',
    icon: GitGraph,
    badge: 'React Flow'
  },
  {
    id: 'trends',
    label: '산업 기술 트렌드',
    sublabel: '제조DX 및 스마트팩토리 동향',
    icon: TrendingUp,
  },
  {
    id: 'jobs',
    label: '채용공고 분석',
    sublabel: 'AI 원문 파싱 및 요구역량 추출',
    icon: FileText,
  },
  {
    id: 'interview',
    label: 'AI 전공 면접 준비',
    sublabel: '기업·직무 맞춤 기출/예상 질문',
    icon: MessageSquareCode,
    badge: 'AI 코칭'
  },
  {
    id: 'experience',
    label: '나의 경험 관리',
    sublabel: 'STAR 역량 매칭 및 자소서 소재',
    icon: FolderKanban,
  },
  {
    id: 'report',
    label: '취업 준비 리포트',
    sublabel: '맞춤형 종합 전략 보고서',
    icon: Award,
    badge: 'PDF'
  },
];

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    currentCompany, 
    currentJob,
    userProfile 
  } = useApp();

  return (
    <aside className="w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      {/* Navigation Links */}
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Active Context Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-850 p-3 rounded-xl border border-slate-700/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-blue-400" />
              분석 대상 기업
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">
              {currentCompany.category}
            </span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl p-1 bg-slate-800 rounded-lg border border-slate-700">
              {currentCompany.logo}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-100 truncate">
                {currentCompany.name}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                공정 {currentCompany.nodes.length}개 단계 정의됨
              </p>
            </div>
          </div>

          {/* Target Job Mini Banner */}
          <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1 truncate max-w-[170px]">
              <Briefcase className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{currentJob?.title || '제조DX 엔지니어'}</span>
            </span>
            <button 
              onClick={() => setActiveTab('jobs')}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold underline shrink-0"
            >
              변경
            </button>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
            서비스 메뉴
          </div>
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-500/30 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs leading-none mb-1 truncate">{item.label}</div>
                    <div className={`text-[10px] leading-tight truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'
                    }`}>
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0 ml-1">
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom: Profile summary & Security status */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-slate-300 font-medium">실시간 세션 동기화</span>
          </div>
          <span className="text-[10px] text-slate-500">v2.4 LTS</span>
        </div>
        <p className="mt-2 text-[10px] text-slate-500 text-center">
          © 2026 AutoInsight AI. Automotive Career DX.
        </p>
      </div>
    </aside>
  );
};
