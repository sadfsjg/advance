import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useConversation } from '@elevenlabs/react';
import VoiceOrb from '../components/VoiceOrb';
import StatusIndicators from '../components/StatusIndicators';
import PermissionWarning from '../components/PermissionWarning';
import UserInfoForm from '../components/UserInfoForm';
import ErrorBoundary from '../components/ErrorBoundary';

// Constants for better performance
const CONNECTION_TIMEOUT = 8000;
const RETRY_ATTEMPTS = 3;
const WEBHOOK_URL = 'https://stefan0987.app.n8n.cloud/webhook/803738bb-c134-4bdb-9720-5b1af902475f';
const STORAGE_KEY = 'axie_studio_user_info';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  firstMessage: string;
}

interface WebhookData {
  [key: string]: any;
  timestamp: string;
  source: string;
}
const HomePage: React.FC = () => {
  // State management with proper typing
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [isSecureConnection, setIsSecureConnection] = useState(false);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Store user info in localStorage when it's set
  useEffect(() => {
    if (userInfo) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
      } catch (error) {
        console.error('❌ Failed to store user info:', error);
      }
      console.log('💾 User info stored locally:', userInfo);
    }
  }, [userInfo]);

  // Load user info from localStorage on mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem(STORAGE_KEY);
    if (storedUserInfo) {
      try {
        const parsed = JSON.parse(storedUserInfo);
        setUserInfo(parsed);
        console.log('📂 User info loaded from localStorage:', parsed);
      } catch (error) {
        console.error('❌ Failed to parse stored user info:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Helper function to send data to webhook
  const sendToWebhook = useCallback(async (data: WebhookData, source: string): Promise<boolean> => {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: source,
          user_agent: navigator.userAgent,
          session_id: callStartTime?.toString() || 'unknown'
        })
      });

      if (response.ok) {
        console.log('✅ Webhook data sent successfully:', { source, dataKeys: Object.keys(data) });
        return true;
      } else {
        console.error('❌ Webhook request failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending data to webhook:', error);
      return false;
    }
  }, []);

  // Helper function to get stored user info safely
  const getStoredUserInfo = useCallback(() => {
    try {
      const storedUserInfo = localStorage.getItem(STORAGE_KEY);
      return storedUserInfo ? JSON.parse(storedUserInfo) : {};
    } catch (error) {
      console.error('❌ Failed to parse stored user info:', error);
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
  }, []);

  // Client tool: get_firstandlastname - Agent provides first and last name, we store and return it
  const get_firstandlastname = useCallback(async (params?: { first_name?: string; last_name?: string }) => {
    console.log('🔧 [CLIENT TOOL] get_firstandlastname called by agent');
    console.log('📥 Agent parameters received:', params ? Object.keys(params) : 'none');
    
    const currentUserInfo = getStoredUserInfo();
    
    // Use actual stored data only
    const actualFirstName = currentUserInfo.firstName || '';
    const actualLastName = currentUserInfo.lastName || '';
    const fullName = `${actualFirstName} ${actualLastName}`.trim();
    const hasCompleteNames = actualFirstName && actualLastName;
    
    console.log('✅ [CLIENT TOOL] Retrieved name data:', { 
      firstName: actualFirstName || '(not provided)', 
      lastName: actualLastName || '(not provided)',
      complete: hasCompleteNames
    });
    
    // Send to webhook
    const webhookSuccess = await sendToWebhook({
      first_name: actualFirstName,
      last_name: actualLastName,
      full_name: fullName,
      has_complete_names: hasCompleteNames,
      tool_called: 'get_firstandlastname',
      call_duration: callStartTime ? Date.now() - callStartTime : 0
    }, 'agent_triggered_get_firstandlastname_tool');
    
    const response = {
      first_name: actualFirstName,
      last_name: actualLastName,
      full_name: fullName,
      has_complete_names: hasCompleteNames,
      success: true,
      message: hasCompleteNames 
        ? `Complete name: ${fullName}` 
        : 'Partial or missing name data',
      webhook_sent: webhookSuccess
    };

    console.log('📤 [CLIENT TOOL] Returning to agent:', response);
    return response;
  }, [sendToWebhook, getStoredUserInfo, callStartTime]);

  // Client tool: get_email - Agent provides email, we store and return it
  const get_email = useCallback(async (params?: { email?: string }) => {
    console.log('🔧 [CLIENT TOOL] get_email called by agent');
    console.log('📥 Agent parameters received:', params ? Object.keys(params) : 'none');
    
    const currentUserInfo = getStoredUserInfo();
    
    // Use actual stored data only
    const actualEmail = currentUserInfo.email || '';
    const emailLength = actualEmail.length;
    
    console.log('✅ [CLIENT TOOL] Retrieved email data:', { 
      email: actualEmail || '(not provided)',
      length: emailLength
    });
    
    // Validate email format if present
    const isValidEmail = actualEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(actualEmail);
    
    // Send to webhook
    const webhookSuccess = await sendToWebhook({
      email: actualEmail,
      email_length: emailLength,
      email_valid: isValidEmail,
      has_email: !!actualEmail,
      tool_called: 'get_email',
      call_duration: callStartTime ? Date.now() - callStartTime : 0
    }, 'agent_triggered_get_email_tool');
    
    const response = {
      email: actualEmail,
      email_length: emailLength,
      email_valid: isValidEmail,
      has_email: !!actualEmail,
      success: true,
      message: actualEmail 
        ? `Email: ${actualEmail}${isValidEmail ? ' (valid)' : ' (invalid format)'}` 
        : 'No email provided',
      webhook_sent: webhookSuccess
    };

    console.log('📤 [CLIENT TOOL] Returning to agent:', response);
    return response;
  }, [sendToWebhook, getStoredUserInfo, callStartTime]);

  // Client tool: get_info - Agent provides complete info, we store and return it
  const get_info = useCallback(async (params?: { email?: string; first_name?: string; last_name?: string }) => {
    console.log('🔧 [CLIENT TOOL] get_info called by agent');
    console.log('📥 Agent parameters received:', params ? Object.keys(params) : 'none');
    
    const currentUserInfo = getStoredUserInfo();
    
    // Use actual stored data only
    const actualFirstName = currentUserInfo.firstName || '';
    const actualLastName = currentUserInfo.lastName || '';
    const actualEmail = currentUserInfo.email || '';
    const actualFirstMessage = currentUserInfo.firstMessage || '';
    const fullName = `${actualFirstName} ${actualLastName}`.trim();
    
    console.log('✅ [CLIENT TOOL] Retrieved complete data:', { 
      firstName: actualFirstName || '(not provided)', 
      lastName: actualLastName || '(not provided)', 
      email: actualEmail || '(not provided)',
      firstMessage: actualFirstMessage ? `present (${actualFirstMessage.length} chars)` : '(not provided)'
    });
    
    // Validate email format if present
    const isValidEmail = actualEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(actualEmail);
    const hasCompleteInfo = actualFirstName && actualLastName && actualEmail && isValidEmail;
    const completionPercentage = [actualFirstName, actualLastName, actualEmail, actualFirstMessage].filter(Boolean).length / 4 * 100;
    
    // Send to webhook
    const webhookSuccess = await sendToWebhook({
      email: actualEmail,
      email_length: actualEmail.length,
      email_valid: isValidEmail,
      first_name: actualFirstName,
      last_name: actualLastName,
      full_name: fullName,
      first_message: actualFirstMessage,
      first_message_length: actualFirstMessage.length,
      complete_info: hasCompleteInfo,
      completion_percentage: completionPercentage,
      tool_called: 'get_info',
      call_duration: callStartTime ? Date.now() - callStartTime : 0
    }, 'agent_triggered_get_info_tool');
    
    const response = {
      email: actualEmail,
      email_length: actualEmail.length,
      email_valid: isValidEmail,
      first_name: actualFirstName,
      last_name: actualLastName,
      full_name: fullName,
      first_message: actualFirstMessage,
      first_message_length: actualFirstMessage.length,
      complete_info: hasCompleteInfo,
      completion_percentage: completionPercentage,
      success: true,
      message: hasCompleteInfo 
        ? `Complete info: ${fullName} (${actualEmail})` 
        : `Partial info (${completionPercentage.toFixed(0)}% complete)`,
      webhook_sent: webhookSuccess
    };

    console.log('📤 [CLIENT TOOL] Returning to agent:', response);
    return response;
  }, [sendToWebhook, getStoredUserInfo, callStartTime]);

  // Client tool: send_first_message - Agent receives the user's preconfigured first message
  const send_first_message = useCallback(async () => {
    console.log('🔧 [CLIENT TOOL] send_first_message called by agent');
    
    const currentUserInfo = getStoredUserInfo();
    
    const firstMessage = currentUserInfo.firstMessage || '';
    const messageLength = firstMessage.length;
    const hasMessage = messageLength > 0;
    const wordCount = hasMessage ? firstMessage.split(/\s+/).length : 0;
    
    console.log('✅ [CLIENT TOOL] Retrieved first message:', { 
      hasMessage,
      length: messageLength,
      wordCount,
      preview: hasMessage ? `"${firstMessage.substring(0, 50)}${messageLength > 50 ? '...' : '}"` : '(not provided)'
    });
    
    // Send to webhook for tracking
    const webhookSuccess = await sendToWebhook({
      first_message: firstMessage,
      message_length: messageLength,
      word_count: wordCount,
      has_message: hasMessage,
      user_name: `${currentUserInfo.firstName || ''} ${currentUserInfo.lastName || ''}`.trim(),
      user_email: currentUserInfo.email || '',
      tool_called: 'send_first_message',
      call_duration: callStartTime ? Date.now() - callStartTime : 0
    }, 'agent_requested_first_message');
    
    const response = {
      message: firstMessage,
      message_length: messageLength,
      word_count: wordCount,
      success: true,
      has_message: hasMessage,
      info: hasMessage 
        ? `User's message (${messageLength} chars, ${wordCount} words): "${firstMessage}"` 
        : 'No first message provided',
      instruction: hasMessage 
        ? 'Respond directly to this user message' 
        : 'No first message - proceed with standard greeting',
      webhook_sent: webhookSuccess
    };

    console.log('📤 [CLIENT TOOL] Returning to agent:', response);
    return response;
  }, [sendToWebhook, getStoredUserInfo, callStartTime]);

  // Memoized agent ID with validation
  const agentId = useMemo(() => {
    const id = import.meta.env.VITE_AXIE_STUDIO_AGENT_ID || import.meta.env.VITE_ELEVENLABS_AGENT_ID;
    if (!id) {
      console.error('❌ Axie Studio Agent ID missing in environment variables');
      setLastError('Agent ID missing in environment variables');
      return null;
    }
    console.log('✅ Axie Studio Agent ID loaded:', `${id.substring(0, 8)}...${id.substring(id.length - 4)}`);
    return id;
  }, []);

  // Enhanced conversation configuration
  const conversation = useConversation({
    clientTools: { 
      get_firstandlastname,
      get_email,
      get_info,
      send_first_message
    },
    onConnect: useCallback(() => {
      console.log('🔗 Successfully connected to Axie Studio AI Assistant');
      console.log('🔧 Available client tools: get_firstandlastname, get_email, get_info, send_first_message');
      
      setIsSecureConnection(true);
      setConnectionAttempts(0);
      setCallStartTime(Date.now());
      setIsStartingCall(false);
      setLastError(null);
      
    }, []),
    onDisconnect: useCallback(() => {
      console.log('🔌 Disconnected from Axie Studio AI Assistant - cleaning up');
      setIsSecureConnection(false);
      setCallStartTime(null);
      setIsStartingCall(false);
      
      // Clear stored user data when call ends
      localStorage.removeItem(STORAGE_KEY);
      setUserInfo(null);
      console.log('🗑️ Local user data cleared after call ended');
    }, []),
    onMessage: useCallback((message) => {
      const messageInfo = {
        type: message.type || 'unknown',
        timestamp: new Date().toISOString()
      };
      
      if (typeof message === 'string') {
        messageInfo.content = message.length > 100 ? `${message.substring(0, 100)}...` : message;
        messageInfo.length = message.length;
      } else if (message && typeof message === 'object') {
        messageInfo.keys = Object.keys(message);
      }
      
      console.log('💬 Agent message received:', messageInfo);
    }, []),
    onError: useCallback((error) => {
      const errorMessage = error?.message || 'Unknown connection error';
      console.error('❌ Connection error:', {
        message: errorMessage,
        timestamp: new Date().toISOString(),
        attempts: connectionAttempts
      });
      
      setLastError(errorMessage);
      
      // Handle specific WebRTC DataChannel errors
      if (errorMessage.includes('DataChannel') || errorMessage.includes('sctp-failure')) {
        console.warn('🔧 WebRTC DataChannel error detected - attempting recovery');
        
        // Force disconnect and clear state
        setIsSecureConnection(false);
        setIsStartingCall(false);
        
        // Try to end current session cleanly
        conversation.endSession().catch(() => {
          console.log('Session cleanup completed');
        });
        
        // Auto-retry with exponential backoff for DataChannel errors
        if (connectionAttempts < RETRY_ATTEMPTS) {
          const retryDelay = Math.min(2000 * Math.pow(2, connectionAttempts), 10000);
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            console.log(`🔄 Retrying connection after DataChannel error (${connectionAttempts + 1}/${RETRY_ATTEMPTS}) in ${retryDelay}ms`);
            startSession();
          }, retryDelay);
        } else {
          console.error('❌ Max retry attempts reached for DataChannel errors');
          setLastError('Connection failed after multiple attempts');
        }
      } else {
        setIsSecureConnection(false);
        setIsStartingCall(false);
        
        // Auto-retry logic for other errors
        if (connectionAttempts < RETRY_ATTEMPTS) {
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            console.log(`🔄 Retrying connection (${connectionAttempts + 1}/${RETRY_ATTEMPTS})`);
            startSession();
          }, 2000);
        } else {
          setLastError('Connection failed after multiple attempts');
        }
      }
    }, [connectionAttempts])
  });

  // Enhanced session management with better error handling
  const startSession = useCallback(async () => {
    if (!agentId) {
      console.error('❌ Cannot start session: Axie Studio Agent ID missing');
      setIsStartingCall(false);
      setLastError('Agent ID missing - check environment configuration');
      return;
    }

    console.log('🚀 Starting Axie Studio session with enhanced WebRTC configuration...');
    setLastError(null);
    
    try {
      // Enhanced session configuration for better WebRTC stability
      const sessionConfig = {
        agentId: agentId,
        connectionType: 'webrtc' as const
      };

      const sessionPromise = conversation.startSession(sessionConfig);

      // Add timeout for connection with better error handling
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Connection timeout after ${CONNECTION_TIMEOUT}ms`)), CONNECTION_TIMEOUT);
      });

      await Promise.race([sessionPromise, timeoutPromise]);
      console.log('✅ Axie Studio session established successfully');
      
    } catch (error) {
      const errorMessage = error?.message || 'Session start failed';
      console.error('❌ Failed to start Axie Studio session:', errorMessage);
      setIsStartingCall(false);
      setLastError(errorMessage);
      
      // Enhanced error handling for WebRTC issues
      if (errorMessage.includes('DataChannel') || errorMessage.includes('timeout')) {
        console.warn('🔧 WebRTC/DataChannel issue detected during session start');
        
        // Clear any existing connection state
        setIsSecureConnection(false);
        
        // Auto-retry with exponential backoff for WebRTC errors
        if (connectionAttempts < RETRY_ATTEMPTS) {
          const retryDelay = Math.min(3000 * Math.pow(2, connectionAttempts), 15000);
          setConnectionAttempts(prev => prev + 1);
          setTimeout(() => {
            console.log(`🔄 Retrying session start after WebRTC error (${connectionAttempts + 1}/${RETRY_ATTEMPTS}) in ${retryDelay}ms`);
            startSession();
          }, retryDelay);
        }
      } else {
        // Auto-retry on other failures
        if (connectionAttempts < RETRY_ATTEMPTS) {
          setConnectionAttempts(prev => prev + 1);
          setTimeout(() => startSession(), 1000);
        }
      }
    }
  }, [agentId, conversation, connectionAttempts]);

  // Optimized microphone permission request with better UX
  const requestMicrophonePermission = useCallback(async () => {
    if (isRequestingPermission) return;
    
    setIsRequestingPermission(true);
    setLastError(null);
    console.log('🎤 Requesting microphone permission...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        }
      });
      
      // Immediately stop the stream to free resources
      stream.getTracks().forEach(track => track.stop());
      
      setHasPermission(true);
      console.log('✅ Microphone permission granted');
    } catch (error) {
      const errorMessage = error?.message || 'Microphone permission denied';
      console.error('❌ Microphone permission error:', errorMessage);
      setHasPermission(false);
      setLastError('Microphone access denied - required for voice chat');
    } finally {
      setIsRequestingPermission(false);
    }
  }, [isRequestingPermission]);

  // Handle user info form submission
  const handleUserInfoSubmit = useCallback(async (info: UserInfo) => {
    console.log('👤 User info submitted:', info);
    setUserInfo(info);
    setIsStartingCall(true);
    setLastError(null);
    
    // Send to webhook using helper function
    await sendToWebhook({
      first_name: info.firstName,
      last_name: info.lastName,
      email: info.email,
      full_name: `${info.firstName} ${info.lastName}`,
      first_message: info.firstMessage,
      first_message_length: info.firstMessage.length,
      word_count: info.firstMessage ? info.firstMessage.split(/\s+/).length : 0,
      action: 'pre_call_form_submission'
    }, 'pre_call_form_submission');
    
    // Start the session
    await startSession();
  }, [sendToWebhook, startSession]);

  // Handle microphone permission callback from form
  const handleMicrophonePermission = useCallback((granted: boolean) => {
    setHasPermission(granted);
    if (!granted) {
      setLastError('Microphone permission required for voice chat');
    } else {
      setLastError(null);
    }
    console.log(`🎤 Microphone permission ${granted ? 'granted' : 'denied'} from form`);
  }, []);

  // Optimized session end with cleanup
  const handleEndSession = useCallback(async () => {
    console.log('🛑 Ending Axie Studio session...');
    setLastError(null);
    
    try {
      await conversation.endSession();
      console.log('✅ Axie Studio session ended successfully');
    } catch (error) {
      console.error('❌ Error ending session:', error?.message || 'Unknown error');
    } finally {
      setIsSecureConnection(false);
      setConnectionAttempts(0);
      // Clear stored user data when session ends
      localStorage.removeItem(STORAGE_KEY);
      setUserInfo(null);
      console.log('🗑️ Local user data cleared after session ended');
      setIsStartingCall(false);
    }
  }, [conversation]);

  // Check initial permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setHasPermission(result.state === 'granted');
          
          result.addEventListener('change', () => {
            setHasPermission(result.state === 'granted');
          });
        } catch (error) {
          console.warn('⚠️ Could not check microphone permissions:', error);
        }
      }
    };

    checkPermissions();
  }, []);

  // Security check for HTTPS
  useEffect(() => {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      console.warn('⚠️ Insecure connection detected. HTTPS recommended for production.');
      setLastError('Insecure connection - HTTPS required for production');
    }
  }, []);

  // Memoized connection status
  const connectionStatus = useMemo(() => {
    const isConnected = conversation.status === 'connected';
    const isConnecting = conversation.status !== 'connected' && conversation.status !== 'disconnected';
    const statusText = conversation.status || 'unknown';
    
    return { isConnected, isConnecting, statusText };
  }, [conversation.status]);

  const { isConnected, isConnecting, statusText } = connectionStatus;

  // Show form if user hasn't submitted info yet and not connected
  if (!userInfo && !isConnected && !isStartingCall) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <UserInfoForm 
          onSubmit={handleUserInfoSubmit}
          isSubmitting={isStartingCall}
          onMicrophonePermission={handleMicrophonePermission}
        />
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center w-full max-w-lg">
          <VoiceOrb
            isConnected={isConnected}
            isConnecting={isConnecting}
            isRequestingPermission={isRequestingPermission}
            isSpeaking={conversation.isSpeaking}
            hasPermission={hasPermission}
            connectionAttempts={connectionAttempts}
            onCallClick={handleEndSession}
          />

          <StatusIndicators
            isConnected={isConnected}
            isSecureConnection={isSecureConnection}
            isSpeaking={conversation.isSpeaking}
          />

          <PermissionWarning hasPermission={hasPermission} />
        </div>
      </div>
    </>
  );
};

export default HomePage;