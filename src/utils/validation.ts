export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'E-post krävs' };
  }
  
  if (trimmed.length > 254) {
    return { isValid: false, error: 'E-post är för lång' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Vänligen ange en giltig e-postadress' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string, fieldName: string): ValidationResult => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { isValid: false, error: `${fieldName} krävs` };
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, error: `${fieldName} måste vara minst 2 tecken` };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, error: `${fieldName} får vara max 50 tecken` };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-ZåäöÅÄÖ\s\-']+$/;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: `${fieldName} innehåller ogiltiga tecken` };
  }
  
  return { isValid: true };
};

export const validateMessage = (message: string): ValidationResult => {
  const trimmed = message.trim();
  
  if (trimmed.length > 500) {
    return { isValid: false, error: 'Meddelandet får vara max 500 tecken' };
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};