import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import { useApp } from '../../context/AppContext';
import { COMPANIES_DATA } from '../../data/mockData';
import { ManufacturingProcessNode, Company } from '../../types';
import { CustomProcessNode } from './CustomProcessNode';
import { ProcessDetailDrawer } from './ProcessDetailDrawer';
import { CompanyCompareModal } from './CompanyCompareModal';
import { 
  Building2, 
  GitCompare, 
  Filter, 
  Info, 
  Maximize2, 
  Sparkles,
  ChevronRight,
  Layers,
  Search
} from 'lucide-react';

const nodeTypes = {
  customProcess: CustomProcessNode,
};

export const ProcessFlowView: React.FC = () => {
  const { 
    currentCompany, 
    setSelectedCompanyId, 
    selectedProcessNodeId, 
    setSelectedProcessNodeId 
  } = useApp();

  const [activeJobFilter, setActiveJobFilter] = useState<string>('all');
  const [selectedNode, setSelectedNode] = useState<ManufacturingProcessNode | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState('');

  // Find selected node from AppContext if set
  useEffect(() => {
    if (selectedProcessNodeId) {
      const found = currentCompany.nodes.find((n) => n.id === selectedProcessNodeId);
      if (found) setSelectedNode(found);
    }
  }, [selectedProcessNodeId, currentCompany]);

  // Transform current company's process nodes into React Flow nodes
  const initialNodes: Node[] = useMemo(() => {
    return currentCompany.nodes.map((node, index) => {
      // Position calculation in a clean horizontal flow layout with slight curve
      const isAutoEver = currentCompany.id === 'hyundai-autoever';
      
      let x = index * 340 + 50;
      let y = 180;

      // Special branch layout for AutoEver's IT architecture
      if (isAutoEver) {
        if (index === 0) { x = 60; y = 200; }
        else if (index === 1) { x = 400; y = 200; }
        else if (index === 2) { x = 740; y = 90; } // MES branch
        else if (index === 3) { x = 740; y = 320; } // AI MLOps branch
        else if (index === 4) { x = 1100; y = 200; } // Digital Twin & ERP
      }

      const matchesFilter =
        activeJobFilter === 'all' ||
        node.relatedJobs.some((j) => j.includes(activeJobFilter));

      return {
        id: node.id,
        type: 'customProcess',
        position: { x, y },
        data: {
          node,
          isSelected: selectedNode?.id === node.id,
          onSelect: (selected: ManufacturingProcessNode) => {
            setSelectedNode(selected);
            setSelectedProcessNodeId(selected.id);
          },
        },
        style: {
          opacity: matchesFilter ? 1 : 0.35,
          transition: 'all 0.3s ease',
        },
      };
    });
  }, [currentCompany, selectedNode, activeJobFilter, setSelectedProcessNodeId]);

  const initialEdges: Edge[] = useMemo(() => {
    return currentCompany.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2.5 },
      labelStyle: { fill: '#94a3b8', fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: '#0f172a', fillOpacity: 0.85, rx: 4, ry: 4 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#3b82f6',
        width: 18,
        height: 18,
      },
    }));
  }, [currentCompany]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Keep nodes in sync when company or filter changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Extract all unique job categories for filter
  const allJobRoles = useMemo(() => {
    const set = new Set<string>();
    currentCompany.nodes.forEach((n) => n.relatedJobs.forEach((j) => set.add(j)));
    return Array.from(set);
  }, [currentCompany]);

  // Filter company list in pill bar
  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return COMPANIES_DATA;
    return COMPANIES_DATA.filter((c) =>
      c.name.includes(companySearch.trim()) || c.category.includes(companySearch.trim())
    );
  }, [companySearch]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col bg-slate-950 overflow-hidden select-none">
      {/* Top Control Bar: Company Selector & Filters */}
      <div className="z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-3.5 px-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Company Selector Carousel */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-full scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            기업 선택:
          </span>
          {filteredCompanies.map((comp) => {
            const isSelected = comp.id === currentCompany.id;
            return (
              <button
                key={comp.id}
                onClick={() => {
                  setSelectedCompanyId(comp.id);
                  setSelectedNode(null);
                  setSelectedProcessNodeId(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{comp.logo}</span>
                <span>{comp.name}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-normal ${
                  isSelected ? 'bg-white/20' : 'bg-slate-700 text-slate-400'
                }`}>
                  {comp.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Job Filter & Compare Action */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Job Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={activeJobFilter}
              onChange={(e) => setActiveJobFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">전체 직무 탐색 ({currentCompany.nodes.length}개 공정)</option>
              {allJobRoles.map((role) => (
                <option key={role} value={role}>
                  {role} 관련 공정
                </option>
              ))}
            </select>
          </div>

          {/* Company Compare Button */}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-600/30 to-blue-600/30 hover:from-indigo-600/40 hover:to-blue-600/40 text-blue-300 border border-blue-500/40 rounded-lg transition"
          >
            <GitCompare className="w-3.5 h-3.5 text-blue-400" />
            <span>기업별 공정 비교</span>
          </button>
        </div>
      </div>

      {/* Floating Info & Disclaimer Banner */}
      <div className="absolute top-16 left-6 z-10 max-w-md pointer-events-none">
        <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl pointer-events-auto">
          <div className="flex items-start space-x-2.5">
            <span className="text-2xl">{currentCompany.logo}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-100">{currentCompany.name}</h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                  {currentCompany.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                {currentCompany.tagline}
              </p>
              <div className="mt-2 text-[10px] text-slate-500 flex items-center space-x-1">
                <Info className="w-3 h-3 text-slate-400" />
                <span>공식 공개 기술자료 기반 일반화된 제조공정 예시입니다. 노드를 클릭하면 상세 사양과 면접/기술 연계가 열립니다.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* React Flow Canvas Area */}
      <div className="flex-1 w-full h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.2}
          maxZoom={1.8}
        >
          <Background color="#334155" gap={24} size={1} />
          <Controls 
            className="!bg-slate-900 !border !border-slate-700 !rounded-xl overflow-hidden shadow-xl"
            showInteractive={false}
          />
          <MiniMap
            nodeColor={(n: any) => {
              if (n.data?.isSelected) return '#3b82f6';
              return '#475569';
            }}
            maskColor="rgba(15, 23, 42, 0.7)"
            className="!bg-slate-900 !border !border-slate-700 !rounded-xl overflow-hidden"
          />
        </ReactFlow>
      </div>

      {/* Bottom Process Legend */}
      <div className="z-10 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-2.5 px-6 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-4 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">공정 범례:</span>
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>프레스 (Press)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>차체 (Body)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span>도장 (Paint)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>의장 (Assembly)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>최종검사 (EOL)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>제조IT/SDF 플랫폼</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-500">
          <span>마우스 휠: 확대/축소</span>
          <span>·</span>
          <span>드래그: 캔버스 이동</span>
        </div>
      </div>

      {/* Slide-in Detail Drawer on Node Click */}
      <ProcessDetailDrawer
        node={selectedNode}
        company={currentCompany}
        onClose={() => {
          setSelectedNode(null);
          setSelectedProcessNodeId(null);
        }}
      />

      {/* Company Compare Modal */}
      <CompanyCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        defaultCompanyAId={currentCompany.id}
      />
    </div>
  );
};
