/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProcessFlowView } from './components/process/ProcessFlowView';
import { TechTrendsView } from './components/trends/TechTrendsView';
import { InterviewPrepView } from './components/interview/InterviewPrepView';
import { ExperienceMatchView } from './components/experience/ExperienceMatchView';
import { CareerReportView } from './components/report/CareerReportView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header onOpenSearch={() => setIsSearchOpen(true)} />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'process' && <ProcessFlowView />}
          {activeTab === 'trends' && <TechTrendsView />}
          {activeTab === 'jobs' && <ExperienceMatchView />}
          {activeTab === 'interview' && <InterviewPrepView />}
          {activeTab === 'experience' && <ExperienceMatchView />}
          {activeTab === 'report' && <CareerReportView />}
        </main>
      </div>

      {/* Global Cmd+K / Ctrl+K Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
