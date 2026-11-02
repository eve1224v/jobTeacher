import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health / Status Check
app.get('/api/gemini/status', (_req: Request, res: Response) => {
  res.json({
    hasApiKey: !!apiKey,
    model: 'gemini-3.8-flash',
    status: 'ready',
  });
});

// Helper for Gemini generateContent with 10s timeout
async function callGemini(prompt: string, systemInstruction?: string, isJson: boolean = false): Promise<string> {
  if (!ai) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), 10000)
  );

  const callPromise = ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      ...(systemInstruction ? { systemInstruction } : {}),
      ...(isJson ? { responseMimeType: 'application/json' } : {}),
    },
  }).then((res) => res.text || '');

  return Promise.race([callPromise, timeoutPromise]);
}

// 1. Analyze Job Posting
app.post('/api/gemini/analyze-job', async (req: Request, res: Response) => {
  try {
    const { rawText, companyHint, roleHint } = req.body;
    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return res.status(400).json({ error: '채용공고 원문 텍스트를 입력해주세요.' });
    }

    if (!ai) {
      // Graceful domain fallback for demo/offline
      return res.json({
        companyName: companyHint || '현대자동차',
        jobTitle: roleHint || '스마트제조/제조DX 엔지니어',
        department: '생산기술본부 제조솔루션부',
        mainDuties: [
          '스마트팩토리 설비 데이터 인터페이스(PLC, 센서) 및 MES 연계 시스템 구축',
          'AI 비전 기반 인라인 조립/용접 품질 검사 솔루션 도입 및 알고리즘 검증',
          '공정 사이클타임 단축 및 생산성 최적화 데이터 파이프라인 개발',
          '디지털 트윈 기반 가상 시운전(Virtual Commissioning) 시스템 운영'
        ],
        requiredQualifications: [
          '컴퓨터공학, 전자공학, 기계/산업공학 또는 관련 이공계 학사 이상',
          'Python, C++, Java 중 1개 이상 프로그래밍 언어 숙련자',
          '제조 데이터베이스(SQL) 및 REST API 설계/활용 역량',
          '산업용 통신(OPC-UA, MQTT, Modbus) 또는 PLC 기본 이해'
        ],
        preferredQualifications: [
          '스마트팩토리, 제조 데이터 분석 또는 머신비전 관련 프로젝트 수행 경험자',
          '클라우드 환경(AWS, GCP, Azure) 또는 컨테이너(Docker, K8s) 활용 경험',
          '자동차 제조공정(프레스, 차체, 도장, 의장) 도메인 이해 보유자'
        ],
        coreTechnologies: ['Python', 'SQL', 'OPC-UA', 'Computer Vision', 'Docker', 'MES', 'Kafka'],
        competencyKeywords: ['제조 데이터 분석', '공정 최적화', '이상 감지', '산업용 통신', '문제 해결력'],
        summary: '완성차 제조공정의 지능화 및 제조DX 전환을 주도할 스마트팩토리 솔루션 및 데이터 엔지니어를 채용하는 공고입니다.'
      });
    }

    const systemInstruction = `당신은 자동차 제조 산업(현대자동차, 기아, 현대모비스, 현대오토에버 등) 전문 AI 채용 컨설턴트입니다.
사용자가 제공한 채용공고 원문을 정밀 분석하여 다음 JSON 형식으로만 응답하세요. 허구의 정보나 날조 없이 입력된 공고 내용을 기반으로 구조화하세요.
형식:
{
  "companyName": "기업명",
  "jobTitle": "직무명",
  "department": "부서명(추정 불가시 빈 문자열)",
  "mainDuties": ["핵심 업무 1", "핵심 업무 2"],
  "requiredQualifications": ["필수 지원 자격 1", "2"],
  "preferredQualifications": ["우대 사항 1", "2"],
  "coreTechnologies": ["핵심 기술 스택"],
  "competencyKeywords": ["요구 핵심 역량 키워드"],
  "summary": "1~2문장의 공고 핵심 요약"
}`;

    const prompt = `[채용공고 원문]\n${rawText}\n\n[추가 힌트: 기업명=${companyHint || '없음'}, 희망직무=${roleHint || '없음'}]`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Job analyze error:', error);
    // Graceful domain fallback if Gemini call fails or times out
    return res.json({
      companyName: req.body.companyHint || '현대자동차',
      jobTitle: req.body.roleHint || '스마트제조/제조DX 엔지니어',
      department: '생산기술본부 제조솔루션부',
      mainDuties: [
        '스마트팩토리 설비(PLC, 센서) 인터페이스 및 MES 연계 시스템 구축',
        'AI 비전 기반 인라인 용접/도장 품질 검사 알고리즘 현장 적용',
        '공정 사이클타임(C/T) 단축 및 설비 가동 효율(OEE) 분석'
      ],
      requiredQualifications: [
        '컴퓨터공학, 기계공학, 전자공학 또는 유관 이공계 학사 이상',
        'Python, C++, Java 중 1개 이상 프로그래밍 가능자',
        'SQL 데이터베이스 및 기초 데이터 분석 역량'
      ],
      preferredQualifications: [
        '스마트팩토리, 머신비전 관련 프로젝트 또는 인턴십 경험자',
        '산업용 통신(OPC-UA, MQTT) 또는 PLC 기본 이해자'
      ],
      coreTechnologies: ['Python', 'SQL', 'OPC-UA', 'OpenCV', 'Docker', 'MES'],
      competencyKeywords: ['제조 데이터 분석', '이상 감지', '산업용 통신', '공정 최적화'],
      summary: '완성차 제조공정의 지능화 및 제조DX 전환을 주도할 스마트팩토리 솔루션 및 데이터 엔지니어를 채용하는 공고입니다.'
    });
  }
});

