import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Instructions from './pages/Instructions';
import Prompts from './pages/Prompts';
import Collections from './pages/Collections';
import Settings from './pages/Settings';
import InstructionDetail from './pages/InstructionDetail';
import PromptDetail from './pages/PromptDetail';
import FlowVisualization from './pages/FlowVisualization';

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/instructions/:id" element={<InstructionDetail />} />
          <Route path="/prompts" element={<Prompts />} />
          <Route path="/prompts/:id" element={<PromptDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/flow" element={<FlowVisualization />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;