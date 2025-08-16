import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, ExternalLink, Shield, Globe, Loader2 } from 'lucide-react';
import { InsuranceCompany } from '../types';
import { insuranceCompanies } from '../data/insuranceCompanies';
import { ProxyService } from '../services/proxyService';

interface PortalFrameProps {
  companyId: string | null;
}

const PortalFrame: React.FC<PortalFrameProps> = ({ companyId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useProxy, setUseProxy] = useState(true);
  const [portalContent, setPortalContent] = useState<string>('');
  const [portalTitle, setPortalTitle] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const proxyService = ProxyService.getInstance();
  const company = companyId ? insuranceCompanies.find(c => c.id === companyId) : null;

  const handleIframeLoad = () => {
    setLoading(false);
    setError(null);
  };

  const loadPortalContent = async () => {
    if (!company) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await proxyService.fetchPortalContent(company.url);
      
      if (response.success) {
        setPortalContent(response.content);
        setPortalTitle(response.title);
        setCurrentUrl(response.url);
        setError(null);
      } else {
        setError(response.error || 'Failed to load portal content');
      }
    } catch (err) {
      setError('Unable to connect to proxy server. Please ensure the proxy server is running.');
    } finally {
      setLoading(false);
    }
  };

  const refreshFrame = () => {
    if (useProxy) {
      loadPortalContent();
    } else {
      setLoading(true);
      setError(null);
      const iframe = document.getElementById('portal-iframe') as HTMLIFrameElement;
      if (iframe) {
        iframe.src = iframe.src;
      }
    }
  };

  const openInNewTab = () => {
    if (company) {
      window.open(company.url, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleProxyMode = () => {
    setUseProxy(!useProxy);
    setError(null);
    setPortalContent('');
  };

  useEffect(() => {
    if (company) {
      if (useProxy) {
        loadPortalContent();
      } else {
        setLoading(true);
        setError(null);
      }
    }
  }, [companyId, useProxy]);

  if (!company) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Agent Portal</h3>
          <p className="text-gray-600 max-w-md">
            Select an insurance company from the sidebar to access their portal and manage your policies.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-left">
            <h4 className="font-medium text-blue-900 mb-2">Portal Features:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Proxy-based portal access (bypasses iframe restrictions)</li>
              <li>• Secure content rendering with form submission support</li>
              <li>• Single session management</li>
              <li>• Customer and policy information access</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Portal Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="w-10 h-10 rounded-lg object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzLjUwNTQgMTMuMzE2MSAxMS4yNTI2IDE1LjYyNjhDOC45OTk4MiAxNy45Mzc1IDcuNzUwMDEgMjEuMTYyNiA3Ljc1MDAxIDI0LjVDNy43NTAwMSAyNy44Mzc0IDguOTk5ODIgMzEuMDYyNSAxMS4yNTI2IDMzLjM3MzJDMTMuNTA1NCAzNS42ODM5IDE2LjY4NjMgMzcgMjAgMzdDMjMuMzEzNyAzNyAyNi40OTQ2IDM1LjY4MzkgMjguNzQ3NCAzMy4zNzMyQzMxLjAwMDIgMzEuMDYyNSAzMi4yNSAyNy44Mzc0IDMyLjI1IDI0LjVDMzIuMjUgMjEuMTYyNiAzMS4wMDAyIDE3LjkzNzUgMjguNzQ3NCAxNS42MjY4QzI2LjQ5NDYgMTMuMzE2MSAyMy4zMTM3IDEyIDIwIDEyWiIgZmlsbD0iIzk0QTNBOCIvPgo8L3N2Zz4K';
              }}
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{company.name}</h2>
              <p className="text-sm text-gray-600">{company.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Security Status */}
            <button
              onClick={toggleProxyMode}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                useProxy 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
              title={useProxy ? 'Switch to iframe mode' : 'Switch to proxy mode'}
            >
              <Shield className="w-3 h-3" />
              <span>{useProxy ? 'Proxy Mode' : 'Iframe Mode'}</span>
            </button>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
                <span className="text-xs text-blue-700">Loading...</span>
              </div>
            )}

            {/* Status Indicator */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
              error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                error ? 'bg-red-400' : 'bg-green-400'
              }`} />
              <span>{error ? 'Connection Error' : 'Connected'}</span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshFrame}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh portal"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Open in New Tab */}
            <button
              onClick={openInNewTab}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Portal Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading {company.name} portal...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
            <div className="text-center max-w-lg p-6">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Portal Access Issue</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-blue-900 mb-2">Troubleshooting:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure the proxy server is running on port 3001</li>
                    <li>• Check if the insurance portal is accessible</li>
                    <li>• Try switching between proxy and iframe modes</li>
                    <li>• Some portals may require VPN or specific network access</li>
                  </ul>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={refreshFrame}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Retry</span>
                  </button>
                  <button
                    onClick={toggleProxyMode}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Try {useProxy ? 'Iframe' : 'Proxy'} Mode
                  </button>
                  <button
                    onClick={openInNewTab}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open External</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proxy Content */}
        {useProxy && portalContent && !loading && !error && (
          <div className="w-full h-full overflow-auto">
            <div 
              dangerouslySetInnerHTML={{ __html: portalContent }}
              className="w-full h-full"
            />
          </div>
        )}

        {/* Iframe Fallback */}
        {!useProxy && !error && (
      <div className="flex-1 relative">
          <iframe
            id="portal-iframe"
            key={`${companyId}-iframe`}
            src={company.url}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={() => {
              setLoading(false);
              setError('Portal blocked iframe access. Switching to proxy mode...');
              setTimeout(() => setUseProxy(true), 2000);
            }}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            referrerPolicy="strict-origin-when-cross-origin"
            title={`${company.name} Portal`}
          />
        )}
      </div>
    </div>
  );
};

export default PortalFrame;
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading {company.name} portal...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
            <div className="text-center max-w-md p-6">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Portal Access Restricted</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Alternative Options:</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Proxy server integration (coming soon)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Headless browser rendering</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span>Direct API integration</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={refreshFrame}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Retry
                  </button>
                  <button
                    onClick={openInNewTab}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Open Externally
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portal iframe */}
        <iframe
          id="portal-iframe"
          key={`${companyId}-${useProxy ? 'proxy' : 'direct'}`}
          src={company.url}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          referrerPolicy="strict-origin-when-cross-origin"
          title={`${company.name} Portal`}
        />
      </div>
    </div>
  );
};

export default PortalFrame;