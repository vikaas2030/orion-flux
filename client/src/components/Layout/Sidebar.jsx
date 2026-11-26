import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/', icon: '⚡', section: 'Main' },
  { label: 'AI Agency OS', path: '/agency', icon: '🏢', section: 'Main', badge: '14 AGENTS' },
  { label: 'Autonomous Agent', path: '/autonomous', icon: '🤖', section: 'Main', badge: '100% AUTO' },
  { label: 'Client VIP Portal', path: '/portal', icon: '🌐', section: 'Main', badge: 'ONLINE' },
  { label: 'Freelance & Gig Hub', path: '/freelance', icon: '💼', section: 'Sales Engine', badge: 'UPWORK/FIVERR' },
  { label: 'Leads Directory', path: '/leads', icon: '👥', section: 'Sales Engine', badge: 'New' },
  { label: 'CRM Pipeline', path: '/crm', icon: '🎯', section: 'Sales Engine' },
  { label: 'Real Client Hunter', path: '/scraper', icon: '🎯', section: 'Automation', badge: 'REAL LEADS' },
  { label: 'Auto Outreach', path: '/outreach', icon: '📧', section: 'Automation' },
  { label: 'AI Proposals', path: '/proposals', icon: '📝', section: 'Business' },
  { label: 'Invoices & Direct UPI', path: '/invoices', icon: '💳', section: 'Business', badge: 'UPI QR' },
  { label: 'Project Tracker & QA', path: '/projects', icon: '📋', section: 'Management' },
  { label: 'Live Projects Runner', path: '/showcase', icon: '🚀', section: 'Management', badge: 'RUN LIVE' },
  { label: 'AI Chatbot', path: '/chatbot', icon: '🤖', section: 'AI Agent' },
  { label: 'Social & Content Studio', path: '/social', icon: '📱', section: 'AI Agent' },
  { label: 'Full Analytics', path: '/analytics', icon: '📊', section: 'Insights' },
  { label: 'Settings', path: '/settings', icon: '⚙️', section: 'Insights' }
];

export default function Sidebar() {
  let currentSection = '';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <div className="logo-text">
          <h1>ORION FLUX</h1>
          <span>SUPER AGENT OS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const showSection = item.section !== currentSection;
          if (showSection) currentSection = item.section;

          return (
            <React.Fragment key={item.path}>
              {showSection && <div className="nav-section-label">{item.section}</div>}
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-profile">
          <div className="user-avatar">OF</div>
          <div className="user-info">
            <h4>Super Admin</h4>
            <span>Pro Automation</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
