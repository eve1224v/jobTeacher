import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CareerReport } from '../../types';
import { 
  Award, 
  Sparkles, 
  Printer, 
  Copy, 
  Check, 
  Building2, 
  Layers, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Rocket, 
  MessageSquareCode, 
  Calendar,
  Loader2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const CareerReportView: React.FC = () => {
  const { 
    currentCompany, 
    currentJob, 
    userProfile, 
    interviewAnswers,
    careerReport, 
    setCareerReport 
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate Report
  const handleGenerateReport = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const newReport: CareerReport = {
        id: `report-${Date.now()}`,
        createdAt: new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        companyName: currentCompany.name,
        targetJob: currentJob.title,
        companyOverview: {
          business: currentCompany.keyBusiness.join(', '),
          marketPosition: '글로벌 Top 3 완성차 및 미래 모빌리티 스마트 제조 플랫폼 선도 기업',
          manufacturingStrategy: `${currentCompany.name}는 Software Defined Factory(SDF) 및 유연 혼류 생산 시스템 구축을 통해 다품종 전기차 및 차세대 모빌리티 양산 수율을 극대화하고 있습니다.`
        },
        processAndTech: {
          coreProcesses: currentCompany.nodes.map((n) => n.name),
          keyTechs: currentCompany.keyTechnologies,
          relevanceToJob: `${currentJob.title} 직무는 ${currentCompany.nodes[1]?.name || '차체 공정'} 및 ${currentCompany.nodes[3]?.name || '의장 공정'}에서 발생하는 실시간 센서 및 비전 영상 데이터를 수집하여 라인 비가동 시간(Downtime)을 제로화하는 데 핵심 기여를 합니다.`
        },
        industryTrends: {
          topTrends: [
            'Software Defined Factory (SDF) 및 클라우드-에지 하이브리드 아키텍처',
            'AI 비전 딥러닝 기반 차체/도장/배터리 인라인 품질 전수 검사',
            '설비 진동·전류 이상 탐지 및 예지보전 (PdM)',
            '군집 제어 무인 자율이송로봇 (AMR/AGV) 스마트 물류'
          ],
          strategicInsight: '단순 조립 자동화를 넘어 설비가 스스로 이상을 감지하고 파라미터를 보정하는 자율 제조(Physical AI)로 패러다임이 급변하고 있으며, 소프트웨어와 공학 도메인을 겸비한 인재에 대한 수요가 급증하고 있습니다.'
        },
        jobRequirementsSummary: {
          mustHave: currentJob.requiredQualifications,
          niceToHave: currentJob.preferredQualifications
        },
        competencyAnalysis: {
          matchPercentage: 88,
          strengths: [
            '산업용 센서 및 시계열 데이터 파이프라인 개발 및 비지도 이상탐지 모델링 역량',
            '컴퓨터공학과 제어공학을 융합한 제조 도메인 이해 및 문제 해결 행동력',
            'Python, SQL, PyTorch 기반 실시간 데이터 처리 경험'
          ],
          weaknesses: [
            '산업용 통신 표준(OPC-UA, Modbus, CAN) 하드웨어 직접 인터페이스 실습 보완 권장',
            '공장 가동 환경에서의 네트워크 병목 방지 및 대용량 스트리밍 큐(Kafka) 운영 경험 보강'
          ]
        },
        recommendedProjects: [
          `${userProfile.projects[0]?.title || '스마트팩토리 센서 기반 이상 감지 시스템'}: STAR 구조(진동 센서 수집 → 노이즈 제거 및 Autoencoder 적용 → F1-score 0.94 달성)를 자소서 핵심 소재로 강조.`,
          `${userProfile.projects[1]?.title || '컴퓨터비전 차체 표면 결함 검출'}: 불량 데이터 부족(Class Imbalance) 문제를 PatchCore 비지도 학습으로 극복한 공학적 판단력 피력.`
        ],
        expectedInterviewQuestions: [
          {
            question: `${currentCompany.name} 공장에서 고주파 센서 데이터를 수집할 때 발생하는 네트워크 트래픽 병목을 방지하기 위한 에지 게이트웨이 설계 방안을 설명해주세요.`,
            type: '제조 현장 상황형',
            coreKeyword: '에지 컴퓨팅, MQTT 경량화, Kafka 버퍼링'
          },
          {
            question: `제조 현장의 심각한 데이터 불균형(정상 데이터 99% vs 불량 1%) 상황에서 비전 품질 모델을 어떻게 안정적으로 서빙하시겠습니까?`,
            type: '개념 및 알고리즘형',
            coreKeyword: '비지도 이상치 탐지 (PatchCore/Autoencoder), Focal Loss'
          },
          {
            question: `생산 라인 MES와 상위 ERP 연동 장애 발생 시 생산 라인이 중단되지 않도록 하는 로컬 내결함성(Fault Tolerance) 방안은?`,
            type: '아키텍처형',
            coreKeyword: '오프라인 우선 캐싱, 사가 패턴, 이벤트 드리븐'
          }
        ],
        weeklyRoadmap: [
          {
            week: '1주차: 기업 도메인 및 공정 숙지',
            goal: `${currentCompany.name} 5대 공정(프레스·차체·도장·의장·검사) 및 ${currentJob.title} 실무 연계 이해`,
            actions: ['공정도 노드별 사용 설비 및 품질 지표(CTQ) 암기', 'HMG 저널 최신 SDF 스마트팩토리 기사 정독']
          },
          {
            week: '2주차: STAR 자소서 완성 및 포트폴리오 정비',
            goal: '공고 요구역량과 프로젝트 경험을 1:1 매핑한 맞춤형 자기소개서 완성',
            actions: ['STAR 프레임워크 기반 3대 프로젝트 불렛포인트 작성', '정량적 수치(F1 0.94, 지연 50ms) 객관적 검증']
          },
          {
            week: '3주차: 전공 및 현장 면접 질문 집중 시뮬레이션',
            goal: '예상 질문 15선 완벽 대비 및 꼬리 질문 방어',
            actions: ['AI 모의 면접에서 85점 이상 달성할 때까지 반복 연습', '네트워크/센서 노이즈 예외 처리 논리 정립']
          },
          {
            week: '4주차: 최종 모의 면접 및 취약점 최종 점검',
            goal: '실전 인성 및 전공 다대일 모의 면접 완벽 합격 수준 도달',
            actions: ['기업 최근 기술 투자 이슈(PBV 전용 공장, E-GMP 전동화) 최종 스크랩', '자신감 있는 두괄식 스피치 점검']
          }
        ]
      };

      setCareerReport(newReport);
      setIsGenerating(false);
    }, 1200);
  };

  const activeReport = careerReport;

  const handleCopyText = () => {
    if (!activeReport) return;
    const text = `=====================================================
[AutoInsight AI] 자동차 산업 맞춤형 AI 취업 준비 리포트
발행일: ${activeReport.createdAt}
지원 기업: ${activeReport.companyName} | 목표 직무: ${activeReport.targetJob}
지원자: ${userProfile.university} ${userProfile.major} ${userProfile.name}
=====================================================

1. 기업 개요 및 전략 분석
- 주요 사업: ${activeReport.companyOverview.business}
- 시장 지위: ${activeReport.companyOverview.marketPosition}
- 제조 전략: ${activeReport.companyOverview.manufacturingStrategy}

2. 제조공정 및 적용 기술
- 핵심 공정: ${activeReport.processAndTech.coreProcesses.join(' → ')}
- 직무 연관성: ${activeReport.processAndTech.relevanceToJob}

3. 주요 산업 기술 트렌드
${activeReport.industryTrends.topTrends.map((t) => `• ${t}`).join('\n')}
- 전략 인사이트: ${activeReport.industryTrends.strategicInsight}

4. 지원자 역량 진단 (일치율: ${activeReport.competencyAnalysis.matchPercentage}%)
[강점]
${activeReport.competencyAnalysis.strengths.map((s) => `• ${s}`).join('\n')}
[보완점]
${activeReport.competencyAnalysis.weaknesses.map((w) => `• ${w}`).join('\n')}

5. 추천 자기소개서 프로젝트 소재 (STAR)
${activeReport.recommendedProjects.map((p) => `• ${p}`).join('\n')}

6. 예상 심층 면접 질문 3선
${activeReport.expectedInterviewQuestions.map((q, i) => `${i + 1}. [${q.type}] ${q.question} (핵심키워드: ${q.coreKeyword})`).join('\n')}

7. 주차별 취업 전략 로드맵
${activeReport.weeklyRoadmap.map((r) => `[${r.week}] ${r.goal}\n${r.actions.map((a) => `  - ${a}`).join('\n')}`).join('\n')}
=====================================================`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto overflow-y-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>AI Automotive Career Strategy Synthesis</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            취업 준비 종합 AI 전략 리포트
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            탐색한 제조공정, 산업 기술 트렌드, 채용공고 요구사항, 면접 결과 및 나의 경험 매칭을 종합하여 9대 전략 섹션으로 구성된 취업 준비 리포트를 발급합니다.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI 리포트 생성 중...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{activeReport ? '리포트 다시 생성' : '종합 리포트 생성'}</span>
              </>
            )}
          </button>

          {activeReport && (
            <>
              <button
                onClick={handleCopyText}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '복사됨' : '복사'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>인쇄/PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!activeReport && !isGenerating ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              취업 준비 리포트가 아직 생성되지 않았습니다
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              현재 선택된 기업(<strong>{currentCompany.name}</strong>)과 직무(<strong>{currentJob.title}</strong>), 그리고 사용자 프로필 데이터를 통합하여 1클릭으로 정밀 리포트를 만듭니다.
            </p>
          </div>
          <button
            onClick={handleGenerateReport}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            지금 종합 리포트 생성하기
          </button>
        </div>
      ) : activeReport ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
          {/* Report Cover Header */}
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                <span>AutoInsight AI Career Diagnostic Report</span>
                <span>·</span>
                <span>발행일: {activeReport.createdAt}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                [{activeReport.companyName}] {activeReport.targetJob} 취업 전략 리포트
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                지원자: {userProfile.university} {userProfile.major} {userProfile.name} | 학점/스펙: {userProfile.academicYear}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-center shrink-0">
              <div className="text-[10px] text-slate-400 uppercase font-bold">역량 부합도</div>
              <div className="text-2xl font-black text-emerald-400">
                {activeReport.competencyAnalysis.matchPercentage}%
              </div>
            </div>
          </div>

          {/* Section 1: Company Overview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
              기업 개요 및 모빌리티 제조 전략
            </h3>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p><strong>• 주요 사업 영역:</strong> {activeReport.companyOverview.business}</p>
              <p><strong>• 시장 경쟁력:</strong> {activeReport.companyOverview.marketPosition}</p>
              <p><strong>• 제조DX 전략:</strong> {activeReport.companyOverview.manufacturingStrategy}</p>
            </div>
          </div>

          {/* Section 2: Manufacturing Process & Tech */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">2</span>
              주요 제조공정 및 지원 직무와의 연관성
            </h3>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p><strong>• 핵심 공정 라인:</strong> {activeReport.processAndTech.coreProcesses.join(' ➔ ')}</p>
              <p><strong>• 지원 직무 기여점:</strong> {activeReport.processAndTech.relevanceToJob}</p>
            </div>
          </div>

          {/* Section 3: Industry Trends */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">3</span>
              자동차 산업 핵심 기술 트렌드 및 주안점
            </h3>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                {activeReport.industryTrends.topTrends.map((trend, i) => (
                  <li key={i}>{trend}</li>
                ))}
              </ul>
              <p className="pt-1 border-t border-slate-800 text-slate-400">
                <strong>시사점:</strong> {activeReport.industryTrends.strategicInsight}
              </p>
            </div>
          </div>

          {/* Section 4 & 5: Job Requirements & Competency Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">4</span>
                채용공고 요구 역량 프로파일
              </h3>
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-amber-300 block">[필수 지원 자격]</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  {activeReport.jobRequirementsSummary.mustHave.slice(0, 3).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
                <span className="font-bold text-amber-300 block pt-1">[우대 사항]</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                  {activeReport.jobRequirementsSummary.niceToHave.slice(0, 3).map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">5</span>
                나의 보유 역량 및 강점/보완점 진단
              </h3>
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-emerald-300 block">[나의 핵심 강점]</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  {activeReport.competencyAnalysis.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
                <span className="font-bold text-rose-300 block pt-1">[보완 권장 역량]</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                  {activeReport.competencyAnalysis.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 6: Recommended Project Experiences */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">6</span>
              자기소개서 맞춤 추천 프로젝트 경험 소재 (STAR)
            </h3>
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 space-y-2">
              {activeReport.recommendedProjects.map((proj, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                  {proj}
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Expected Interview Questions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">7</span>
              예상 전공 및 실무 면접 질문 3선
            </h3>
            <div className="space-y-2">
              {activeReport.expectedInterviewQuestions.map((q, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Q{i + 1}. {q.question}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {q.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    💡 핵심 평가 키워드: <span className="text-rose-300">{q.coreKeyword}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Execution Roadmap */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">8</span>
              주차별 취업 전략 실행 로드맵 (4-Week Action Plan)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {activeReport.weeklyRoadmap.map((r, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-300 text-xs">{r.week}</div>
                  <div className="text-[11px] text-slate-200 font-semibold">{r.goal}</div>
                  <ul className="text-[10px] text-slate-400 space-y-1 list-disc list-inside">
                    {r.actions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="border-t border-slate-800 pt-4 text-center text-[11px] text-slate-500">
            AutoInsight AI Automotive Recruitment Consulting System · 데모 및 공식 공개 자료 기반으로 생성되었습니다.
          </div>
        </div>
      ) : null}
    </div>
  );
};
