import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

import Dashboard from './pages/Dashboard';
import AgencyOS from './pages/AgencyOS';
import AutonomousAgent from './pages/AutonomousAgent';
import Leads from './pages/Leads';
import CRM from './pages/CRM';
import Scraper from './pages/Scraper';
import Outreach from './pages/Outreach';
import Proposals from './pages/Proposals';
import Invoices from './pages/Invoices';
import Projects from './pages/Projects';
import ProjectShowcase from './pages/ProjectShowcase';
import Chatbot from './pages/Chatbot';
import Social from './pages/Social';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ClientPortal from './pages/ClientPortal';
import FreelanceGigs from './pages/FreelanceGigs';
import BondVerificationPage from './pages/BondVerificationPage';
import QuickCheckoutPage from './pages/QuickCheckoutPage';
import PublicInvoicePage from './pages/PublicInvoicePage';
import PublicPartnerJoinPage from './pages/PublicPartnerJoinPage';
import DigitalStorePage from './pages/DigitalStorePage';
import PublicPrototypePage from './pages/PublicPrototypePage';

export default function App() {
  const location = useLocation();
  const isPublicPortal = location.pathname.startsWith('/portal') || location.pathname.startsWith('/verify-bond') || location.pathname.startsWith('/pay') || location.pathname.startsWith('/invoice') || location.pathname.startsWith('/partner-join') || location.pathname.startsWith('/store') || location.pathname.startsWith('/prototype');

  if (isPublicPortal) {
    return (
      <div className="portal-standalone-container" style={{ minHeight: '100vh', background: '#020617' }}>
        <Routes>
          <Route path="/portal" element={<ClientPortal />} />
          <Route path="/portal/:code" element={<ClientPortal />} />
          <Route path="/verify-bond" element={<BondVerificationPage />} />
          <Route path="/verify-bond/:bondNumber" element={<BondVerificationPage />} />
          <Route path="/pay" element={<QuickCheckoutPage />} />
          <Route path="/pay/:slug" element={<QuickCheckoutPage />} />
          <Route path="/store" element={<DigitalStorePage />} />
          <Route path="/prototype" element={<PublicPrototypePage />} />
          <Route path="/prototype/:id" element={<PublicPrototypePage />} />
          <Route path="/invoice" element={<PublicInvoicePage />} />
          <Route path="/invoice/:slug" element={<PublicInvoicePage />} />
          <Route path="/partner-join" element={<PublicPartnerJoinPage />} />
          <Route path="/partner-join/:code" element={<PublicPartnerJoinPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agency" element={<AgencyOS />} />
            <Route path="/autonomous" element={<AutonomousAgent />} />
            <Route path="/freelance" element={<FreelanceGigs />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/scraper" element={<Scraper />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/showcase" element={<ProjectShowcase />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/social" element={<Social />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/portal" element={<ClientPortal />} />
            <Route path="/portal/:code" element={<ClientPortal />} />
            <Route path="/verify-bond" element={<BondVerificationPage />} />
            <Route path="/verify-bond/:bondNumber" element={<BondVerificationPage />} />
            <Route path="/pay" element={<QuickCheckoutPage />} />
            <Route path="/pay/:slug" element={<QuickCheckoutPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
