import React, { useState } from 'react';
import { ProjectExperience } from '../../types';
import { X, Plus, Rocket, Sparkles } from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: ProjectExperience) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('2026.03 ~ 2026.06');
  const [role, setRole] = useState('팀장 및 알고리즘/백엔드 개발');
  const [purpose, setPurpose] = useState('');
  const [techStackStr, setTechStackStr] = useState('Python, PyTorch, Docker, SQL');
  const [featuresStr, setFeaturesStr] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [resultMetric, setResultMetric] = useState('');
  const [learnings, setLearnings] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: ProjectExperience = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      period: period.trim(),
      role: role.trim(),
      purpose: purpose.trim() || '자동차/제조 현장의 문제를 해결하기 위한 프로젝트',
      techStack: techStackStr.split(',').map((s) => s.trim()).filter(Boolean),
      features: featuresStr ? featuresStr.split('\n').filter(Boolean) : ['기본 파이프라인 개발', '시계열 지표 시각화'],
      problemSolved: problemSolved.trim() || '기존 수작업 모니터링 방식의 지연 및 오차 문제 해결',
      actionTaken: actionTaken.trim() || '에지 게이트웨이 전처리 및 비지도 학습 알고리즘 적용',
      resultMetric: resultMetric.trim() || '이상 감지 F1-Score 0.90 달성, 응답 지연 30% 개선',
      learnings: learnings.trim() || '실제 산업용 데이터의 노이즈 처리와 모델 경량화의 중요성을 체득함'
    };

    onAdd(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                새 프로젝트 / 실무 경험 등록
              </h3>
              <p className="text-xs text-slate-400">
                채용공고 요구역량과 비교 분석 및 STAR 자소서 소재 재구성에 활용됩니다.
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              프로젝트명 *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 산업용 센서 데이터 기반 설비 이상 감지 시스템"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                수행 기간
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="2026.03 ~ 2026.08"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">
                담당 역할
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="팀장 및 파이프라인 개발"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              프로젝트 목적 및 배경
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
              placeholder="프로젝트를 시작하게 된 계기와 해결하고자 했던 현장 문제"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              사용 기술 스택 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={techStackStr}
              onChange={(e) => setTechStackStr(e.target.value)}
              placeholder="Python, PyTorch, InfluxDB, Docker, OPC-UA"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              해결한 구체적 문제 & 본인의 수행 행동 (Action)
            </label>
            <textarea
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              rows={2}
              placeholder="직면했던 기술적 한계나 트레이드오프, 그리고 이를 극복하기 위해 취한 구체적 조치"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">
              정량적 성과 및 결과 (Result Metric)
            </label>
            <input
              type="text"
              value={resultMetric}
              onChange={(e) => setResultMetric(e.target.value)}
              placeholder="예: F1-score 0.94 달성, 추론 지연시간 50ms 미만 유지"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="p-3 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>경험 등록 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
