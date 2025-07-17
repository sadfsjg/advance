// Connection settings
export const CONNECTION_TIMEOUT = 8000;
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY_BASE = 2000;
export const MAX_RETRY_DELAY = 15000;

// Storage keys
export const STORAGE_KEYS = {
  USER_INFO: 'axie_studio_user_info',
  SESSION_DATA: 'axie_studio_session',
  PREFERENCES: 'axie_studio_preferences'
} as const;

// Webhook configuration
export const WEBHOOK_CONFIG = {
  URL: 'https://stefan0987.app.n8n.cloud/webhook/803738bb-c134-4bdb-9720-5b1af902475f',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 2
} as const;

// Audio settings
export const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 48000
} as const;

// Form validation limits
export const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 254,
  MESSAGE_MAX_LENGTH: 500
} as const;

// Client tool sources
export const TOOL_SOURCES = {
  GET_FIRSTNAME_LASTNAME: 'agent_triggered_get_firstandlastname_tool',
  GET_EMAIL: 'agent_triggered_get_email_tool',
  GET_INFO: 'agent_triggered_get_info_tool',
  SEND_FIRST_MESSAGE: 'agent_requested_first_message',
  PRE_CALL_FORM: 'pre_call_form_submission',
  AUTO_POPUP: 'auto_popup_during_call'
} as const;