import React, { useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import PortalFrame from './PortalFrame';

const Dashboard: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <TopBar onToggleSidebar={toggleSidebar} isCollapsed={sidebarCollapsed} />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          selectedCompany={selectedCompany}
          onCompanySelect={handleCompanySelect}
          isCollapsed={sidebarCollapsed}
        />
        
        {/* Portal Frame */}
        <PortalFrame companyId={selectedCompany} />
      </div>
    </div>
  );
};

export default Dashboard;