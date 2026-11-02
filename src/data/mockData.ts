import { Company, TechnologyTrend, JobPosting, UserProfile } from '../types';

export const COMPANIES_DATA: Company[] = [
  {
    id: 'hyundai-motor',
    name: '현대자동차',
    englishName: 'Hyundai Motor Company',
    logo: '🚗',
    category: '완성차',
    tagline: '인류를 위한 진보와 스마트 모빌리티 솔루션 프로바이더',
    description: '완성차 제조의 5대 핵심 공정(프레스, 차체, 도장, 의장, 최종검사) 및 차세대 전기차 전용 플랫폼(E-GMP) 전동화 공정을 보유한 글로벌 Top 3 모빌리티 기업입니다.',
    headquarters: '서울특별시 서초구 헌릉로 12 (양재동)',
    keyBusiness: ['승용/SUV/상용차 제조 및 판매', '전기차(아이오닉) 및 수소전기차 개발', '로보틱스 및 스마트 제조 솔루션', 'AAM(미래항공모빌리티)'],
    keyProducts: ['아이오닉 5/6/9', '제네시스 G80/GV80', '아반떼, 쏘나타, 그랜저', '투싼, 싼타페, 팰리세이드', 'ST1 상용 전동화'],
    keyTechnologies: ['스마트 서보 프레스', '레이저 브레이징 및 스팟 용접 로봇', '수용성 3-Wet 도장', 'AGV/AMR 무인 부품 반송', 'ADAS 레이더/비전 EOL 캘리브레이션', '배터리 시스템 BSA 조립'],
    isDemoSample: true,
    nodes: [
      {
        id: 'hmc-p1',
        name: '1. 프레스 공정 (Press)',
        category: 'press',
        shortDesc: '코일 상태의 고장력 강판을 압축 성형하여 패널(도어, 후드, 루프 등)을 제작',
        order: 1,
        mainTasks: [
          '블랭킹(Blanking): 강판 코일을 일정 규격으로 절단',
          '드로잉(Drawing): 초대형 프레스 금형으로 3차원 입체 형상 성형',
          '트리밍/피어싱(Trimming/Piercing): 불필요한 테두리 절단 및 홀 가공',
          '패널 표면 미세 크랙 및 덴트(Dent) 육안/비전 검사'
        ],
        equipment: ['5,400톤급 서보 트랜스퍼 프레스(Servo Transfer Press)', '블랭킹 라인', '금형 신속 교환장치(QDC)', '자동 적재 로봇'],
        appliedTech: ['스마트 서보 제어(가변 속도 프레싱)', '금형 압력 실시간 센싱', '초고장력강 핫스탬핑(Hot Stamping)', '음향 방출 센서 기반 크랙 검출'],
        relatedJobs: ['프레스 생산기술', '금형 기술개발', '프레스 설비보전', '품질관리(소재/치수)'],
        qualityMetrics: [
          { name: 'Cpk (공정능력지수)', target: '≥ 1.67', description: '치수 공차 범위 내 가공 안정성' },
          { name: '스크랩율(Scrap Rate)', target: '≤ 12%', description: '원자재 강판 낭비율 최소화' },
          { name: '금형 교환 시간 (SPM)', target: '≤ 3분', description: '다차종 유연생산을 위한 전환 시간' }
        ],
        relatedTrendKeywords: ['스마트팩토리', '제조DX', '디지털 트윈'],
        badgeColor: 'blue'
      },
      {
        id: 'hmc-p2',
        name: '2. 차체 공정 (Body)',
        category: 'body',
        shortDesc: '프레스에서 성형된 각 패널을 용접·결합하여 차량의 뼈대(BIW: Body in White) 완성',
        order: 2,
        mainTasks: [
          '서브 어셈블리(Sub Assembly): 플로어, 도어, 사이드 패널 단위 조립',
          '메인 벅(Main Buck) 라인: 차체 기본 골격 통합 결합',
          '로봇 스팟 용접, 레이저 브레이징 및 구조용 접착제 도포',
          '비전 센서 기반 인라인(In-line) 갭·단차 정밀 측정'
        ],
        equipment: ['산업용 다관절 용접 로봇(6축)', '서보 스팟 건(Servo Spot Gun)', '레이저 용접 헤드', '구조용 접착제 디스펜서', '광학 3D 비전 센서'],
        appliedTech: ['100% 자동화 로봇 용접', 'AI 비전 기반 실시간 갭/단차(Gap & Flush) 계측', '용접 너겟(Nugget) 품질 실시간 모니터링', '협동로봇 활용'],
        relatedJobs: ['차체 생산기술', '로봇 제어 엔지니어', '차체 품질검사', '차체 스마트제조DX'],
        qualityMetrics: [
          { name: '용접 타점 누락률', target: '0 ppm', description: '스팟 용접 누락 제로 보증' },
          { name: '차체 치수 정밀도', target: '±1.0 mm 이내', description: '전체 BIW 3차원 좌표계 정밀도' },
          { name: '로봇 라인 가동률 (OEE)', target: '≥ 95%', description: '설비 종합 효율' }
        ],
        relatedTrendKeywords: ['Physical AI', '머신비전 AI 품질검사', 'Software Defined Factory (SDF)'],
        badgeColor: 'indigo'
      },
      {
        id: 'hmc-p3',
        name: '3. 도장 공정 (Paint)',
        category: 'paint',
        shortDesc: '차체 부식을 방지하고 차량 고유의 내식성·내구성 및 외관 색상을 부여',
        order: 3,
        mainTasks: [
          '전처리 및 전착도장(E-Coat): 방청 및 침적 도장으로 내부 방청성 확보',
          '실러 도포: 물과 소음 유입을 막기 위한 접합부 실링',
          '중도(Primer) 및 상도(Base/Clear): 컬러 및 광택/보호 코팅 스프레이',
          '고온 열풍 건조(Oven Curing) 및 표면 외관 결함 비전 검사'
        ],
        equipment: ['침적 전착조 탱크', '다축 방폭 도장 로봇(Bell Sprayer)', '베이킹 오븐', '자동 실러 로봇', '광학 디플렉토메트리 표면 스캐너'],
        appliedTech: ['친환경 3-Wet 수용성 도장 공법', '도료 토출량 정밀 유량 제어', 'AI 머신비전 기반 도막 미세 먼지/오렌지필 검출', '공조 에너지 회수 시스템'],
        relatedJobs: ['도장 생산기술', '도료/화학 품질관리', '도장 설비 엔지니어', '환경안전 엔지니어'],
        qualityMetrics: [
          { name: '도막 두께 균일도', target: '90~110 ㎛', description: '하도/중도/상도 총 도막 두께 기준' },
          { name: '표면 결함 개수', target: '≤ 0.5개/대', description: '티끌, 흘림, 핀홀 등 외관 결함' },
          { name: '도장 직행률 (FTQ)', target: '≥ 92%', description: '재작업 없는 최초 합격률' }
        ],
        relatedTrendKeywords: ['머신비전 AI 품질검사', '스마트팩토리', '설비 예지보전 (PdM)'],
        badgeColor: 'cyan'
      },
      {
        id: 'hmc-p4',
        name: '4. 의장 공정 (Assembly)',
        category: 'assembly',
        shortDesc: '도장된 차체에 엔진/모터, 배터리, 섀시, 내장 시트, 와이어링, 전장 모듈 조립',
        order: 4,
        mainTasks: [
          '트림 라인(Trim): 와이어링 하네스, 에어백, 대시보드(칵핏 모듈) 장착',
          '샤시 라인(Chassis): 서스펜션, 브레이크, PE시스템/배터리팩 메리지(Marriage)',
          '파이널 라인(Final): 유리창 실러 부착, 시트, 도어 재결합, 오일/냉각수 주입',
          '무인 운반차(AGV/AMR)를 통한 시퀀스 부품 저스트인타임(JIT) 공급'
        ],
        equipment: ['자동 차체 도어 탈착기', '샤시 자동 체결기(Bolt Runner)', '글래스 장착 로봇', '자율이송로봇(AMR/AGV)', '토크 관리형 무선 전동공구'],
        appliedTech: ['디지털 스마트 툴링(체결 토크/각도 IoT 데이터 자동 저장)', '작업자 근골격계 보조 착용로봇(VEX/CEX)', 'RFID/비콘 기반 부품 오조립 방지(Poka-Yoke)', 'AMR 군집 제어 물류'],
        relatedJobs: ['의장 생산기술', '생산관리/물류 엔지니어', '스마트제조 IT', '의장 품질보증'],
        qualityMetrics: [
          { name: '체결 토크 불량률', target: '0 ppm', description: '안전보안 체결 데이터 100% 디지털 로깅' },
          { name: '조립 라인 밸런스율', target: '≥ 94%', description: '공정 간 작업 부하 균등도' },
          { name: '시간당 생산대수 (UPH)', target: '50~65 UPH', description: '목표 사이클타임 준수율' }
        ],
        relatedTrendKeywords: ['산업용 자율이송로봇 (AMR/AGV)', 'Software Defined Factory (SDF)', '제조DX'],
        badgeColor: 'amber'
      },
      {
        id: 'hmc-p5',
        name: '5. 최종 검사 및 EOL (Final Inspection)',
        category: 'inspection',
        shortDesc: '조립 완료 차량의 주행 성능, ADAS 전장 센서 정밀 보정, 휠얼라인먼트 및 수밀성 전수 검사',
        order: 5,
        mainTasks: [
          '휠 얼라인먼트 및 헤드램프 조사각 자동 검사',
          '샤시 다이나모미터(Chassis Dynamo): 제동력, 속도계, 구동 안정성 검사',
          'ADAS 전방 레이더/카메라 타겟 캘리브레이션 및 ECU 통신 진단(CAN/Ethernet)',
          '샤워 테스터(Shower Test): 고압 살수를 통한 차실 내 수밀 누수 검사',
          '공장 내 주행시험장 실차 주행(BSR 이음/진동) 및 최종 출고 판정'
        ],
        equipment: ['비접촉 레이저 휠 얼라인먼트 테스터', '4륜 섀시 다이나모', 'ADAS 타겟 전동 세팅 장치', '고압 수밀 샤워 부스', 'OBD-II EOL 진단 통신기'],
        appliedTech: ['ECU 소프트웨어 버전 및 무선(OTA) 펌웨어 최종 무결성 검증', 'AI 마이크 음향 분석을 통한 주행 이음(BSR) 진단', '스마트 팩토리 중앙 관제 통합 품질 합격 승인'],
        relatedJobs: ['완성차 품질관리(QC)', '차량 전장 검사기술', '주행 평가 엔지니어', '고객품질 데이터 분석'],
        qualityMetrics: [
          { name: '수밀 누수율', target: '0 %', description: '고압 수밀 시험 100% 무누수 보증' },
          { name: '전장 센서 캘리브레이션 오차', target: '±0.05도 이내', description: '자율주행/ADAS 센서 영점 정밀도' },
          { name: '종합 직행률 (Total FTQ)', target: '≥ 88%', description: '최종 출고 전 무수정 합격률' }
        ],
        relatedTrendKeywords: ['머신비전 AI 품질검사', '전기차 배터리/PE시스템 생산기술', '스마트팩토리'],
        badgeColor: 'emerald'
      }
    ],
    edges: [
      { id: 'e1-2', source: 'hmc-p1', target: 'hmc-p2', label: '성형 패널 공급' },
      { id: 'e2-3', source: 'hmc-p2', target: 'hmc-p3', label: 'BIW 백차체 이송' },
      { id: 'e3-4', source: 'hmc-p3', target: 'hmc-p4', label: '도장 차체 입고' },
      { id: 'e4-5', source: 'hmc-p4', target: 'hmc-p5', label: '완성차 조립 완료' }
    ]
  },
  {
    id: 'kia',
    name: '기아',
    englishName: 'Kia Corporation',
    logo: '⚡',
    category: '완성차',
    tagline: '지속 가능한 모빌리티 솔루션을 제공하는 무브먼트 댓 인스파이어스',
    description: 'EV 시리즈와 목적기반모빌리티(PBV) 오토랜드 화성 전용공장을 운영하며 컨버전 유연 조립 및 다차종 혼류 스마트팩토리를 선도하는 완성차 기업입니다.',
    headquarters: '서울특별시 서초구 헌릉로 12',
    keyBusiness: ['승용/SUV/친환경차 제조 및 판매', 'PBV(PV5, PV7) 비즈니스', '특수차량(군용차) 제작', '커넥티드 카 및 모빌리티 서비스'],
    keyProducts: ['EV3, EV6, EV9', '카니발, 쏘렌토, 스포티지', 'K5, K8, 셀토스', 'PV5(화성 EVO 플랜트)'],
    keyTechnologies: ['PBV 셀 생산(Cell-based Manufacturing)', '이지스왑(Easy Swap) 차체 모듈 체결', '가상 팩토리 가상 시운전', '친환경 바이오 소재 제조'],
    isDemoSample: true,
    nodes: [
      {
        id: 'kia-p1',
        name: 'PBV 모듈러 프레임 가공',
        category: 'body',
        shortDesc: '차체 하부(스케이트보드 플랫폼)와 상부 라이프모듈의 유연 결합 공정',
        order: 1,
        mainTasks: ['고강도 스틸/알루미늄 하이브리드 접합', '이지스왑 퀵체인징 체결부 정밀 밀링', '모듈 간 갭/단차 비전 측정'],
        equipment: ['파이버 레이저 용접 로봇', '정밀 다축 머시닝 센터', '비전 인라인 검사기'],
        appliedTech: ['셀(Cell) 생산 방식 유연 라인', '디지털 트윈 공정 시뮬레이션'],
        relatedJobs: ['PBV 생산기술', '차체 공정설계'],
        qualityMetrics: [{ name: '모듈 인터페이스 공차', target: '±0.5mm', description: '이지스왑 체결 정밀도' }],
        relatedTrendKeywords: ['Software Defined Factory (SDF)', '디지털 트윈'],
        badgeColor: 'blue'
      },
      {
        id: 'kia-p2',
        name: 'PBV 플렉서블 컨버전 조립',
        category: 'assembly',
        shortDesc: '고객 맞춤형(물류형, 승객형, 레저형) 내장 모듈의 무인 AMR 기반 셀 조립',
        order: 2,
        mainTasks: ['AMR 기반 차체 자율 이송', '스마트 전동 툴 조립', '맞춤형 전장 배선 연결'],
        equipment: ['군집 제어 무인 지게차 및 AMR', '스마트 작업 지시 AR 글래스'],
        appliedTech: ['SDF 지능형 생산 스케줄링', '실시간 IoT 토크 트래킹'],
        relatedJobs: ['스마트팩토리 제어', '의장 조립 엔지니어'],
        qualityMetrics: [{ name: '고객 맞춤 사양 일치율', target: '100%', description: '다품종 혼류 시 오조립 제로' }],
        relatedTrendKeywords: ['산업용 자율이송로봇 (AMR/AGV)', '스마트팩토리'],
        badgeColor: 'amber'
      },
      {
        id: 'kia-p3',
        name: '통합 소프트웨어 무결성 검증 (OTA & EOL)',
        category: 'inspection',
        shortDesc: '차량 제어기 펌웨어 플래싱, 무선 업데이트 검증 및 종합 성능 테스트',
        order: 3,
        mainTasks: ['도메인 제어기(DCU) 통신 진단', 'SDV 아키텍처 소프트웨어 무결성 체크', '자율주행 센서 융합 검사'],
        equipment: ['차량용 이더넷 EOL 진단기', '샤시 다이노', '통신 스니퍼'],
        appliedTech: ['차량 무선 통신(OTA) 검증', 'AI 기반 이상 신호 탐지'],
        relatedJobs: ['차량 전장 검사기술', 'SW 품질 엔지니어'],
        qualityMetrics: [{ name: '제어기 통신 불량률', target: '0 ppm', description: 'CAN/Ethernet 에러 제로' }],
        relatedTrendKeywords: ['제조DX', 'Software Defined Factory (SDF)'],
        badgeColor: 'emerald'
      }
    ],
    edges: [
      { id: 'k-e1-2', source: 'kia-p1', target: 'kia-p2', label: '플랫폼 이송' },
      { id: 'k-e2-3', source: 'kia-p2', target: 'kia-p3', label: '완성차 진단' }
    ]
  },
  {
    id: 'hyundai-mobis',
    name: '현대모비스',
    englishName: 'Hyundai Mobis',
    logo: '🔋',
    category: '부품/전동화',
    tagline: '미래 모빌리티의 핵심 전동화 부품 및 섀시·전장 시스템 글로벌 리더',
    description: '배터리 시스템(BSA), 구동 모터(PE 시스템), 칵핏 및 섀시 모듈을 생산하며 전동화 핵심 부품 스마트 제조 라인을 운영하는 부품사입니다.',
    headquarters: '서울특별시 강남구 테헤란로 203',
    keyBusiness: ['전동화 부품(배터리팩, 구동모터, 인버터)', '섀시/칵핏/프론트엔드 모듈 조립', '자율주행 센서/제어기(ADAS)', '램프 및 제동/조향 전장'],
    keyProducts: ['BSA(Battery System Assembly)', '3-in-1 PE 시스템(모터+인버터+감속기)', '전동식 조향(MDPS)', '전동식 제동(iMEB)', '차세대 디스플레이 칵핏'],
    keyTechnologies: ['배터리 셀 투 팩(Cell-to-Pack) 레이저 용접', '초정밀 모터 코일 권선 기술', '고전압 절연 내전압 시험(Hi-Pot)', '진동/소음(NVH) 음향 테스팅'],
    isDemoSample: true,
    nodes: [
      {
        id: 'mobis-p1',
        name: '배터리 셀 검사 및 모듈 적층 (Cell Stacking)',
        category: 'battery_pe',
        shortDesc: '입고된 파우치/각형 셀의 OCV/내부저항 측정 및 절연 패드 부착 후 적층',
        order: 1,
        mainTasks: ['OCV(개방회로전압) 및 IR(내부저항) 자동 계측', '셀 표면 결함 3D 광학 검사', '셀 적층 및 열전도 갭필러 도포'],
        equipment: ['고속 셀 분류기', '열전도 실러 디스펜서', '셀 적층 정밀 로봇'],
        appliedTech: ['셀 밸런싱 판정 알고리즘', '인라인 3D 비전 비접촉 검사'],
        relatedJobs: ['배터리 생산기술', '전동화 품질관리'],
        qualityMetrics: [{ name: '셀 전압 편차', target: '≤ 3mV', description: '모듈 내 셀 간 균일성' }],
        relatedTrendKeywords: ['전기차 배터리/PE시스템 생산기술', '머신비전 AI 품질검사'],
        badgeColor: 'blue'
      },
      {
        id: 'mobis-p2',
        name: '버스바 레이저 용접 및 와이어링 (Laser Welding)',
        category: 'battery_pe',
        shortDesc: '배터리 셀 단자와 버스바(Busbar)를 레이저로 초정밀 용접하여 직·병렬 회로 구성',
        order: 2,
        mainTasks: ['레이저 초정밀 용접', '용접 비드 높이 및 폭 비전 검사', '용접부 저항 및 인장 강도 측정'],
        equipment: ['파이버 레이저 용접기', '실시간 용접 모니터링 시스템(LWM)', '초음파 검사기'],
        appliedTech: ['용접 플라즈마 모니터링', '비전 딥러닝 비드 결함 분석'],
        relatedJobs: ['레이저 접합기술', '전동화 설비제어'],
        qualityMetrics: [{ name: '용접 저항 규격', target: '≤ 0.05 mΩ', description: '고전압 발열 방지' }],
        relatedTrendKeywords: ['머신비전 AI 품질검사', '설비 예지보전 (PdM)'],
        badgeColor: 'indigo'
      },
      {
        id: 'mobis-p3',
        name: 'BMS 체결 및 배터리팩 케이싱 밀봉',
        category: 'battery_pe',
        shortDesc: '배터리관리시스템(BMS) 장착, 하우징 결합 및 냉각수 수밀 가스 기밀 시험',
        order: 3,
        mainTasks: ['BMS 하네스 자동 체결', '열관리 냉각 플레이트 조립', '헬륨 누설 감지(Leak Test)'],
        equipment: ['자동 볼트 체결기', '헬륨 진공 챔버 테스터', 'BMS 프로그래머'],
        appliedTech: ['고감도 질량분석 헬륨 리크 디텍션', '스마트 토크 로깅'],
        relatedJobs: ['배터리 기밀 공정기술', '품질보증'],
        qualityMetrics: [{ name: '기밀 누설량', target: '≤ 1.0x10^-4 mbar·l/s', description: '완전 방수/방진 방지' }],
        relatedTrendKeywords: ['스마트팩토리', '제조DX'],
        badgeColor: 'cyan'
      },
      {
        id: 'mobis-p4',
        name: '고전압 EOL 성능 및 전기 안전 검사 (Hi-Pot)',
        category: 'inspection',
        shortDesc: '완성된 배터리팩의 절연저항, 충방전 특성, CAN 통신 및 안전 차단 릴레이 검증',
        order: 4,
        mainTasks: ['절연저항 및 내전압(Hi-Pot) 시험', 'BMS 통신 무결성 및 셀 밸런싱 검사', '급속 충방전 모의 부하시험'],
        equipment: ['고전압 충방전 사이클러', 'Hi-Pot 절연 시험기', 'HILs 진단 시스템'],
        appliedTech: ['AI 기반 충방전 곡선 이상치 탐지', '전동화 공정 빅데이터 추적성(Traceability)'],
        relatedJobs: ['전동화 시험평가', '품질데이터 엔지니어'],
        qualityMetrics: [{ name: '절연저항값', target: '≥ 500 MΩ', description: '감전 및 누전 원천 차단' }],
        relatedTrendKeywords: ['제조DX', '전기차 배터리/PE시스템 생산기술'],
        badgeColor: 'emerald'
      }
    ],
    edges: [
      { id: 'mb-e1-2', source: 'mobis-p1', target: 'mobis-p2', label: '적층 모듈 이송' },
      { id: 'mb-e2-3', source: 'mobis-p2', target: 'mobis-p3', label: '버스바 용접 완료' },
      { id: 'mb-e3-4', source: 'mobis-p3', target: 'mobis-p4', label: '케이싱 조립 완료' }
    ]
  },
  {
    id: 'hyundai-autoever',
    name: '현대오토에버',
    englishName: 'Hyundai AutoEver',
    logo: '💻',
    category: '제조IT/솔루션',
    tagline: '모빌리티 소프트웨어와 차세대 스마트팩토리 SDF 플랫폼의 중추',
    description: '완성차 및 그룹사의 제조 현장을 지능화하는 제조IT 전문 기업으로, 설비 데이터 수집부터 MES, 디지털 트윈, SDF(Software Defined Factory) 플랫폼을 개발·운영합니다.',
    headquarters: '서울특별시 강남구 테헤란로 510',
    keyBusiness: ['스마트팩토리 솔루션(MES/SDF/Q-System)', '차량 소프트웨어 플랫폼(모빌진 mobilgene)', '엔터프라이즈 IT 시스템(ERP/SCM/CRM)', '클라우드 및 제조 빅데이터 플랫폼'],
    keyProducts: ['스마트팩토리 SDF 플랫폼', 'nexcore MES 솔루션', '스마트 물류 관제(AMR Fleet Management)', '가상 공장 디지털 트윈'],
    keyTechnologies: ['산업용 IoT 프로토콜(OPC-UA/MQTT)', 'Kafka 기반 실시간 이벤트 스트리밍', '머신러닝 이상 탐지 MLOps', 'Kubernetes 컨테이너 마이크로서비스', '디지털 트윈 3D 가상화'],
    isDemoSample: true,
    nodes: [
      {
        id: 'autoever-s1',
        name: '설비 계층 데이터 인터페이스 (PLC & Sensor)',
        category: 'it_platform',
        shortDesc: '현장 생산설비(PLC, 로봇, 프레스, 센서)와 직접 물리적 신호를 연계하는 에지 계층',
        order: 1,
        mainTasks: ['미쓰비시/지멘스/LS PLC 메모리 영역 맵핑', '온도·진동·전류 아날로그 센서 데이터 수집', '에지 디바이스(Industrial PC) 프로비저닝'],
        equipment: ['산업용 에지 게이트웨이(IPC)', '필드버스 네트워크 스위치', '프로토콜 변환 컨버터'],
        appliedTech: ['OPC-UA 표준 프로토콜', 'Modbus TCP', '에지 단 데이터 전처리 및 다운샘플링'],
        relatedJobs: ['제조IT 엔지니어', 'PLC 통신 인터페이스 개발자', '스마트팩토리 제어'],
        qualityMetrics: [{ name: '데이터 수집 누락률', target: '≤ 0.001%', description: '초당 수만 포인트 신호 안정성' }],
        relatedTrendKeywords: ['산업용 통신 (OPC-UA/MQTT) & MES', '제조DX'],
        badgeColor: 'blue'
      },
      {
        id: 'autoever-s2',
        name: '실시간 데이터 파이프라인 & 에지 브로커 (Edge & Ingestion)',
        category: 'it_platform',
        shortDesc: '수집된 대용량 시계열 설비 데이터를 유실 없이 실시간으로 메시징 및 큐잉',
        order: 2,
        mainTasks: ['MQTT 메시지 브로커 수신', 'Apache Kafka 토픽 파티셔닝 및 스트리밍', '시계열 DB(InfluxDB/TimescaleDB) 및 NoSQL 적재'],
        equipment: ['온프레미스 쿠버네티스 클러스터', '고성능 메시지 큐 서버', 'SSD 스토리지 어레이'],
        appliedTech: ['Apache Kafka / RabbitMQ', 'MQTT QoS 설정', '도커 컨테이너화 에지 런타임'],
        relatedJobs: ['데이터 엔지니어', '클라우드/인프라 아키텍트', '백엔드 플랫폼 개발자'],
        qualityMetrics: [{ name: '스트리밍 지연시간(Latency)', target: '≤ 100ms', description: '설비 이벤트 즉각 전송' }],
        relatedTrendKeywords: ['제조DX', 'Software Defined Factory (SDF)'],
        badgeColor: 'indigo'
      },
      {
        id: 'autoever-s3',
        name: '제조실행시스템 (MES) & SDF 생산 지능화',
        category: 'it_platform',
        shortDesc: '공장 생산 계획, 작업 지시, 생산 이력(Lot 추적), 실시간 가동 현황 총괄 관제',
        order: 3,
        mainTasks: ['자재 소요 및 작업 순서 디스패칭', '바코드/RFID 연계 조립 이력 실시간 바인딩', '라인 가동/비가동 OEE 분석 및 병목 공정 파악'],
        equipment: ['MES 엔터프라이즈 서버', '현장 작업자용 스마트 태블릿/터치 키오스크', '바코드 2D 스캐너'],
        appliedTech: ['Spring Boot / Java 기반 마이크로서비스', '트랜잭션 정합성(ACID) 보장', '웹소켓 실시간 UI 대시보드'],
        relatedJobs: ['MES 솔루션 개발자', '생산정보화 PM', '스마트제조 컨설턴트'],
        qualityMetrics: [{ name: '시스템 가용성 (SLA)', target: '99.99%', description: '24시간 무중단 라인 운영' }],
        relatedTrendKeywords: ['산업용 통신 (OPC-UA/MQTT) & MES', '스마트팩토리'],
        badgeColor: 'cyan'
      },
      {
        id: 'autoever-s4',
        name: 'AI 품질 분석 & 이상탐지 (MLOps Engine)',
        category: 'it_platform',
        shortDesc: '수집된 이미지 및 설비 신호 데이터를 AI 모델로 분석하여 사전 결함 탐지 및 예지보전',
        order: 4,
        mainTasks: ['비전 검사 이미지 딥러닝 추론 파이프라인 운영', '설비 모터 진동 이상 패턴 탐지 모델 서빙', '모델 성능 드리프트 모니터링 및 재학습'],
        equipment: ['GPU 인퍼런스 서버(NVIDIA TensorRT)', 'MLOps 파이프라인 서버(MLflow)'],
        appliedTech: ['CNN / PatchCore 비지도 이상탐지', '시계열 LSTM / Transformer 모델', '모델 경량화(ONNX/TensorRT)'],
        relatedJobs: ['제조 AI 연구원', '머신러닝 엔지니어', '데이터 사이언티스트'],
        qualityMetrics: [{ name: '이상 감지 재현율(Recall)', target: '≥ 99.5%', description: '불량 유출 원천 방지' }],
        relatedTrendKeywords: ['머신비전 AI 품질검사', '설비 예지보전 (PdM)', 'Physical AI'],
        badgeColor: 'amber'
      },
      {
        id: 'autoever-s5',
        name: '디지털 트윈 & 엔터프라이즈 연계 (ERP / SCM)',
        category: 'it_platform',
        shortDesc: '3D 가상 공간에 실제 공장을 실시간 동기화하고 상위 ERP/SCM 시스템과 공급망 연동',
        order: 5,
        mainTasks: ['공장 3D CAD 메쉬 기반 실시간 디지털 트윈 렌더링', '가상 시운전(Virtual Commissioning)을 통한 라인 사전 검증', 'SAP ERP 원가/재고 데이터 연동'],
        equipment: ['Unity / Unreal 3D 디지털 트윈 엔진', 'ERP 연동 EAI/ESB 서버'],
        appliedTech: ['WebAssembly / WebGL 3D 렌더링', 'RESTful API & gRPC', '기업용 보안 아키텍처'],
        relatedJobs: ['디지털 트윈 개발자', 'ERP 인터페이스 개발자', '엔터프라이즈 솔루션 아키텍트'],
        qualityMetrics: [{ name: '디지털 트윈 물리 동기화 오차', target: '≤ 0.2초', description: '현장과 가상공간 일치도' }],
        relatedTrendKeywords: ['디지털 트윈', 'Software Defined Factory (SDF)'],
        badgeColor: 'emerald'
      }
    ],
    edges: [
      { id: 'ae-e1-2', source: 'autoever-s1', target: 'autoever-s2', label: '원시 센서 데이터 전달' },
      { id: 'ae-e2-3', source: 'autoever-s2', target: 'autoever-s3', label: '정제된 이벤트 큐잉' },
      { id: 'ae-e2-4', source: 'autoever-s2', target: 'autoever-s4', label: 'AI 추론 데이터 분기' },
      { id: 'ae-e3-5', source: 'autoever-s3', target: 'autoever-s5', label: '생산 실적 동기화' },
      { id: 'ae-e4-5', source: 'autoever-s4', target: 'autoever-s5', label: '이상치 경보 전달' }
    ]
  },
  {
    id: 'hyundai-wia',
    name: '현대위아',
    englishName: 'Hyundai Wia',
    logo: '⚙️',
    category: '공작기계/소재',
    tagline: '친환경 차량 구동부품, 열관리 시스템 및 스마트 제조 로보틱스 선도기업',
    description: '공작기계, 스마트팩토리 협동로봇 및 전동화 통합 열관리 시스템, 등속조인트를 생산하는 자동차 핵심 부품 및 제조 설비 기업입니다.',
    headquarters: '경상남도 창원시 성산구 정동로 153',
    keyBusiness: ['통합 열관리 모듈(TMS)', '등속조인트(CV Joint) 및 4WD 부품', '스마트 물류 로봇(협동로봇, AMR)', '초정밀 CNC 공작기계'],
    keyProducts: ['냉각수 허브 모듈', '전기차 감속기 조립 라인', '산업용 로봇', '공작기계 XF/SE 시리즈'],
    keyTechnologies: ['초정밀 가공 공정', '스마트 열처리/침탄 기술', '협동로봇 라인 자동화', '열관리 밸브 수밀 테스팅'],
    isDemoSample: true,
    nodes: [
      {
        id: 'wia-p1',
        name: '정밀 절삭 가공 (CNC Machining)',
        category: 'machining',
        shortDesc: '고강도 합금강을 정밀 밀링 및 선삭하여 감속기 기어 및 샤프트 부품 가공',
        order: 1,
        mainTasks: ['CNC 5축 가공', '절삭유 모니터링', '공구 마모도 실시간 감지'],
        equipment: ['현대위아 머시닝센터 XF 시리즈', '공구 측정 프로브'],
        appliedTech: ['AI 기반 가공 진동 공구 파손 사전 감지', '고속 서보 스핀들 제어'],
        relatedJobs: ['가공 생산기술', '설비보전 엔지니어'],
        qualityMetrics: [{ name: '기어 치형 가공 공차', target: '±5 ㎛', description: '초정밀 치수 공차' }],
        relatedTrendKeywords: ['스마트팩토리', '설비 예지보전 (PdM)'],
        badgeColor: 'blue'
      },
      {
        id: 'wia-p2',
        name: '친환경 열관리 모듈 조립 & 기밀 검사',
        category: 'parts_module',
        shortDesc: '전기차 배터리/모터 냉각수 순환 밸브 및 펌프 자동 조립 및 수밀 검사',
        order: 2,
        mainTasks: ['협동로봇 기반 밸브 볼팅', '냉각수 유량 시험', '공압 기밀 시험'],
        equipment: ['현대위아 협동로봇', '공압 누설 시험기'],
        appliedTech: ['비전 포지셔닝 로봇 암', '스마트 토크 드라이버'],
        relatedJobs: ['모듈 생산기술', '품질관리'],
        qualityMetrics: [{ name: '유량 제어 오차', target: '≤ 1.5%', description: '열관리 효율 보장' }],
        relatedTrendKeywords: ['산업용 자율이송로봇 (AMR/AGV)', '머신비전 AI 품질검사'],
        badgeColor: 'emerald'
      }
    ],
    edges: [
      { id: 'wia-e1-2', source: 'wia-p1', target: 'wia-p2', label: '가공 부품 모듈화' }
    ]
  },
  {
    id: 'hyundai-transys',
    name: '현대트랜시스',
    englishName: 'Hyundai Transys',
    logo: '🔄',
    category: '부품/전동화',
    tagline: '글로벌 톱 파워트레인과 인체공학적 스마트 모빌리티 시트 전문 기업',
    description: '변속기, 전기차 감속기, 하이브리드 구동계 및 프리미엄 에르고 모션 시트를 개발 및 생산하는 모빌리티 부품 전문기업입니다.',
    headquarters: '충청남도 서산시 지곡면 현대기아로 160',
    keyBusiness: ['전기차 감속기(Reducer) 제조', '하이브리드 변속기 제조', '스마트 시트(에르고 모션, 자율주행 회전 시트)', '액슬 및 감속기 부품'],
    keyProducts: ['EV 감속기 모듈', '전륜/후륜 8단 자동변속기', '제네시스 에르고 릴렉션 시트'],
    keyTechnologies: ['기어 치면 정밀 연삭', 'NVH(소음/진동) 인라인 전수 검사', '스마트 시트 통신 제어(LIN/CAN)', '시트 가죽 자동 재단'],
    isDemoSample: true,
    nodes: [
      {
        id: 'transys-p1',
        name: '감속기 기어 정밀 연삭 및 조립',
        category: 'machining',
        shortDesc: '전기차 고회전 모터의 소음을 잡기 위한 기어 치면 마이크로미터 단위 초정밀 연삭',
        order: 1,
        mainTasks: ['기어 호빙 및 열처리 후 치면 연삭', '베어링 압입', '하우징 볼트 체결'],
        equipment: ['초정밀 기어 연삭기', '서보 프레스 압입기'],
        appliedTech: ['인라인 기어 맞물림 오차 측정', '프레스 하중 변위 모니터링'],
        relatedJobs: ['감속기 생산기술', '정밀가공 엔지니어'],
        qualityMetrics: [{ name: '기어 맞물림 전달 오차(TE)', target: '≤ 1.2 ㎛', description: '전기차 고주파 소음 방지' }],
        relatedTrendKeywords: ['설비 예지보전 (PdM)', '스마트팩토리'],
        badgeColor: 'blue'
      },
      {
        id: 'transys-p2',
        name: '무향실 NVH 음향 전수 검사 (End of Line)',
        category: 'inspection',
        shortDesc: '감속기를 최대 15,000 RPM 이상으로 회전시키며 음향 및 진동 주파수를 AI 분석',
        order: 2,
        mainTasks: ['모의 모터 결합 회전 구동', '진동 가속도계 및 마이크로폰 신호 계측', 'FFT 스펙트럼 분석'],
        equipment: ['준무향실 부스', '고정밀 마이크로폰 어레이', '실시간 FFT 분석기'],
        appliedTech: ['AI 기반 기어 고스트 노이즈(Ghost Noise) 판정', '비지도 이상음 탐지'],
        relatedJobs: ['NVH 평가 엔지니어', '품질보증'],
        qualityMetrics: [{ name: 'NVH 불량 검출율', target: '100%', description: '차량 탑재 전 이상음 유출 제로' }],
        relatedTrendKeywords: ['머신비전 AI 품질검사', '제조DX'],
        badgeColor: 'emerald'
      }
    ],
    edges: [
      { id: 'ts-e1-2', source: 'transys-p1', target: 'transys-p2', label: '조립 완료품 무향실 진입' }
    ]
  },
  {
    id: 'hl-mando',
    name: 'HL만도',
    englishName: 'HL Mando',
    logo: '🛡️',
    category: '부품/전동화',
    tagline: '신뢰성과 안전을 책임지는 미래 모빌리티 x-by-Wire 샤시 솔루션 선도기업',
    description: '조향(Steering), 제동(Braking), 현가(Suspension) 시스템 및 자율주행 ADAS 레이더 센서를 생산하는 글로벌 샤시 부품 선도기업입니다.',
    headquarters: '경기도 평택시 포승읍 포승공단로 32',
    keyBusiness: ['Steer-by-Wire(전동식 자유조향) 시스템', 'Brake-by-Wire(통합 전동 전자제동 IDB)', 'ADAS 레이더/카메라 센서 모듈', '전동 캘리퍼 브레이크'],
    keyProducts: ['SbW 조향 액추에이터', '통합 전자제동장치 IDB 2', '전방 중장거리 레이더 센서'],
    keyTechnologies: ['SMT 표면실장 라인', '클린룸 자동 조립', '하드웨어 인더 루프(HILs) 전수 시험', '레이더 안테나 RF 튜닝'],
    isDemoSample: true,
    nodes: [
      {
        id: 'mando-p1',
        name: 'ECU 보드 SMT 고밀도 표면실장',
        category: 'parts_module',
        shortDesc: '차량 제어용 고신뢰성 인쇄회로기판(PCB)에 초소형 칩과 MCU를 초고속 자동 실장',
        order: 1,
        mainTasks: ['솔더 페이스트 인쇄', '초고속 칩 마운팅', '리플로우 솔더링', '3D AOI 광학 자동 검사'],
        equipment: ['스크린 프린터', '고속 칩마운터', '3D AOI(Automated Optical Inspection)'],
        appliedTech: ['3D 비전 솔더 볼륨 측정', 'SPI(솔더 인쇄 검사) 피드백 자동 보정'],
        relatedJobs: ['SMT 생산기술', '전자회로 품질관리'],
        qualityMetrics: [{ name: '실장 불량률', target: '≤ 0.5 ppm', description: '차량용 전자 제어기 무결성' }],
        relatedTrendKeywords: ['머신비전 AI 품질검사', '스마트팩토리'],
        badgeColor: 'blue'
      },
      {
        id: 'mando-p2',
        name: 'x-by-Wire 액추에이터 클린룸 조립 및 EOL 검사',
        category: 'inspection',
        shortDesc: '기계적 연결 없이 순수 전기 신호로 구동되는 조향/제동 액추에이터의 정밀 조립 및 이중화 안전 검사',
        order: 2,
        mainTasks: ['모터 및 감속 메커니즘 조립', '이중화(Redundancy) 통신 회로 테스트', '응답 속도 및 최대 제동/조향력 실측'],
        equipment: ['항온항습 클린룸 설비', '다축 다이나믹 부하시험 벤치', 'CAN FD 진단기'],
        appliedTech: ['ISO 26262 ASIL-D 기능안전 검증', '실시간 제어 지연 측정'],
        relatedJobs: ['샤시 생산기술', '기능안전 엔지니어'],
        qualityMetrics: [{ name: '응답 지연 시간', target: '≤ 15ms', description: '비상 제동 시 초고속 반응' }],
        relatedTrendKeywords: ['제조DX', '전기차 배터리/PE시스템 생산기술'],
        badgeColor: 'emerald'
      }
    ],
    edges: [
      { id: 'md-e1-2', source: 'mando-p1', target: 'mando-p2', label: 'SMT 보드 액추에이터 실장' }
    ]
  },
  {
    id: 'seoyon-ehwa',
    name: '서연이화',
    englishName: 'Seoyon E-Hwa',
    logo: '✨',
    category: '부품/전동화',
    tagline: '미래 모빌리티 실내 공간의 가치를 높이는 친환경 스마트 내장 부품 전문 기업',
    description: '도어트림, 콘솔, 크래시패드, 시트 등 자동차 실내 감성 품질과 친환경 경량화 소재를 생산하는 내장재 전문 기업입니다.',
    headquarters: '경기도 안양시 동안구 시민대로 387',
    keyBusiness: ['도어트림(Door Trim) 시스템', '크래시패드(Crash Pad)', '친환경 바이오 플라스틱 소재', '스마트 감성 서피스(엠비언트 라이팅 내장)'],
    keyProducts: ['제네시스/아이오닉 도어트림', '센터콘솔 어셈블리', '스마트 콕핏 인테리어'],
    keyTechnologies: ['대형 박육 사출성형', 'IMG 진공 성형 기술', '초음파 융착(Ultrasonic Welding)', '감성 조명 광학 검사'],
    isDemoSample: true,
    nodes: [
      {
        id: 'seoyon-p1',
        name: '친환경 경량 복합소재 사출성형 (Injection Molding)',
        category: 'machining',
        shortDesc: '천연 섬유 바이오 플라스틱을 금형에 고압 주입하여 경량 도어트림 골격 성형',
        order: 1,
        mainTasks: ['수지 건조 및 원료 배합', '사출기 고압 주입 및 냉각', '취출 로봇 자동 추출'],
        equipment: ['3,000톤급 초정밀 전동 사출기', '서보 취출 로봇', '금형 온도 조절기'],
        appliedTech: ['사출 내압 센싱 모니터링', '박육(Thin-wall) 성형 기술', '수축/변형 CAE 시뮬레이션'],
        relatedJobs: ['사출 생산기술', '고분자 소재 엔지니어'],
        qualityMetrics: [{ name: '중량 편차', target: '±1.0%', description: '경량화 균일도 달성' }],
        relatedTrendKeywords: ['스마트팩토리', '디지털 트윈'],
        badgeColor: 'blue'
      },
      {
        id: 'seoyon-p2',
        name: '표면 진공 융착 및 감성 조명 조립',
        category: 'parts_module',
        shortDesc: '인조가죽/패브릭 표면 진공 압공 성형 및 앰비언트 LED 조명 모듈 결합 후 감성 품질 검사',
        order: 2,
        mainTasks: ['초음파 융착 접합', '엠비언트 광섬유 배선 조립', '비전 표면 주름 및 들뜸 검사'],
        equipment: ['진공 압공 성형기', '초음파 융착기', '색차계 및 표면 광학 카메라'],
        appliedTech: ['비전 결함 검출 딥러닝', '조도 및 색온도 광학 균일도 계측'],
        relatedJobs: ['내장 조립기술', '감성 품질관리'],
        qualityMetrics: [{ name: '표면 주름 불량률', target: '0 %', description: '프리미엄 감성 품질 유지' }],
        relatedTrendKeywords: ['머신비전 AI 품질검사', '스마트팩토리'],
        badgeColor: 'emerald'
      }
    ],
    edges: [
      { id: 'sy-e1-2', source: 'seoyon-p1', target: 'seoyon-p2', label: '성형 골격 표면 트리밍' }
    ]
  }
];

export const TECH_TRENDS_DATA: TechnologyTrend[] = [
  {
    id: 'trend-smart-factory',
    name: '스마트팩토리 (Smart Factory)',
    category: '스마트팩토리',
    mentionFrequency: 96,
    growthRate: '+38% YoY',
    relatedJobsCount: 184,
    companies: ['현대자동차', '기아', '현대오토에버', '현대모비스', '현대위아'],
    appliedProcesses: ['프레스 공정', '차체 공정', '도장 공정', '의장 공정', '배터리 모듈'],
    keySkills: ['PLC 인터페이스', 'OPC-UA/Modbus', 'MES 운영', '시계열 센서 모니터링', '설비 가동률(OEE) 최적화'],
    trendHistory: [
      { period: '2024 상반기', count: 68, jobIndex: 72 },
      { period: '2024 하반기', count: 81, jobIndex: 88 },
      { period: '2025 상반기', count: 94, jobIndex: 110 },
      { period: '2025 하반기', count: 125, jobIndex: 145 },
      { period: '2026 상반기', count: 158, jobIndex: 184 }
    ],
    importance: '최우선',
    description: '생산 전 공정을 센서 및 IoT로 연결하여 실시간 데이터를 수집하고, 생산성을 자율적으로 최적화하는 미래형 제조 인프라.'
  },
  {
    id: 'trend-sdf',
    name: 'Software Defined Factory (SDF)',
    category: 'Software Defined Factory (SDF)' as any,
    mentionFrequency: 91,
    growthRate: '+72% YoY',
    relatedJobsCount: 146,
    companies: ['현대오토에버', '현대자동차', '기아'],
    appliedProcesses: ['PBV 유연 조립 셀', '의장 라인 지능화', '중앙 관제 클라우드'],
    keySkills: ['Kubernetes/Docker', '마이크로서비스 아키텍처', 'Kafka 스트리밍', '클라우드-에지 협업', '이벤트 드리븐 시스템'],
    trendHistory: [
      { period: '2024 상반기', count: 28, jobIndex: 35 },
      { period: '2024 하반기', count: 49, jobIndex: 62 },
      { period: '2025 상반기', count: 78, jobIndex: 95 },
      { period: '2025 하반기', count: 112, jobIndex: 128 },
      { period: '2026 상반기', count: 146, jobIndex: 165 }
    ],
    importance: '최우선',
    description: '하드웨어 설비 중심의 공장을 소프트웨어와 알고리즘으로 동적 제어하여 다차종 유연 생산과 무중단 라인 변경을 실현하는 차세대 패러다임.'
  },
  {
    id: 'trend-digital-twin',
    name: '디지털 트윈 & 가상 시운전',
    category: '제조DX',
    mentionFrequency: 88,
    growthRate: '+45% YoY',
    relatedJobsCount: 129,
    companies: ['현대자동차', '현대오토에버', '기아', '현대위아'],
    appliedProcesses: ['차체 라인 신규 셋업', '프레스 금형 시뮬레이션', '공장 레이아웃 설계'],
    keySkills: ['3D CAD 메쉬 변환', 'Unity/Unreal 엔진', '물리 엔진 시뮬레이션', '가상 PLC(SiL/HiL) 연동'],
    trendHistory: [
      { period: '2024 상반기', count: 42, jobIndex: 50 },
      { period: '2024 하반기', count: 61, jobIndex: 75 },
      { period: '2025 상반기', count: 85, jobIndex: 98 },
      { period: '2025 하반기', count: 104, jobIndex: 118 },
      { period: '2026 상반기', count: 129, jobIndex: 140 }
    ],
    importance: '핵심',
    description: '실제 공장 가동 전에 가상 공간에서 라인을 사전 시운전하여 셋업 기간을 30% 이상 단축하고 공정 간섭을 사전에 방지.'
  },
  {
    id: 'trend-machine-vision',
    name: 'AI 머신비전 인라인 품질검사',
    category: '품질/비전',
    mentionFrequency: 94,
    growthRate: '+52% YoY',
    relatedJobsCount: 172,
    companies: ['현대자동차', '현대모비스', '현대오토에버', 'HL만도', '서연이화'],
    appliedProcesses: ['차체 갭/단차 검사', '도장 표면 결함 검사', '배터리 버스바 용접 검사', 'SMT 전자부품 AOI'],
    keySkills: ['OpenCV/PyTorch', '비지도 이상치 탐지(PatchCore/Autoencoder)', '산업용 카메라 광학 세팅', 'TensorRT 모델 경량화'],
    trendHistory: [
      { period: '2024 상반기', count: 55, jobIndex: 68 },
      { period: '2024 하반기', count: 79, jobIndex: 94 },
      { period: '2025 상반기', count: 108, jobIndex: 124 },
      { period: '2025 하반기', count: 139, jobIndex: 151 },
      { period: '2026 상반기', count: 172, jobIndex: 189 }
    ],
    importance: '최우선',
    description: '인간 검사원의 육안에 의존하던 검사를 딥러닝 기반 2D/3D 광학 카메라로 전환하여 0.1초 내 마이크로 결함까지 전수 검출.'
  },
  {
    id: 'trend-pdm',
    name: '설비 예지보전 (PdM)',
    category: '제조DX',
    mentionFrequency: 85,
    growthRate: '+33% YoY',
    relatedJobsCount: 118,
    companies: ['현대자동차', '현대모비스', '현대위아', '현대트랜시스'],
    appliedProcesses: ['프레스 서보 모터', '차체 용접 로봇 감속기', '도장 부스 팬 공조', 'CNC 머시닝 스핀들'],
    keySkills: ['고속 푸리에 변환(FFT)', '진동/전류 시계열 분석', '잔여 수명 예측(RUL)', '임계치 기반 경보 시스템'],
    trendHistory: [
      { period: '2024 상반기', count: 48, jobIndex: 55 },
      { period: '2024 하반기', count: 66, jobIndex: 78 },
      { period: '2025 상반기', count: 82, jobIndex: 95 },
      { period: '2025 하반기', count: 99, jobIndex: 108 },
      { period: '2026 상반기', count: 118, jobIndex: 130 }
    ],
    importance: '핵심',
    description: '설비가 완전히 고장 난 후 수리하는 사후보전 대신, 진동·전류·온도 센서의 미세 변화를 분석하여 사전에 부품을 교체함으로써 라인 셧다운 예방.'
  },
  {
    id: 'trend-amr',
    name: '자율이송물류 (AMR/AGV)',
    category: '자동화',
    mentionFrequency: 89,
    growthRate: '+48% YoY',
    relatedJobsCount: 135,
    companies: ['현대자동차', '현대모비스', '기아', '현대위아'],
    appliedProcesses: ['의장 부품 키팅 공급', '배터리팩 서브라인 이송', '완성차 출고 물류'],
    keySkills: ['SLAM 자율주행', 'ROS2/C++', 'Fleet Management 군집 제어', 'LiDAR/초음파 장애물 회피'],
    trendHistory: [
      { period: '2024 상반기', count: 39, jobIndex: 45 },
      { period: '2024 하반기', count: 58, jobIndex: 70 },
      { period: '2025 상반기', count: 84, jobIndex: 99 },
      { period: '2025 하반기', count: 108, jobIndex: 121 },
      { period: '2026 상반기', count: 135, jobIndex: 152 }
    ],
    importance: '핵심',
    description: '고정된 레일 없이 라이다와 카메라로 장애물을 스스로 회피하며 부품을 목적지까지 적시 배송하는 스마트팩토리의 동맥.'
  },
  {
    id: 'trend-physical-ai',
    name: 'Physical AI & 협동로봇 자율화',
    category: 'Physical AI',
    mentionFrequency: 82,
    growthRate: '+65% YoY',
    relatedJobsCount: 98,
    companies: ['현대자동차(보스턴다이내믹스 연계)', '현대위아', '기아'],
    appliedProcesses: ['차체 유연 용접', '부품 비정형 피킹', '위험 구역 안전 순찰'],
    keySkills: ['강화학습 기반 로봇 모션 플래닝', '힘/토크(F/T) 센서 피드백 제어', '휴머노이드/4족보행 로봇 제어'],
    trendHistory: [
      { period: '2024 상반기', count: 18, jobIndex: 22 },
      { period: '2024 하반기', count: 32, jobIndex: 41 },
      { period: '2025 상반기', count: 51, jobIndex: 65 },
      { period: '2025 하반기', count: 74, jobIndex: 82 },
      { period: '2026 상반기', count: 98, jobIndex: 110 }
    ],
    importance: '성장',
    description: '물리적 환경을 스스로 인지하고 유연하게 대처하는 지능형 피지컬 AI 로봇이 고난도 제조 현장 작업 수행.'
  },
  {
    id: 'trend-ev-battery',
    name: '전기차 배터리/PE 생산기술',
    category: '전동화/배터리',
    mentionFrequency: 93,
    growthRate: '+41% YoY',
    relatedJobsCount: 162,
    companies: ['현대자동차', '현대모비스', '기아'],
    appliedProcesses: ['BSA 셀 적층', '초정밀 레이저 버스바 용접', 'Hi-Pot 고전압 시험'],
    keySkills: ['파이버 레이저 용접 제어', 'BMS 통신 프로토콜', '헬륨 리크 검사', '열관리 갭필러 디스펜싱'],
    trendHistory: [
      { period: '2024 상반기', count: 62, jobIndex: 75 },
      { period: '2024 하반기', count: 85, jobIndex: 102 },
      { period: '2025 상반기', count: 115, jobIndex: 135 },
      { period: '2025 하반기', count: 138, jobIndex: 154 },
      { period: '2026 상반기', count: 162, jobIndex: 180 }
    ],
    importance: '최우선',
    description: '내연기관 엔진 조립 라인을 대체하여 수백 볼트 고전압 배터리와 모터 구동계를 화재 위험 없이 안전하게 양산하는 핵심 생산기술.'
  }
];

