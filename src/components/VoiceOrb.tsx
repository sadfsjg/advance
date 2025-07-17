import React, { useMemo } from 'react';
import { Mic, MicOff, Phone, PhoneOff, AlertCircle } from 'lucide-react';

interface VoiceOrbProps {
  isConnected: boolean;
  isConnecting: boolean;
  isRequestingPermission: boolean;
  isSpeaking: boolean;
  hasPermission: boolean | null;
  connectionAttempts: number;
  lastError?: string | null;
  onCallClick: () => void;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isConnected,
  isConnecting,
  isRequestingPermission,
  isSpeaking,
  hasPermission,
  connectionAttempts,
  lastError,
  onCallClick
}) => {
  // Memoized orb state for performance
  const orbState = useMemo(() => {
    if (lastError) return 'error';
    if (isConnected) return isSpeaking ? 'speaking' : 'connected';
    if (isConnecting || isRequestingPermission) return 'connecting';
    if (hasPermission === false) return 'no-permission';
    return 'idle';
  }, [isConnected, isConnecting, isRequestingPermission, isSpeaking, hasPermission, lastError]);

  // Memoized orb styles for performance
  const orbStyles = useMemo(() => {
    const baseSize = 'w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96';
    const baseClasses = `${baseSize} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden`;
    
    switch (orbState) {
      case 'error':
        return `${baseClasses} bg-gradient-to-br from-red-400 via-red-500 to-red-600 shadow-lg shadow-red-500/30 hover:shadow-red-500/40`;
      case 'speaking':
        return `${baseClasses} bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 animate-pulse`;
      case 'connected':
        return `${baseClasses} bg-gradient-to-br from-blue-400 via-cyan-500 to-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40`;
      case 'connecting':
        return `${baseClasses} bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 shadow-lg shadow-yellow-500/30 animate-pulse`;
      case 'no-permission':
        return `${baseClasses} bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 shadow-lg shadow-gray-500/30`;
      default:
        return `${baseClasses} bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-lg shadow-gray-400/30 hover:shadow-gray-400/40`;
    }
  }, [orbState]);

  // Memoized icon for performance
  const orbIcon = useMemo(() => {
    const iconSize = 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24';
    const iconColor = 'text-white';
    
    switch (orbState) {
      case 'error':
        return <AlertCircle className={`${iconSize} ${iconColor}`} />;
      case 'speaking':
      case 'connected':
        return <PhoneOff className={`${iconSize} ${iconColor}`} />;
      case 'connecting':
        return <Phone className={`${iconSize} ${iconColor}`} />;
      case 'no-permission':
        return <MicOff className={`${iconSize} ${iconColor}`} />;
      default:
        return <Mic className={`${iconSize} ${iconColor}`} />;
    }
  }, [orbState]);

  // Memoized status text
  const statusText = useMemo(() => {
    switch (orbState) {
      case 'error':
        return lastError || 'Ett fel uppstod';
      case 'speaking':
        return 'AI talar...';
      case 'connected':
        return 'Tryck för att avsluta samtalet';
      case 'connecting':
        return connectionAttempts > 0 ? `Ansluter... (försök ${connectionAttempts + 1})` : 'Ansluter till AI-assistent...';
      case 'no-permission':
        return 'Mikrofonbehörighet krävs';
      default:
        return 'Redo att starta';
    }
  }, [orbState, lastError, connectionAttempts]);

  return (
    <div className="flex flex-col items-center space-y-6 sm:space-y-8">
      {/* Main Orb */}
      <div 
        className={orbStyles}
        onClick={onCallClick}
        role="button"
        tabIndex={0}
        aria-label={statusText}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCallClick();
          }
        }}
      >
        {/* Animated background effect */}
        {(orbState === 'speaking' || orbState === 'connecting') && (
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
        )}
        
        {/* Icon */}
        {orbIcon}
      </div>

      {/* Status Text */}
      <div className="text-center max-w-xs sm:max-w-sm lg:max-w-md">
        <p className={`text-sm sm:text-base font-medium ${
          orbState === 'error' ? 'text-red-600' : 'text-gray-700'
        }`}>
          {statusText}
        </p>
        
        {orbState === 'connected' && (
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Samtalet är aktivt och säkert
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceOrb;