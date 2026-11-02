import React, { useState } from 'react';
import { Company } from '../../types';
import { COMPANIES_DATA } from '../../data/mockData';
import { X, ArrowRightLeft, Check, Layers, Cpu, Users } from 'lucide-react';

interface CompanyCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCompanyAId: string;
}

export const CompanyCompareModal: React.FC<CompanyCompareModalProps> = ({
  isOpen,
  onClose,
  defaultCompanyAId,
}) => {
  const [compAId, setCompAId] = useState(defaultCompanyAId);
  const [compBId, setCompBId] = useState(
    defaultCompanyAId === 'hyundai-autoever' ? 'hyundai-motor' : 'hyundai-autoever'
  );

  if (!isOpen) return null;

  const compA = COMPANIES_DATA.find((c) => c.id === compAId) || COMPANIES_DATA[0];
  const compB = COMPANIES_DATA.find((c) => c.id === compBId) || COMPANIES_DATA[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                기업별 제조공정 및 비즈니스 구조 심층 비교
              </h3>
              <p className="text-xs text-slate-400">
                완성차 vs 부품/전동화 vs 제조IT 솔루션의 공정 프로세스와 요구 기술 차이를 분석합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Selectors */}
        <div className="grid grid-cols-2 gap-4 p-4 border-b border-slate-800 bg-slate-900/60">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
              기준 기업 A
            </label>
            <select
              value={compAId}
              onChange={(e) => setCompAId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {COMPANIES_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
              비교 기업 B
            </label>
            <select
              value={compBId}
              onChange={(e) => setCompBId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {COMPANIES_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Company A Column */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{compA.logo}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{compA.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">
                    {compA.category}
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mt-2">{compA.description}</p>
            </div>

            {/* Core Process List */}
            <div className="space-y-2">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>핵심 공정 흐름 ({compA.nodes.length}단계)</span>
              </div>
              <div className="space-y-2">
                {compA.nodes.map((n, i) => (
                  <div key={n.id} className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200">{n.name}</span>
                      <span className="text-[10px] text-slate-500">STEP 0{i + 1}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{n.shortDesc}</p>
                    <div className="flex flex-wrap gap-1">
                      {n.appliedTech.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company B Column */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{compB.logo}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{compB.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold">
                    {compB.category}
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed mt-2">{compB.description}</p>
            </div>

            {/* Core Process List */}
            <div className="space-y-2">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>핵심 공정 흐름 ({compB.nodes.length}단계)</span>
              </div>
              <div className="space-y-2">
                {compB.nodes.map((n, i) => (
                  <div key={n.id} className="p-3 rounded-lg bg-slate-800/40 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-200">{n.name}</span>
                      <span className="text-[10px] text-slate-500">STEP 0{i + 1}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{n.shortDesc}</p>
                    <div className="flex flex-wrap gap-1">
                      {n.appliedTech.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center text-xs text-slate-400">
          <span>* 완성차 기업과 솔루션 기업은 생산 물리 라인과 소프트웨어 아키텍처 관점에서 상이하게 설계됩니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
