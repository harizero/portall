import React from 'react';
import { Building2, ExternalLink } from 'lucide-react';
import { InsuranceCompany } from '../types';
import { insuranceCompanies } from '../data/insuranceCompanies';

interface SidebarProps {
  selectedCompany: string | null;
  onCompanySelect: (companyId: string) => void;
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCompany, onCompanySelect, isCollapsed }) => {
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>Insurance Partners</span>
          </h2>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <Building2 className="w-6 h-6 text-gray-600" />
          </div>
        )}
      </div>

      {/* Company List */}
      <div className="p-2 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
        {insuranceCompanies.map((company: InsuranceCompany) => (
          <button
            key={company.id}
            onClick={() => onCompanySelect(company.id)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 group relative ${
              selectedCompany === company.id
                ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                : 'hover:bg-gray-50 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Company Logo */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzLjUwNTQgMTMuMzE2MSAxMS4yNTI2IDE1LjYyNjhDOC45OTk4MiAxNy45Mzc1IDcuNzUwMDEgMjEuMTYyNiA3Ljc1MDAxIDI0LjVDNy43NTAwMSAyNy44Mzc0IDguOTk5ODIgMzEuMDYyNSAxMS4yNTI2IDMzLjM3MzJDMTMuNTA1NCAzNS42ODM5IDE2LjY4NjMgMzcgMjAgMzdDMjMuMzEzNyAzNyAyNi40OTQ2IDM1LjY4MzkgMjguNzQ3NCAzMy4zNzMyQzMxLjAwMDIgMzEuMDYyNSAzMi4yNSAyNy44Mzc0IDMyLjI1IDI0LjVDMzIuMjUgMjEuMTYyNiAzMS4wMDAyIDE3LjkzNzUgMjguNzQ3NCAxNS42MjY4QzI2LjQ5NDYgMTMuMzE2MSAyMy4zMTM3IDEyIDIwIDEyWiIgZmlsbD0iIzk0QTNBOCIvPgo8L3N2Zz4K';
                  }}
                />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium truncate ${
                      selectedCompany === company.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {company.name}
                    </h3>
                    <ExternalLink className={`w-4 h-4 flex-shrink-0 ml-2 ${
                      selectedCompany === company.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <p className={`text-sm mt-1 truncate ${
                    selectedCompany === company.id ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {company.description}
                  </p>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center mt-2 space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      company.canEmbed ? 'bg-green-400' : 'bg-blue-400'
                    }`} />
                    <span className={`text-xs ${
                      selectedCompany === company.id ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {company.canEmbed ? 'Proxy Ready' : 'Proxy Ready'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {company.name}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;