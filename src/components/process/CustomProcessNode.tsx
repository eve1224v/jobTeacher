import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ManufacturingProcessNode } from '../../types';
import { 
  Wrench, 
  Cpu, 
  Users, 
  Activity, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CustomProcessNodeProps {
  data: {
    node: ManufacturingProcessNode;
    isSelected: boolean;
    onSelect: (node: ManufacturingProcessNode) => void;
  };
}

export const CustomProcessNode: React.FC<CustomProcessNodeProps> = ({ data }) => {
  const { node, isSelected, onSelect } = data;

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'press':
        return {
          border: 'border-blue-500/50',
          activeBorder: 'border-blue-400 ring-4 ring-blue-500/25',
          headerBg: 'from-blue-600/30 to-slate-900',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-400',
        };
      case 'body':
        return {
          border: 'border-indigo-500/50',
          activeBorder: 'border-indigo-400 ring-4 ring-indigo-500/25',
          headerBg: 'from-indigo-600/30 to-slate-900',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400',
        };
      case 'paint':
        return {
          border: 'border-cyan-500/50',
          activeBorder: 'border-cyan-400 ring-4 ring-cyan-500/25',
          headerBg: 'from-cyan-600/30 to-slate-900',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400',
        };
      case 'assembly':
        return {
          border: 'border-amber-500/50',
          activeBorder: 'border-amber-400 ring-4 ring-amber-500/25',
          headerBg: 'from-amber-600/30 to-slate-900',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'inspection':
        return {
          border: 'border-emerald-500/50',
          activeBorder: 'border-emerald-400 ring-4 ring-emerald-500/25',
          headerBg: 'from-emerald-600/30 to-slate-900',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'it_platform':
        return {
          border: 'border-purple-500/50',
          activeBorder: 'border-purple-400 ring-4 ring-purple-500/25',
          headerBg: 'from-purple-600/30 to-slate-900',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
        };
      default:
        return {
          border: 'border-slate-600',
          activeBorder: 'border-blue-400 ring-4 ring-blue-500/25',
          headerBg: 'from-slate-700/30 to-slate-900',
          badgeBg: 'bg-slate-700 text-slate-300 border-slate-600',
          dot: 'bg-slate-400',
        };
    }
  };

  const theme = getCategoryTheme(node.category);

  return (
    <div
      onClick={() => onSelect(node)}
      className={`w-72 bg-slate-900/95 backdrop-blur-md rounded-2xl border transition-all duration-300 shadow-xl overflow-hidden group cursor-pointer ${
        isSelected ? `${theme.activeBorder} node-active-glow scale-[1.02]` : `${theme.border} hover:border-slate-400 hover:shadow-2xl`
      }`}
    >
      {/* Target input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-slate-900 !-left-1.5"
      />

      {/* Node Header */}
      <div className={`p-3 bg-gradient-to-r ${theme.headerBg} border-b border-slate-800 flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${theme.dot} animate-pulse`} />
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-300">
            STEP 0{node.order}
          </span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${theme.badgeBg}`}>
          {node.category.toUpperCase()}
        </span>
      </div>

      {/* Node Body */}
      <div className="p-3.5 space-y-2.5">
        <div>
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition leading-snug">
            {node.name}
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {node.shortDesc}
          </p>
        </div>

        {/* Applied Technologies preview */}
        <div className="pt-1">
          <div className="flex items-center space-x-1 text-[10px] font-semibold text-slate-400 mb-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>핵심 적용 기술</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {node.appliedTech.slice(0, 2).map((tech, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80 truncate max-w-[190px]"
              >
                {tech}
              </span>
            ))}
            {node.appliedTech.length > 2 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/60 text-slate-400">
                +{node.appliedTech.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Related Job roles preview */}
        <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-1 text-slate-400 truncate max-w-[180px]">
            <Users className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate text-[10px]">{node.relatedJobs[0] || '생산기술'}</span>
          </div>
          <span className="text-[10px] text-blue-400 flex items-center group-hover:translate-x-0.5 transition font-medium">
            상세 보기 <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Source output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-slate-900 !-right-1.5"
      />
    </div>
  );
};
