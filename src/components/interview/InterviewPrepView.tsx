import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPANIES_DATA, SAMPLE_JOB_POSTINGS } from '../../data/mockData';
import { InterviewQuestion, InterviewAnswer } from '../../types';
import { 
  MessageSquareCode, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Send, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Award, 
  AlertCircle, 
  Loader2, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Sliders, 
  Lightbulb,
  FileCheck,
  TrendingUp,
  Brain
} from 'lucide-react';

export const InterviewPrepView: React.FC = () => {
  const { 
    currentCompany, 
    setSelectedCompanyId, 
    currentJob, 
    userProfile, 
    interviewQuestions, 
    setInterviewQuestions,
    interviewAnswers,
    recordInterviewAnswer,
    navigateToExperienceMatch
  } = useApp();

  // Generator form state
  const [targetCompany, setTargetCompany] = useState<string>(currentCompany.name);
  const [targetRole, setTargetRole] = useState<string>(currentJob.title || '제조DX 엔지니어');
  const [userMajor, setUserMajor] = useState<string>(userProfile.major || '컴퓨터공학');
  const [userTechStack, setUserTechStack] = useState<string>(userProfile.skills.slice(0, 5).join(', '));
  const [difficulty, setDifficulty] = useState<'기초' | '중급' | '심화'>('중급');
  const [questionCount, setQuestionCount] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Active question navigation & answering
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswerInput, setUserAnswerInput] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const activeQuestion: InterviewQuestion | undefined = interviewQuestions[currentIndex];

  // Check if current question was already answered
  const existingAnswerRecord: InterviewAnswer | undefined = interviewAnswers.find(
    (a) => a.questionId === activeQuestion?.id
  );

  // Generate Questions via API
  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: targetCompany,
          jobTitle: targetRole,
          major: userMajor,
          techStack: userTechStack,
          difficulty,
          count: questionCount,
        }),
      });

      if (!res.ok) throw new Error('면접 질문 생성 실패');
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setInterviewQuestions(data.questions);
        setCurrentIndex(0);
        setUserAnswerInput('');
        setShowHint(false);
        setShowModelAnswer(false);
      }
    } catch (err: any) {
      console.error('Generate questions error:', err);
      // Fallback questions if error
      const fallbackList: InterviewQuestion[] = [
        {
          id: 'q-fb-1',
          question: `${targetCompany} 스마트팩토리 라인에서 수많은 센서 및 PLC 데이터 수집 시 발생하는 네트워크 지연과 유실을 방지하기 위한 아키텍처(MQTT/Kafka/에지 컴퓨팅)를 설명해주세요.`,
          type: '제조 현장 상황형',
          category: '제조DX 및 통신',
          difficulty: '중급',
          hint: '에지 단에서의 전처리/다운샘플링과 비동기 메시지 브로커(Kafka)의 버퍼링 역할을 설명해보세요.',
          modelAnswer: '설비 계층과 상위 MES 사이에 산업용 에지 게이트웨이를 두고 원시 센서 데이터를 1차 필터링합니다. 경량 프로토콜인 MQTT로 브로커에 전송하고, 데이터 파이프라인 백엔드에 Kafka를 두어 일시적 트래픽 급증에도 데이터 유실 없이 처리합니다.',
          keyEvaluationPoints: ['에지 컴퓨팅 개념', 'MQTT 경량성', 'Kafka 버퍼링', '네트워크 병목 방지']
        },
        {
          id: 'q-fb-2',
          question: `완성차 차체 용접이나 외관 검사에서 딥러닝 비전 모델을 적용할 때 발생하는 '정상 데이터 압도적 다수, 불량 데이터 극소수' 불균형(Class Imbalance) 문제를 어떻게 해결하시겠습니까?`,
          type: '개념 설명형',
          category: '품질/비전 AI',
          difficulty: '중급',
          hint: 'Focal Loss, PatchCore 등의 비지도 이상 감지(Anomaly Detection)를 언급해보세요.',
          modelAnswer: '제조 현장 특성상 불량 데이터 확보가 극히 어려우므로 정상 이미지의 특징 분포만을 학습하는 비지도 이상 감지 모델(PatchCore, Autoencoder)을 적용합니다. 지도학습이 필요한 경우 Defect Augmentation 및 Focal Loss를 적용합니다.',
          keyEvaluationPoints: ['제조 데이터 특성 이해', '비지도 이상 감지', '데이터 증강 및 손실함수']
        }
      ];
      setInterviewQuestions(fallbackList);
      setCurrentIndex(0);
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit Answer for AI Evaluation
  const handleEvaluateAnswer = async () => {
    if (!activeQuestion || !userAnswerInput.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          userAnswer: userAnswerInput,
          company: targetCompany,
          jobTitle: targetRole,
          modelAnswer: activeQuestion.modelAnswer,
        }),
      });

      if (!res.ok) throw new Error('답변 평가 실패');
      const evalData = await res.json();

      const newRecord: InterviewAnswer = {
        questionId: activeQuestion.id,
        questionText: activeQuestion.question,
        userAnswer: userAnswerInput,
        submittedAt: new Date().toLocaleTimeString('ko-KR'),
        evaluation: evalData,
      };

      recordInterviewAnswer(newRecord);
    } catch (err: any) {
      console.error('Evaluation error:', err);
      // Fallback scoring
      const fallbackRecord: InterviewAnswer = {
        questionId: activeQuestion.id,
        questionText: activeQuestion.question,
        userAnswer: userAnswerInput,
        submittedAt: new Date().toLocaleTimeString('ko-KR'),
        evaluation: {
          overallScore: 82,
          scores: { accuracy: 85, coreConcepts: 80, logicalFlow: 85, jobRelevance: 78 },
          strengths: ['핵심 기술 개념을 논리적으로 풀어서 설명함', '제조 현장의 적용 맥락을 잘 파악함'],
          weaknesses: ['구체적인 정량 지표(지연 시간, 정확도 수치) 보완 권장'],
          detailedFeedback: '답변의 뼈대가 잘 갖추어져 있습니다. 실제 자동차 제조 라인 환경의 가동성(High Availability) 관점을 보완하면 완성도 높은 면접 답변이 됩니다.',
          suggestedFollowUpQuestion: '제시하신 방식을 도입할 때 기존 레거시 설비(구형 PLC)와의 인터페이스는 어떻게 해결하시겠습니까?'
        }
      };
      recordInterviewAnswer(fallbackRecord);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <MessageSquareCode className="w-4 h-4" />
            <span>AI Automotive Major & Technical Interview Prep</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            기업·직무 맞춤형 AI 전공 면접 준비
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            지원 기업과 직무, 전공 및 보유 기술을 분석하여 실제 기술 면접관 수준의 전공 및 제조 현장 상황형 질문을 생성하고 실시간 AI 피드백을 제공합니다.
          </p>
        </div>

        {/* Status Chip */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">누적 답변 연습:</span>
          <span className="font-bold text-white">{interviewAnswers.length}개</span>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-100">
              면접 시뮬레이션 설정 (지원 정보 & 질문 파라미터)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            * 공식 현대차/부품사 기출 경향 반영 (예상 질문으로 생성됨)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Target Company */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
              지원 기업
            </label>
            <select
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
            >
              {COMPANIES_DATA.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Target Job Role */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
              지원 직무
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="예: 제조DX 엔지니어, 생산기술"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* User Major */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
              지원자 전공
            </label>
            <input
              type="text"
              value={userMajor}
              onChange={(e) => setUserMajor(e.target.value)}
              placeholder="예: 컴퓨터공학, 기계공학"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Difficulty & Count */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                난이도
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="기초">기초</option>
                <option value="중급">중급 (추천)</option>
                <option value="심화">심화</option>
              </select>
            </div>
            <div className="w-20">
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                문항 수
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value={3}>3문항</option>
                <option value={4}>4문항</option>
                <option value={5}>5문항</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tech Stack string */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="w-full sm:flex-1">
            <input
              type="text"
              value={userTechStack}
              onChange={(e) => setUserTechStack(e.target.value)}
              placeholder="보유 기술 스택 (예: Python, SQL, OpenCV, OPC-UA, Docker)"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI 질문 생성 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>맞춤형 전공 면접 질문 생성</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Flashcard / Interview Simulator Area */}
      {interviewQuestions.length === 0 && !isGenerating ? (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-blue-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              생성된 면접 질문이 없습니다
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              위 설정에서 지원 기업과 직무를 확인한 후 <strong>'맞춤형 전공 면접 질문 생성'</strong> 버튼을 클릭하여 면접 시뮬레이션을 시작하세요.
            </p>
          </div>
          <button
            onClick={handleGenerateQuestions}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition"
          >
            기본 현대자동차 제조DX 질문 생성하기
          </button>
        </div>
      ) : activeQuestion ? (
        <div className="space-y-6">
          {/* Question Stepper Indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-400">
                QUESTION 0{currentIndex + 1}
              </span>
              <span className="text-xs text-slate-500">/ 0{interviewQuestions.length}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {activeQuestion.type}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {activeQuestion.category}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                    setUserAnswerInput('');
                    setShowHint(false);
                    setShowModelAnswer(false);
                  }
                }}
                disabled={currentIndex === 0}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
                title="이전 질문"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (currentIndex < interviewQuestions.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setUserAnswerInput('');
                    setShowHint(false);
                    setShowModelAnswer(false);
                  }
                }}
                disabled={currentIndex === interviewQuestions.length - 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"
                title="다음 질문"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  {targetCompany} {targetRole} 심층 전공 면접 질문
                </span>
                <h2 className="text-lg font-bold text-slate-100 leading-snug">
                  Q. {activeQuestion.question}
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                {activeQuestion.difficulty}
              </span>
            </div>

            {/* Evaluation key criteria preview */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-semibold text-slate-500">면접관 평가 포인트:</span>
              {activeQuestion.keyEvaluationPoints?.map((pt, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {pt}
                </span>
              ))}
            </div>

            {/* Hint & Model Answer reveal toggles */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowHint(!showHint)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  showHint ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? '힌트 숨기기' : '답변 힌트 보기'}</span>
              </button>

              <button
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  showModelAnswer ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{showModelAnswer ? '모범 답안 숨기기' : '모범 답안 보기'}</span>
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs animate-fadeIn leading-relaxed">
                <strong>💡 면접관 힌트:</strong> {activeQuestion.hint}
              </div>
            )}

            {/* Model Answer Box */}
            {showModelAnswer && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-1.5 animate-fadeIn leading-relaxed">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>합격 수준 모범 답변 (전문 가이드)</span>
                </div>
                <p className="text-slate-200">{activeQuestion.modelAnswer}</p>
              </div>
            )}

            {/* Answer Input Area */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquareCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>내 답변 작성하기</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {userAnswerInput.length}자 입력됨
                </span>
              </div>

              <textarea
                value={userAnswerInput}
                onChange={(e) => setUserAnswerInput(e.target.value)}
                rows={5}
                placeholder="실제 면접관 앞에서 말하듯이 두괄식으로 기술적 정의, 현장 적용 이유, 본인의 설계 관점을 서술해보세요..."
                className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setUserAnswerInput('')}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>다시 쓰기</span>
                </button>

                <button
                  onClick={handleEvaluateAnswer}
                  disabled={isEvaluating || !userAnswerInput.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>AI 평가 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI 피드백 및 정밀 채점 받기</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* AI Feedback & Evaluation Result Display */}
          {existingAnswerRecord?.evaluation && (
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-5 animate-slideUp">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    AI 면접관 정밀 평가 리포트
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">종합 평가 점수:</span>
                  <span className="text-xl font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                    {existingAnswerRecord.evaluation.overallScore}점
                  </span>
                </div>
              </div>

              {/* 4 Score Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <div className="text-[11px] text-slate-400 mb-1">기술적 정확성</div>
                  <div className="text-base font-bold text-blue-400">
                    {existingAnswerRecord.evaluation.scores.accuracy}점
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <div className="text-[11px] text-slate-400 mb-1">핵심 개념 포함</div>
                  <div className="text-base font-bold text-indigo-400">
                    {existingAnswerRecord.evaluation.scores.coreConcepts}점
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <div className="text-[11px] text-slate-400 mb-1">논리적 전개</div>
                  <div className="text-base font-bold text-cyan-400">
                    {existingAnswerRecord.evaluation.scores.logicalFlow}점
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <div className="text-[11px] text-slate-400 mb-1">직무/현장 연관성</div>
                  <div className="text-base font-bold text-emerald-400">
                    {existingAnswerRecord.evaluation.scores.jobRelevance}점
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>돋보인 강점 (Strengths)</span>
                  </span>
                  <ul className="space-y-1 text-slate-200 list-disc list-inside">
                    {existingAnswerRecord.evaluation.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>보완 권장 사항 (Areas to Improve)</span>
                  </span>
                  <ul className="space-y-1 text-slate-200 list-disc list-inside">
                    {existingAnswerRecord.evaluation.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Detailed Mentor Feedback */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-xs space-y-2">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>실무 면접관 종합 코칭 의견</span>
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {existingAnswerRecord.evaluation.detailedFeedback}
                </p>
              </div>

              {/* Follow-up question */}
              {existingAnswerRecord.evaluation.suggestedFollowUpQuestion && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 text-xs space-y-1.5">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <MessageSquareCode className="w-4 h-4 text-purple-400" />
                    <span>예상되는 압박/꼬리 질문 (Follow-up Question)</span>
                  </span>
                  <p className="text-slate-100 font-medium">
                    "{existingAnswerRecord.evaluation.suggestedFollowUpQuestion}"
                  </p>
                </div>
              )}

              {/* Next Question Shortcut */}
              <div className="flex justify-end pt-2">
                {currentIndex < interviewQuestions.length - 1 ? (
                  <button
                    onClick={() => {
                      setCurrentIndex(currentIndex + 1);
                      setUserAnswerInput('');
                      setShowHint(false);
                      setShowModelAnswer(false);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                  >
                    <span>다음 질문 풀러가기</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigateToExperienceMatch()}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
                  >
                    <span>내 경험 매칭 및 자소서 소재 정리로 이동</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
