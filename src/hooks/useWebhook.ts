import { useCallback } from 'react';

const WEBHOOK_URL = 'https://stefan0987.app.n8n.cloud/webhook/803738bb-c134-4bdb-9720-5b1af902475f';

interface WebhookData {
  [key: string]: any;
}

interface WebhookResponse {
  success: boolean;
  error?: string;
}

export const useWebhook = () => {
  const sendToWebhook = useCallback(async (
    data: WebhookData,
    source: string,
    sessionId?: string
  ): Promise<WebhookResponse> => {
    try {
      const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        source,
        user_agent: navigator.userAgent,
        session_id: sessionId || 'unknown',
        url: window.location.href
      };

      console.log('📤 Sending webhook data:', { source, keys: Object.keys(data) });

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('✅ Webhook sent successfully');
        return { success: true };
      } else {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('❌ Webhook failed:', response.status, errorText);
        return { success: false, error: `HTTP ${response.status}: ${errorText}` };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Webhook error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  return { sendToWebhook };
};