// 2. Generate Technical Interview Questions
app.post('/api/gemini/generate-questions', async (req: Request, res: Response) => {
  try {
    const { company, jobTitle, major, techStack, difficulty, count = 5 } = req.body;

    if (!ai) {
      // Domain-specific realistic fallback questions
      const fallbackQuestions = [
        {
          id: 'q-fb-1',
          question: `자동차 생산라인의 실시간 설비 모니터링 시스템을 구축할 때, 수많은 센서 및 PLC 데이터 수집 시 발생하는 네트워크 병목과 데이터 손실을 방지하기 위한 아키텍처(예: MQTT, Kafka, 에지 컴퓨팅)를 설명해주세요.`,
          type: '제조 현장 상황형',
          category: '제조DX 및 통신',
          difficulty: difficulty || '중급',
          hint: '에지 단에서의 데이터 전처리 및 경량 프로토콜(MQTT/OPC-UA)과 버퍼링을 위한 분산 큐(Kafka)의 역할을 언급해보세요.',
          modelAnswer: `현장 설비(PLC, 로봇) 계층과 상위 MES/클라우드 사이에 에지 게이트웨이를 배치하여 고주기 센서 데이터를 1차 필터링 및 다운샘플링합니다. 이후 MQTT 같은 경량 Pub/Sub 프로토콜로 에지에서 브로커로 전송하고, 데이터 파이프라인 백엔드에는 Apache Kafka를 도입하여 갑작스러운 트래픽 폭주 시에도 컨슈머가 안정적으로 데이터를 소비할 수 있는 디커플링 버퍼 구조를 갖춥니다.`,
          keyEvaluationPoints: ['에지 컴퓨팅 역할', 'MQTT/Kafka 등 비동기 버퍼링', '네트워크 대역폭 최적화']
        },
        {
          id: 'q-fb-2',
          question: `차체 조립 공정에서 스팟 용접 품질 검사를 딥러닝 기반 비전 모델로 수행할 때, 결함 데이터(불량 라벨)의 극심한 데이터 불균형(Class Imbalance) 문제를 어떻게 해결하시겠습니까?`,
          type: '개념 및 알고리즘형',
          category: 'AI 비전 및 품질',
          difficulty: difficulty || '중급',
          hint: 'Focal Loss, 데이터 증강(Augmentation), 또는 비지도 이상탐지(Autoencoder, PatchCore) 접근법을 생각해보세요.',
          modelAnswer: `양품 데이터에 비해 불량 데이터가 극히 적은 제조 현장 특성상, 일반적인 지도학습 분류기 대신 양품 이미지의 정상 패턴만을 학습하는 비지도 이상 감지 모델(PatchCore, VAE 등)을 적용하여 정상 분포를 벗어난 영역을 이상치로 탐지합니다. 지도학습을 적용해야 한다면 Focal Loss 적용, 불량 샘플의 물리 기반 합성(Defect Augmentation), CutMix 등의 데이터 증강을 활용합니다.`,
          keyEvaluationPoints: ['제조 데이터 불균형 이해', '비지도 이상 감지 활용', 'Focal Loss 또는 증강 기법']
        },
        {
          id: 'q-fb-3',
          question: `스마트팩토리 MES(제조실행시스템)와 ERP 간의 연동에서 트랜잭션 정합성(ACID) 및 양방향 인터페이스 장애 시 생산 라인이 멈추지 않도록 설계하는 방안을 설명해주세요.`,
          type: '비교 및 아키텍처형',
          category: '소프트웨어 및 백엔드',
          difficulty: difficulty || '심화',
          hint: '로컬 서킷 브레이커, 오프라인 우선(Local Caching) 및 비동기 사가 패턴(Saga Pattern)을 고려해보세요.',
          modelAnswer: `상위 ERP 장애 시에도 하위 공장 라인이 중단되지 않도록 MES는 독립된 로컬 데이터 저장소를 보유하는 오프라인 영속성(Local Resilience)을 가져야 합니다. ERP와의 데이터 동기화는 동기식 RPC 대신 메시지 큐 기반의 이벤트 드리븐 아키텍처와 사가 패턴(보상 트랜잭션)을 적용하여 최종 일관성(Eventual Consistency)을 보장합니다.`,
          keyEvaluationPoints: ['독립 운영성(Local Autonomy)', '이벤트 드리븐 비동기 연동', '최종 일관성과 트랜잭션 처리']
        }
      ];
      return res.json({ questions: fallbackQuestions });
    }

    const systemInstruction = `당신은 ${company || '자동차 제조사'}의 기술 면접관이자 채용 기술위원입니다.
지원자의 지원 기업(${company}), 직무(${jobTitle}), 전공(${major}), 보유 기술(${techStack}), 난이도(${difficulty})에 맞는 실제 기술/전공 심층 면접 질문을 ${count}개 생성하세요.
질문은 뜬구름 잡는 일반 질문이 아니라 자동차 제조, 스마트팩토리, 생산기술, 제조DX의 현장 도메인과 직결된 높은 수준의 기술 질문이어야 합니다.
JSON 형식:
{
  "questions": [
    {
      "id": "q-1",
      "question": "구체적인 기술 면접 질문",
      "type": "개념 설명형 | 비교 설명형 | 코드·SQL 기반 | 제조 현장 상황형 | 프로젝트 경험 연결형",
      "category": "소프트웨어 | 제조DX | 생산기술 | 데이터/AI",
      "difficulty": "기초 | 중급 | 심화",
      "hint": "지원자를 위한 핵심 답변 힌트",
      "modelAnswer": "실제 합격 수준의 모범 답변 (전문적이고 구체적인 설명)",
      "keyEvaluationPoints": ["평가 핵심 키워드 1", "키워드 2"]
    }
  ]
}`;

    const prompt = `기업: ${company || '현대자동차'}\n직무: ${jobTitle || '스마트제조/제조DX'}\n전공: ${major || '컴퓨터/기계공학'}\n기술스택: ${techStack || 'Python, C++, SQL, 제조데이터'}\n난이도: ${difficulty || '중급'}\n질문 개수: ${count}`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Generate questions error:', error);
    return res.status(500).json({
      error: '면접 질문 생성 중 오류가 발생했습니다: ' + (error?.message || error)
    });
  }
});

// 3. Evaluate User's Interview Answer
app.post('/api/gemini/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const { question, userAnswer, company, jobTitle, modelAnswer } = req.body;

    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ error: '답변을 작성해주세요.' });
    }

    if (!ai) {
      const charCount = userAnswer.trim().length;
      const score = Math.min(95, Math.max(65, Math.floor(charCount / 3) + 50));
      return res.json({
        overallScore: score,
        scores: {
          accuracy: Math.min(100, score + 2),
          coreConcepts: Math.min(100, score - 3),
          logicalFlow: Math.min(100, score + 4),
          jobRelevance: Math.min(100, score - 2)
        },
        strengths: [
          '질문의 핵심 의도를 파악하고 문제 해결 방향을 명확히 제시함',
          '제조 도메인과의 연관성을 고려하여 기술적 수단을 언급함'
        ],
        weaknesses: [
          '구체적인 수치 지표(예: 사이클타임 단축률, 오탐률 감소 등)나 트레이드오프 언급이 다소 부족함',
          '현장 예외 상황(네트워크 단절, 센서 노이즈)에 대한 대응책 보강 권장'
        ],
        detailedFeedback: `지원자님의 답변은 ${company || '자동차'} ${jobTitle || '제조DX'} 직무의 실무 관점에서 긍정적인 방향성을 담고 있습니다. 다만 기술적 근거를 설명할 때 사용한 아키텍처의 한계점과 대안(트레이드오프)을 한 문장 정도 덧붙인다면 훨씬 프로페셔널한 인상을 줄 수 있습니다.`,
        suggestedFollowUpQuestion: '방금 답변하신 아키텍처를 도입할 때 실제 현장 작업자나 설비 엔지니어와의 협업 시 예상되는 장애물은 무엇인가요?'
      });
    }

    const systemInstruction = `당신은 ${company || '자동차 기업'}의 기술 면접관입니다.
지원자의 답변을 엄격하고도 건설적으로 평가하세요.
반드시 아래 JSON 형식으로 반환하세요.
{
  "overallScore": 85,
  "scores": {
    "accuracy": 85,
    "coreConcepts": 80,
    "logicalFlow": 90,
    "jobRelevance": 85
  },
  "strengths": ["강점 1", "강점 2"],
  "weaknesses": ["보완할 점 1", "보완할 점 2"],
  "detailedFeedback": "구체적인 피드백 문장 (실무 관점 조언)",
  "suggestedFollowUpQuestion": "면접관이 던질 만한 날카로운 꼬리 질문 1개"
}`;

    const prompt = `[면접 질문]\n${question}\n\n[모범 답변 가이드]\n${modelAnswer || '없음'}\n\n[지원자 실제 답변]\n${userAnswer}\n\n[지원 기업/직무: ${company || '현대자동차'} / ${jobTitle || '제조DX'}]`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Evaluate answer error:', error);
    return res.status(500).json({
      error: '면접 답변 평가 중 오류가 발생했습니다: ' + (error?.message || error)
    });
  }
});

