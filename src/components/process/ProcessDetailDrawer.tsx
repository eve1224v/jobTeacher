import React from 'react';
import { ManufacturingProcessNode, Company } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Wrench, 
  Cpu, 
  Users, 
  Gauge, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  ExternalLink,
  Target
} from 'lucide-react';

interface ProcessDetailDrawerProps {
  node: ManufacturingProcessNode | null;
  company: Company;
  onClose: () => void;
}

export const ProcessDetailDrawer: React.FC<ProcessDetailDrawerProps> = ({
  node,
  company,
  onClose,
}) => {
  const { 
    navigateToTechTrend, 
    navigateToInterview, 
    navigateToExperienceMatch 
  } = useApp();

  if (!node) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-700/80 shadow-2xl flex flex-col animate-slideLeft">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-850 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {company.name} · STEP {node.order}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              {node.category.toUpperCase()}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100">{node.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
        {/* Short Description */}
        <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 leading-relaxed text-xs">
          {node.shortDesc}
        </div>

        {/* Action Shortcuts (Flow Chain) */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>취업 연계 실행 액션</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                const keyword = node.appliedTech[0] || '스마트팩토리';
                navigateToTechTrend(keyword);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/40 text-left transition group"
            >
              <div className="flex items-center space-x-2.5">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs font-bold text-blue-200">
                    관련 산업 기술 트렌드 분석 보기
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {node.appliedTech[0] || '스마트제조'} 동향 및 요구역량 학습
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => {
                navigateToInterview(company.name, node.relatedJobs[0]);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition group"
            >
              <div className="flex items-center space-x-2.5">
                <Target className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {node.relatedJobs[0] || '생산기술'} 맞춤 전공 면접 질문 풀기
                  </div>
                  <div className="text-[11px] text-slate-400">
                    이 공정에서 면접관이 실제 묻는 질문 3~5선 생성
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>

        {/* 1. Main Tasks */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>공정 주요 작업 (Key Operation)</span>
          </div>
          <div className="space-y-1.5">
            {node.mainTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-start space-x-2 p-2 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Used Equipments */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>사용 설비 및 기기 (Equipments)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {node.equipment.map((eq, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-cyan-500/20"
              >
                {eq}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Applied Technologies */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>적용 기술 및 솔루션 (Applied Tech)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {node.appliedTech.map((tech, i) => (
              <button
                key={i}
                onClick={() => navigateToTechTrend(tech)}
                className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1 transition group"
                title="기술 트렌드로 이동하여 분석 보기"
              >
                <span>{tech}</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        {/* 4. Related Job Roles */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>관련 직무 및 부서 (Target Roles)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {node.relatedJobs.map((job, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
              >
                {job}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Quality Metrics */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-rose-400" />
            <span>주요 품질 관리 지표 (CTQ / KPIs)</span>
          </div>
          <div className="space-y-2">
            {node.qualityMetrics.map((qm, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-200">{qm.name}</div>
                  <div className="text-[11px] text-slate-400">{qm.description}</div>
                </div>
                <div className="text-xs font-bold text-rose-400 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20">
                  {qm.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer Footer Disclaimer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-[10px] text-slate-500 text-center">
        공식 공개 기술자료 및 일반화된 제조공정 예시입니다.
      </div>
    </div>
  );
};
