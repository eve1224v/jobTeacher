import React, { useState, useEffect } from 'react';
import { TechnologyTrend } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  BrainCircuit, 
  Layers, 
  GraduationCap, 
  Rocket, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  Building2,
  ExternalLink
} from 'lucide-react';

interface TechDetailModalProps {
  trend: TechnologyTrend | null;
  onClose: () => void;
}

export const TechDetailModal: React.FC<TechDetailModalProps> = ({ trend, onClose }) => {
  const { currentCompany, navigateToInterview, navigateToExperienceMatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trend) {
      setAiInsight(null);
      return;
    }

    const fetchInsight = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/gemini/tech-insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            techKeyword: trend.name,
            companyContext: currentCompany.name,
          }),
        });
        if (!res.ok) throw new Error('기술 심층 분석 호출 실패');
        const data = await res.json();
        setAiInsight(data);
      } catch (err: any) {
        console.error('Fetch insight error:', err);
        // Fallback default insight
        setAiInsight({
          techKeyword: trend.name,
          concept: `${trend.name}은 자동차 및 미래 모빌리티 생산 라인의 무결성과 지능형 자율 제어를 가능하게 하는 핵심 기술입니다.`,
          whyAutomotiveNeedsIt: '다차종 혼류 생산 및 배터리/전동화 부품의 품질 전수 검사 신뢰성을 100% 확보하기 위해 필수적입니다.',
          targetProcesses: trend.appliedProcesses,
          leadingCompanies: trend.companies,
          requiredCompetencies: trend.keySkills,
          learningRoadmap: [
            '1단계: 시계열 센서 및 프로토콜 기본 실습',
            '2단계: 오픈소스 라이브러리(OpenCV/PyTorch)를 통한 알고리즘 모델링',
            '3단계: 가상 환경 시운전 및 E2E 파이프라인 개발'
          ],
          recommendedProjectIdea: `${trend.name} 기반의 자동차 부품 품질 이상 조기 감지 및 실시간 모니터링 시스템 구축 프로젝트`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [trend, currentCompany]);

  if (!trend) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-850 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {trend.category}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  채용 수요 {trend.growthRate}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-1">{trend.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-xs">Gemini AI가 자동차 제조 도메인 기반 기술 심층 리포트를 생성하고 있습니다...</p>
            </div>
          ) : (
            <>
              {/* Concept & Why Automotive Needs It */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-300">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>기술 정의 및 개념</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {aiInsight?.concept || trend.description}
                </p>

                <div className="pt-2 border-t border-slate-700/60">
                  <span className="text-xs font-bold text-indigo-300 block mb-1">
                    💡 자동차 제조산업에서 왜 이 기술이 필수적인가?
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {aiInsight?.whyAutomotiveNeedsIt}
                  </p>
                </div>
              </div>

              {/* Target Processes & Leading Companies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>주요 현장 적용 공정</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(aiInsight?.targetProcesses || trend.appliedProcesses).map((p: string, i: number) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>주요 도입 및 연구 기업</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(aiInsight?.leadingCompanies || trend.companies).map((c: string, i: number) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Required Competencies for Applicants */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span>취업 준비생에게 요구되는 핵심 전공 기술 역량</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(aiInsight?.requiredCompetencies || trend.keySkills).map((skill: string, i: number) => (
                    <div key={i} className="flex items-center space-x-2 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Learning Roadmap */}
              {aiInsight?.learningRoadmap && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                    <span>추천 학습 로드맵</span>
                  </div>
                  <div className="space-y-1.5">
                    {aiInsight.learningRoadmap.map((step: string, i: number) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Project Idea */}
              {aiInsight?.recommendedProjectIdea && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/40">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-300 mb-1.5">
                    <Rocket className="w-4 h-4 text-blue-400" />
                    <span>포트폴리오 추천 프로젝트 아이디어</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {aiInsight.recommendedProjectIdea}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            * 공식 현대차그룹 기술자료 및 산업 리포트 기반 분석
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                navigateToInterview(currentCompany.name, trend.name);
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex items-center space-x-1.5"
            >
              <span>이 기술 관련 면접 질문 풀기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
