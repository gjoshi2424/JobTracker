import dotenv from 'dotenv';

dotenv.config();

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

export const triggerWebhook = async (event: string, application: any) => {
  if (!ZAPIER_WEBHOOK_URL) {
    console.warn('ZAPIER_WEBHOOK_URL is not configured. Skipping webhook trigger.');
    return;
  }

  try {
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
        application,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      console.error(`Failed to trigger Zapier webhook: ${response.statusText}`);
    } else {
      console.log(`Successfully triggered Zapier webhook for event: ${event}`);
    }
  } catch (error) {
    console.error('Error triggering Zapier webhook:', error);
  }
};