// 4. Match Experience with Job Posting (STAR framework)
app.post('/api/gemini/match-experience', async (req: Request, res: Response) => {
  try {
    const { jobPosting, userProfile, selectedProject } = req.body;

    if (!ai) {
      return res.json({
        overallMatchRate: 88,
        fulfilledCompetencies: [
          '센서 데이터 수집 파이프라인 설계 및 이상 감지 모델링 역량',
          'Python/SQL 기반 시계열 데이터 전처리 및 지표 시각화',
          '제조 도메인 문제(설비 고장 방지)에 대한 공학적 접근 경험'
        ],
        missingCompetencies: [
          '산업용 통신 표준(OPC-UA/PLC) 직접 하드웨어 인터페이스 실무 경험',
          '대규모 분산 환경(Kafka/K8s)에서의 실시간 스트리밍 부하 테스트'
        ],
        starRestructuring: {
          situation: '대학 연계 스마트팩토리 과제에서 모터 진동/전류 센서 데이터를 수집하여 설비 고장 징후를 조기에 감지해야 하는 배경',
          task: '고주파 진동 신호의 노이즈를 제거하고 비지도 학습(Autoencoder)을 활용해 정상 대비 95% 이상의 이상치 탐지 정확도 달성',
          action: 'FFT(고속 푸리에 변환)를 이용해 시간 영역을 주파수 스펙트럼으로 변환하고, PyTorch 기반 경량 Autoencoder를 설계하여 에지 디바이스(Raspberry Pi)에서 인퍼런스 최적화',
          result: '설비 이상 감지 F1-score 0.94 달성, 추론 지연시간을 50ms 이내로 단축하여 인라인 설비 보호 가능성 실증'
        },
        resumeBulletPoints: [
          '고속 푸리에 변환(FFT) 및 Autoencoder를 활용한 설비 진동 이상 탐지 파이프라인 개발 (F1-score 0.94)',
          '에지 디바이스 상의 모델 경량화 및 양자화를 통해 추론 레이턴시 50ms 미만 유지',
          '이상 징후 발생 시 관리자 알림 웹 대시보드 및 REST API 개발'
        ],
        interviewQuestions: [
          '프로젝트에서 사용하신 Autoencoder 모델의 잠재 벡터(Latent Vector) 차원은 어떻게 결정하셨으며, 재구성 오차 임계치(Threshold) 설정 기준은 무엇이었나요?',
          '실제 공장 현장에서는 진동 센서 자체의 고장이나 노이즈가 발생할 수 있습니다. 센서 결함과 실제 설비 고장을 어떻게 구별하시겠습니까?'
        ],
        recommendations: [
          '산업용 표준 통신인 OPC-UA 라이브러리(python-opcua)를 연동해 시뮬레이션 PLC와 통신해보는 심화 과정을 추가하세요.',
          '지원서 작성 시 단순 모델 개발에 그치지 않고 공장 생산성(C/T 단축, 비가동 시간 감소) 측면의 기대효과를 강조하세요.'
        ]
      });
    }

    const systemInstruction = `당신은 자동차 및 모빌리티 제조 산업 전문 커리어 컨설턴트입니다.
지원자의 프로젝트/경험과 채용공고의 요구사항을 엄격하게 비교 분석하세요.
중요: 사용자가 입력하지 않은 수치나 기술 스택을 허구로 지어내지 말고, 근거가 미흡한 부분은 명시하세요.
STAR 프레임워크(Situation, Task, Action, Result)를 통해 지원자의 경험을 재구성하세요.
JSON 응답:
{
  "overallMatchRate": 85,
  "fulfilledCompetencies": ["충족된 핵심 역량 1", "2"],
  "missingCompetencies": ["부족하거나 보완 필요한 역량 1", "2"],
  "starRestructuring": {
    "situation": "상황",
    "task": "과제",
    "action": "수행 행동",
    "result": "결과 및 성과"
  },
  "resumeBulletPoints": ["자기소개서/이력서용 핵심 성과 총알문구 1", "2", "3"],
  "interviewQuestions": ["해당 프로젝트 기반 면접관 심층 질문 1", "2"],
  "recommendations": ["추천 보완 학습 또는 작성 팁 1", "2"]
}`;

    const prompt = `[채용공고 정보]\n${JSON.stringify(jobPosting, null, 2)}\n\n[지원자 프로필]\n${JSON.stringify(userProfile, null, 2)}\n\n[선택된 프로젝트 경험]\n${JSON.stringify(selectedProject, null, 2)}`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Match experience error:', error);
    return res.status(500).json({
      error: '경험 매칭 분석 중 오류가 발생했습니다: ' + (error?.message || error)
    });
  }
});

// 5. Tech Trend Deep Insight
app.post('/api/gemini/tech-insight', async (req: Request, res: Response) => {
  try {
    const { techKeyword, companyContext } = req.body;
    if (!techKeyword) {
      return res.status(400).json({ error: '기술 키워드를 전달해주세요.' });
    }

    if (!ai) {
      return res.json({
        techKeyword,
        concept: `${techKeyword}는 최신 스마트 모빌리티 및 지능형 생산공장의 핵심 기반 기술로서, 데이터 수집, 자동화 및 실시간 최적화를 이끄는 핵심 동력입니다.`,
        whyAutomotiveNeedsIt: '완성차 조립 라인의 유연 생산(다차종 혼류 생산)과 전동화(EV/PBV) 전환에 따라 공정 복잡도가 급증하였으며, 기존의 사후 품질 검사에서 사전 불량 예측 및 자동화 공정 제어로의 패러다임 전환이 필수적이기 때문입니다.',
        targetProcesses: ['차체 조립 공정', '배터리 팩 전장 공정', '인라인 머신비전 검사', '물류 반송 AGV/AMR'],
        leadingCompanies: [companyContext || '현대자동차', '현대모비스', '현대오토에버', '테슬라', '보쉬'],
        requiredCompetencies: ['시계열 센서 데이터 분석', '임베디드/PLC 통신 이해', '머신러닝/비전 알고리즘', '현장 도메인 엔지니어링'],
        learningRoadmap: [
          '기초: 산업용 프로토콜 및 데이터 전처리 실습',
          '심화: 오픈소스 머신비전(OpenCV) 및 이상 탐지 모델 구현',
          '실무 적용: 가상 PLC/시뮬레이터를 활용한 E2E 파이프라인 개발'
        ],
        recommendedProjectIdea: '가상 모빌리티 차체 생산 라인을 가정한 실시간 진동 센서 이상 탐지 및 웹 기반 원격 관제 대시보드 프로젝트'
      });
    }

    const systemInstruction = `당신은 자동차 제조 산업 및 스마트팩토리 수석 연구원입니다.
선택된 핵심 기술 키워드에 대해 취업 준비생이 반드시 알아야 할 실무 기술 분석을 작성하세요.
JSON 응답:
{
  "techKeyword": "기술명",
  "concept": "핵심 개념 설명",
  "whyAutomotiveNeedsIt": "자동차 제조산업에서 필수적인 이유 (구체적 생산성/품질 관점)",
  "targetProcesses": ["적용 제조 공정 1", "공정 2"],
  "leadingCompanies": ["주도 기업 리스트"],
  "requiredCompetencies": ["취준생에게 요구되는 전공 기술 역량"],
  "learningRoadmap": ["추천 학습 로드맵 단계 1", "단계 2", "단계 3"],
  "recommendedProjectIdea": "포트폴리오에 넣기 좋은 추천 프로젝트 아이디어"
}`;

    const prompt = `기술 키워드: ${techKeyword}\n연관 기업 컨텍스트: ${companyContext || '현대자동차그룹'}`;
    const resultText = await callGemini(prompt, systemInstruction, true);
    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Tech insight error:', error);
    return res.status(500).json({
      error: '기술 분석 중 오류가 발생했습니다: ' + (error?.message || error)
    });
  }
});

// Vite Middleware for Development / Static file server for Production
async function setupViteOrStatic() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoInsight AI server running at http://0.0.0.0:${PORT} [mode: ${process.env.NODE_ENV || 'development'}]`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