export const SAMPLE_JOB_POSTINGS: JobPosting[] = [
  {
    id: 'job-hmc-dx',
    companyId: 'hyundai-motor',
    companyName: '현대자동차',
    title: '[생산기술본부] 제조DX 및 스마트팩토리 솔루션 엔지니어',
    department: '생산기술본부 제조솔루션부',
    experienceLevel: '신입/인턴',
    location: '울산 / 남양연구소',
    deadline: '2026-11-30',
    rawText: `[조직 소개]
현대자동차 생산기술본부는 미래 모빌리티 생산 라인의 지능화와 스마트팩토리 전환을 선도하고 있습니다. 차세대 완성차 및 전기차(EV) 전용 스마트 제조 시스템을 구축하며, 현장의 센서 및 설비 데이터를 수집·분석하여 공정 최적화 및 품질 혁신을 추진합니다.

[주요 업무]
- 스마트팩토리 설비(PLC, 로봇, 비전) 인터페이스 및 실시간 데이터 수집 파이프라인 개발
- 인라인 머신비전 검사 및 딥러닝 기반 불량 검출 알고리즘 검증 및 현장 적용
- 제조 현장 공정 사이클타임(C/T) 분석 및 설비 가동 효율(OEE) 개선 과제 수행
- 디지털 트윈 및 가상 시운전(Virtual Commissioning) 시스템 구축 지원

[지원 자격 (필수)]
- 컴퓨터공학, 기계공학, 전자공학, 산업공학 또는 유관 이공계 학사 이상 (졸업예정자 포함)
- Python, C++, Java 중 1개 이상의 언어로 데이터 처리 또는 시스템 개발 가능자
- SQL을 이용한 데이터베이스 쿼리 및 기초 데이터 분석 역량 보유자
- 제조업 및 생산현장의 문제 해결에 열정을 가진 분

[우대 사항]
- 스마트팩토리, 머신비전, IoT 관련 프로젝트 또는 인턴십 수행 경험자
- 산업용 통신(OPC-UA, MQTT, Modbus) 또는 PLC 기본 구조 이해 보유자
- 딥러닝 프레임워크(PyTorch, OpenCV)를 활용한 영상 분석 경험자
- 클라우드 또는 Docker 컨테이너 환경 활용 경험자`,
    mainDuties: [
      '스마트팩토리 설비(PLC, 로봇, 비전) 인터페이스 및 실시간 데이터 수집 파이프라인 개발',
      '인라인 머신비전 검사 및 딥러닝 기반 불량 검출 알고리즘 검증 및 현장 적용',
      '제조 현장 공정 사이클타임(C/T) 분석 및 설비 가동 효율(OEE) 개선 과제 수행',
      '디지털 트윈 및 가상 시운전 시스템 구축 지원'
    ],
    requiredQualifications: [
      '컴퓨터공학, 기계공학, 전자공학, 산업공학 또는 유관 이공계 학사 이상',
      'Python, C++, Java 중 1개 이상 프로그래밍 가능자',
      'SQL 데이터베이스 쿼리 및 기초 시계열 데이터 분석 역량',
      '제조 현장 문제 해결 의지'
    ],
    preferredQualifications: [
      '스마트팩토리, 머신비전, IoT 프로젝트 또는 인턴 경험자',
      '산업용 통신(OPC-UA, MQTT, Modbus) 및 PLC 구조 이해',
      'PyTorch, OpenCV 활용 이미지 이상 감지 경험',
      'Docker 컨테이너 활용 능력'
    ],
    coreTechnologies: ['Python', 'SQL', 'OPC-UA', 'OpenCV', 'PyTorch', 'Docker', 'MES'],
    competencyKeywords: ['제조 데이터 분석', '머신비전 이상 감지', '산업용 통신', '공정 최적화', '현장 트러블슈팅'],
    summary: '완성차 생산기술본부에서 설비 데이터 파이프라인 구축 및 비전 품질 알고리즘 현장 적용을 담당할 제조DX 신입 엔지니어 채용.'
  },
  {
    id: 'job-autoever-mes',
    companyId: 'hyundai-autoever',
    companyName: '현대오토에버',
    title: '[스마트팩토리] 차세대 MES 및 SDF 플랫폼 백엔드 개발자',
    department: '스마트팩토리사업부 SDF플랫폼팀',
    experienceLevel: '신입',
    location: '서울 양재 / 화성',
    deadline: '2026-11-25',
    rawText: `[직무 소개]
현대오토에버는 현대자동차그룹의 글로벌 생산기지를 지탱하는 차세대 제조실행시스템(MES)과 Software Defined Factory(SDF) 플랫폼을 개발합니다. 공장 내 설비와 상위 비즈니스 로직을 연결하는 고가용성 마이크로서비스 백엔드를 구축합니다.

[주요 업무]
- 차세대 MES 코어 마이크로서비스(생산 지시, 추적성 트래킹, 자재 흐름) 개발
- Apache Kafka를 활용한 초당 수천 건의 제조 설비 이벤트 실시간 스트리밍 처리
- Spring Boot 기반의 고성능 RESTful API 및 WebSocket 실시간 통신 서버 개발
- 스마트 물류(AMR) 관제 플랫폼 및 디지털 트윈 시스템과의 인터페이스 연동

[지원 자격]
- 전산학/컴퓨터공학 또는 소프트웨어 관련 전공 학사 이상
- Java / Kotlin 및 Spring Framework(Spring Boot)에 대한 이해와 개발 역량
- 관계형 데이터베이스(RDBMS) 설계 및 트랜잭션(ACID) 관리에 대한 기본 지식
- 자료구조, 알고리즘, 컴퓨터 네트워크, 운영체제 기본 전공 지식

[우대 사항]
- Apache Kafka, Redis, RabbitMQ 등 메시징/캐시 솔루션 활용 경험
- Docker, Kubernetes 기반의 마이크로서비스 아키텍처(MSA) 프로젝트 경험
- 스마트팩토리 또는 물류 도메인 시스템 연동 경험`,
    mainDuties: [
      '차세대 MES 코어 마이크로서비스(생산 지시, Lot 추적성, 자재 흐름) 개발',
      'Apache Kafka 기반 대규모 설비 이벤트 실시간 스트리밍 처리 파이프라인 구축',
      'Spring Boot 기반 고성능 RESTful API 및 웹소켓 인터페이스 개발',
      'AMR 스마트 물류 관제 및 디지털 트윈 연동 백엔드 구축'
    ],
    requiredQualifications: [
      '컴퓨터공학 또는 SW 관련 전공 학사 이상',
      'Java/Spring Boot 기반 백엔드 개발 역량',
      'RDBMS 설계 및 트랜잭션 관리 이해',
      'CS 기초(자료구조, 알고리즘, 네트워크, OS) 충실한 자'
    ],
    preferredQualifications: [
      'Apache Kafka, Redis 등 메시지 큐/캐시 활용 경험',
      'Docker, Kubernetes 환경 MSA 프로젝트 경험',
      '제조/스마트팩토리 도메인 이해'
    ],
    coreTechnologies: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker', 'Kubernetes'],
    competencyKeywords: ['백엔드 아키텍처', '실시간 스트리밍', '트랜잭션 정합성', '마이크로서비스', '도메인 모델링'],
    summary: '현대차그룹 글로벌 스마트팩토리의 중추인 MES와 SDF 플랫폼을 구축할 서버/백엔드 소프트웨어 엔지니어 채용.'
  },
  {
    id: 'job-mobis-pe',
    companyId: 'hyundai-mobis',
    companyName: '현대모비스',
    title: '[전동화BU] 배터리 시스템(BSA) 생산기술 및 EOL 검사 엔지니어',
    department: '전동화생산기술실 전동화공정기술팀',
    experienceLevel: '신입',
    location: '울산 / 충주 / 의왕연구소',
    deadline: '2026-12-05',
    rawText: `[직무 설명]
현대모비스 전동화BU는 친환경 모빌리티의 심장인 배터리 시스템 어셈블리(BSA)와 구동 모터를 양산하는 핵심 부품 공정을 설계하고 기술을 개발합니다.

[주요 업무]
- 배터리 셀 적층, 버스바 레이저 용접 및 케이싱 조립 공정 라인 설계
- 배터리팩 고전압 EOL(Hi-Pot, OCV, BMS 통신) 전기적 안전성 검사 라인 셋업
- 양산 라인 수율 분석 및 불량 원인 분석을 통한 공정 개선 활동
- 레이저 용접 품질 실시간 모니터링 시스템(LWM) 운영

[필수 자격]
- 전기전자공학, 기계공학, 제어계측공학 학사 이상
- 2차전지 배터리 기본 구조 및 전기 회로/고전압 시스템에 대한 전공 지식
- 공학적 데이터 분석 툴(MATLAB, Python 등) 활용 가능자

[우대 사항]
- 배터리 관련 전공 실험, 프로젝트 또는 학부연구생 수행 경험자
- 레이저 가공 또는 용접 품질 관련 지식 보유자
- 6시그마, 공정능력지수(Cpk) 분석 경험자`,
    mainDuties: [
      '배터리 셀 적층 및 버스바 레이저 용접 공정 셋업 및 최적화',
      '고전압 EOL(Hi-Pot, 절연저항, BMS) 검사 시스템 검증',
      '양산 라인 Cpk 분석 및 수율 개선 과제 주도',
      '실시간 레이저 용접 모니터링 시스템 운영'
    ],
    requiredQualifications: [
      '전기전자, 기계, 제어공학 학사 이상',
      '배터리 구조 및 고전압 회로 지식',
      'Python/MATLAB 공학 데이터 분석 역량'
    ],
    preferredQualifications: [
      '배터리팩/셀 관련 프로젝트 또는 학부연구생 경험',
      '레이저 용접 및 접합 메커니즘 이해',
      'Cpk/6시그마 통계적 공정관리 지식'
    ],
    coreTechnologies: ['Python', 'MATLAB', 'Hi-Pot Testing', 'Laser Welding', 'CAN', 'Minitab'],
    competencyKeywords: ['배터리 생산기술', '고전압 안전성', '레이저 접합', '통계적 공정관리', '수율 혁신'],
    summary: '친환경 전기차 배터리팩(BSA) 생산 라인 설계 및 고전압 전기 검사를 총괄할 전동화 생산기술 엔지니어 채용.'
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: '김모빌리티',
  university: '한국기술대학교',
  major: '컴퓨터공학부',
  doubleMajor: '기계제어공학 복수전공',
  academicYear: '4학년 2학기 (졸업예정)',
  graduationDate: '2027년 2월 예정',
  targetJobRoles: ['스마트제조/제조DX 엔지니어', '생산기술 엔지니어', '스마트팩토리 백엔드 SW'],
  targetCompanies: ['현대자동차', '현대오토에버', '현대모비스', '기아'],
  skills: [
    'Python',
    'C/C++',
    'Java',
    'SQL (PostgreSQL)',
    'PyTorch',
    'OpenCV',
    'MQTT / OPC-UA 기초',
    'Docker',
    'FastAPI / Spring Boot'
  ],
  certifications: ['정보처리기사 (취득)', 'SQLD (취득)', 'TOEIC Speaking AL (170)'],
  completedCourses: [
    '운영체제 및 컴퓨터 아키텍처',
    '데이터베이스 시스템 및 SQL 최적화',
    '산업용 제어 시스템 및 PLC 실습',
    '머신러닝 및 컴퓨터비전 기초',
    '제조공학 및 생산관리론'
  ],
  projects: [
    {
      id: 'proj-1',
      title: '스마트팩토리 센서 데이터 기반 회전기기 결함 이상 감지 시스템',
      period: '2026.03 ~ 2026.08 (캡스톤 디자인)',
      purpose: '공장 모터 및 베어링 설비의 돌발 셧다운을 방지하기 위한 실시간 진동 데이터 수집 및 딥러닝 기반 이상 징후 조기 감지',
      role: '팀장 & 데이터 파이프라인/모델링 리드 (3인 팀)',
      techStack: ['Python', 'PyTorch', 'FastAPI', 'MQTT', 'InfluxDB', 'Grafana', 'Raspberry Pi'],
      features: [
        '가속도 센서(MPU-6050)를 부착하여 모터의 3축 고주파 진동 데이터(1,000Hz) 실시간 샘플링',
        '에지(Raspberry Pi)에서 MQTT 프로토콜로 브로커에 전송 및 InfluxDB 시계열 데이터베이스 적재',
        '고속 푸리에 변환(FFT)으로 주파수 도메인 스펙트럼 추출 후 Autoencoder 비지도 이상 감지 모델 구축',
        '이상치 점수가 임계치를 초과할 경우 웹소켓 기반 실시간 경보 대시보드 팝업'
      ],
      problemSolved: '초기 단순 threshold 방식에서는 정상적인 시동 부하 시 잦은 오경보(False Alarm)가 발생함. 정상 운전 구간의 주파수 대역별 특성을 Autoencoder 재구성 오차(Reconstruction Error)로 정량화하여 오경보율을 82% 감소시킴.',
      actionTaken: '센서 노이즈 필터링을 위한 이동평균 및 칼만 필터를 에지 단에 구현하고, 인퍼런스 지연시간을 줄이기 위해 ONNX Runtime으로 모델을 경량화함.',
      resultMetric: '결함 시나리오(베어링 결함, 축 정렬 불량) 대상 이상 감지 F1-Score 0.94 달성, 추론 지연 45ms 유지.',
      learnings: '제조 현장의 시계열 데이터 특성(노이즈, 정상 데이터 압도적 다수)을 체감하고, 비지도 이상탐지와 경량 파이프라인 설계 역량을 확보함.'
    },
    {
      id: 'proj-2',
      title: '컴퓨터 비전을 활용한 모빌리티 차체 패널 표면 스크래치 결함 검출 파이프라인',
      period: '2025.09 ~ 2025.12 (산학연계 프로젝트)',
      purpose: '프레스 및 차체 조립 공정에서 발생하는 금속 패널 표면 미세 스크래치 및 덴트(Dent)의 자동 비전 검사 시스템 개발',
      role: '컴퓨터비전 알고리즘 엔지니어',
      techStack: ['Python', 'OpenCV', 'PyTorch', 'PatchCore', 'Flask', 'Docker'],
      features: [
        '산업용 고해상도 카메라 조명 조건 시뮬레이션 환경 구축',
        '양품 이미지 500장만을 이용해 정상 특징 공간을 메모리 뱅크에 구축하는 PatchCore 알고리즘 적용',
        '불량 부위의 픽셀 단위 세그멘테이션 히트맵 생성 및 검출 결과 REST API 연동'
      ],
      problemSolved: '금속 표면의 반사광(Glint)으로 인해 정상 표면이 불량으로 오인식되는 문제 발생. 편광 필터 시뮬레이션 전처리 및 적응형 임계값 알고리즘(CLAHE)을 도입해 반사광 노이즈를 억제함.',
      actionTaken: '불량 데이터가 극히 적은 산업 현실을 반영하여 정상 데이터 기반의 One-Class Classifier를 설계하고 텐서 연산을 배치 단위로 최적화함.',
      resultMetric: '0.3mm 이상의 표면 스크래치 검출률(Recall) 98.2% 달성, 장당 처리 속도 0.08초 달성.',
      learnings: '제조업 품질 관리에서 불량 라벨 부족 문제를 극복하는 비지도 검사 기법과 산업용 광학 전처리의 중요성을 터득함.'
    },
    {
      id: 'proj-3',
      title: '스마트 물류 이송 로봇(AMR) 경로 모니터링 및 실시간 관제 백엔드',
      period: '2025.03 ~ 2025.06 (소프트웨어 공학 과목)',
      purpose: '공장 내 자율이송로봇(AMR)들의 실시간 위치, 배터리 잔량, 미션 상태를 중앙에서 모니터링하고 충돌을 방지하는 관제 서버 구축',
      role: '백엔드 아키텍처 및 API 개발',
      techStack: ['Java', 'Spring Boot', 'PostgreSQL', 'WebSocket', 'Redis', 'Docker'],
      features: [
        '다중 AMR의 실시간 2D 평면 좌표(X, Y) 수집 및 Redis 인메모리 캐싱',
        'WebSocket 프로토콜을 활용해 브라우저 2D 맵에 60fps로 로봇 위치 실시간 동기화',
        '작업 할당 알고리즘을 통한 최단 거리 AMR 디스패칭'
      ],
      problemSolved: '로봇 수 증가 시 데이터베이스 I/O 병목으로 웹소켓 브로드캐스팅이 지연되는 현상 발생. RDBMS 직접 조회를 배제하고 Redis Pub/Sub 구조를 도입하여 부하를 분산시킴.',
      actionTaken: 'Spring Boot의 STOMP 프로토콜을 커스텀 구현하고, 동시성 처리를 위해 ThreadPoolTaskExecutor 튜닝 진행.',
      resultMetric: '동시 접속 20대 로봇 기준 위치 브로드캐스팅 지연 25ms 미만 유지.',
      learnings: '실시간성과 고가용성이 요구되는 제조/물류 백엔드 시스템 설계 역량과 분산 캐시 활용 능력을 기름.'
    }
  ]
};
