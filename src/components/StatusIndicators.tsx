import React from 'react';
import { Shield, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface StatusIndicatorsProps {
  isConnected: boolean;
  isSecureConnection: boolean;
  isSpeaking: boolean;
  connectionStatus?: string;
  lastError?: string | null;
}

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  isConnected,
  isSecureConnection,
  isSpeaking,
  connectionStatus,
  lastError
}) => {
  if (!isConnected && !lastError) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
      {/* Connection Status */}
      {isConnected && (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <Wifi size={14} className="text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">
            Ansluten
          </span>
        </div>
      )}

      {/* Security Status */}
      {isSecureConnection && (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
          <Shield size={14} className="text-blue-600" />
          <span className="text-xs font-medium text-blue-700">
            Säker
          </span>
        </div>
      )}

      {/* Speaking Status */}
      {isSpeaking && (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-purple-700">
            AI talar
          </span>
        </div>
      )}

      {/* Error Status */}
      {lastError && (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
          <AlertTriangle size={14} className="text-red-600" />
          <span className="text-xs font-medium text-red-700">
            Fel
          </span>
        </div>
      )}

      {/* Connection Status Debug (only in development) */}
      {import.meta.env.DEV && connectionStatus && (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
          <span className="text-xs font-mono text-gray-600">
            {connectionStatus}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusIndicators;