import React, { useState, useCallback } from 'react';
import { User, Mail, Phone, Mic, MicOff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserInfoFormProps {
  onSubmit: (userInfo: { firstName: string; lastName: string; email: string; firstMessage: string }) => void;
  isSubmitting?: boolean;
  onMicrophonePermission?: (hasPermission: boolean) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ 
  onSubmit, 
  isSubmitting = false,
  onMicrophonePermission
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [firstMessage, setFirstMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Förnamn krävs';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'Förnamn måste vara minst 2 tecken';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Efternamn krävs';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Efternamn måste vara minst 2 tecken';
    }

    if (!email.trim()) {
      newErrors.email = 'E-post krävs';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Vänligen ange en giltig e-postadress';
      }
    }

    if (firstMessage.trim().length > 500) {
      newErrors.firstMessage = 'Meddelandet får vara max 500 tecken';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Du måste godkänna villkoren för att fortsätta';
    }

    if (hasPermission === null) {
      newErrors.microphone = 'Mikrofonbehörighet krävs för röstsamtal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [firstName, lastName, email, firstMessage, agreedToTerms, hasPermission]);

  const requestMicrophonePermission = useCallback(async () => {
    if (isRequestingPermission) return;
    
    setIsRequestingPermission(true);
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
      onMicrophonePermission?.(true);
      console.log('✅ Microphone permission granted');
      
      // Clear microphone error if it exists
      if (errors.microphone) {
        setErrors(prev => ({ ...prev, microphone: '' }));
      }
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      setHasPermission(false);
      onMicrophonePermission?.(false);
    } finally {
      setIsRequestingPermission(false);
    }
  }, [isRequestingPermission, onMicrophonePermission, errors.microphone]);

  // Check initial permissions on mount
  React.useEffect(() => {
    const checkPermissions = async () => {
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          const granted = result.state === 'granted';
          setHasPermission(granted);
          onMicrophonePermission?.(granted);
          
          result.addEventListener('change', () => {
            const newGranted = result.state === 'granted';
            setHasPermission(newGranted);
            onMicrophonePermission?.(newGranted);
          });
        } catch (error) {
          console.warn('⚠️ Could not check microphone permissions:', error);
        }
      }
    };

    checkPermissions();
  }, [onMicrophonePermission]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userInfo = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      firstMessage: firstMessage.trim()
    };

    onSubmit(userInfo);
  }, [firstName, lastName, email, validateForm, onSubmit]);

  const handleInputChange = useCallback((field: string, value: string) => {
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'firstMessage':
        setFirstMessage(value);
        break;
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-black mb-2">
            Välkommen till Axie Studio
          </h2>
          <p className="text-gray-600 text-sm">
            Fyll i dina uppgifter för att starta samtalet med vår AI-assistent
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Förnamn"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-black outline-none transition-all text-black placeholder-gray-400 disabled:opacity-50 disabled:bg-gray-50 ${
                  errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                }`}
                autoComplete="given-name"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Efternamn"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-black outline-none transition-all text-black placeholder-gray-400 disabled:opacity-50 disabled:bg-gray-50 ${
                  errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                }`}
                autoComplete="family-name"
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="din@email.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-1 focus:ring-black outline-none transition-all text-black placeholder-gray-400 disabled:opacity-50 disabled:bg-gray-50 ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-black'
                }`}
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* First Message Field */}
          <div>
            <label htmlFor="firstMessage" className="block text-sm font-medium text-gray-700 mb-2">
              Första meddelande till AI-assistenten (valfritt)
            </label>
            <textarea
              id="firstMessage"
              value={firstMessage}
              onChange={(e) => handleInputChange('firstMessage', e.target.value)}
              placeholder="Exempel: 'Hej! Jag vill boka en tid för webbdesign' eller 'Kan du berätta om era tjänster?'"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-black placeholder-gray-400 disabled:opacity-50 disabled:bg-gray-50 resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">
              AI-assistenten kommer att läsa och svara på detta meddelande när samtalet startar
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {firstMessage.length}/500 tecken
            </p>
            {errors.firstMessage && (
              <p className="text-red-600 text-xs mt-1">{errors.firstMessage}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }));
                  }
                }}
                className="mt-1 w-4 h-4 text-black border-gray-300 rounded focus:ring-black focus:ring-1"
                disabled={isSubmitting}
              />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                Genom att fortsätta godkänner du våra{' '}
                <Link 
                  to="/terms" 
                  className="text-black hover:text-gray-700 font-medium underline transition-colors"
                  target="_blank"
                >
                  villkor
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-600 text-xs">{errors.terms}</p>
            )}
          </div>

          {/* Microphone Permission Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  hasPermission === true ? 'bg-emerald-100' : 
                  hasPermission === false ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  {hasPermission === true ? (
                    <Mic size={16} className="text-emerald-600" />
                  ) : hasPermission === false ? (
                    <MicOff size={16} className="text-red-600" />
                  ) : (
                    <Mic size={16} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Mikrofonbehörighet
                  </p>
                  <p className="text-xs text-gray-600">
                    {hasPermission === true ? 'Beviljad - Redo för röstsamtal' :
                     hasPermission === false ? 'Nekad - Krävs för röstfunktion' :
                     'Krävs för AI-röstassistent'}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={requestMicrophonePermission}
                disabled={isRequestingPermission || hasPermission === true || isSubmitting}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  hasPermission === true 
                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                    : hasPermission === false
                    ? 'bg-red-100 hover:bg-red-200 text-red-700'
                    : 'bg-black hover:bg-gray-800 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRequestingPermission ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Begär...</span>
                  </>
                ) : hasPermission === true ? (
                  <>
                    <Mic size={14} />
                    <span>Beviljad</span>
                  </>
                ) : hasPermission === false ? (
                  <>
                    <MicOff size={14} />
                    <span>Försök igen</span>
                  </>
                ) : (
                  <>
                    <Mic size={14} />
                    <span>Aktivera</span>
                  </>
                )}
              </button>
            </div>
            {errors.microphone && (
              <p className="text-red-600 text-xs">{errors.microphone}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || hasPermission !== true}
            className="w-full px-4 py-3 bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Startar samtal...</span>
              </>
            ) : (
              <>
                <Phone size={16} />
                <span>Starta AI-samtal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfoForm;