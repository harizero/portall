export interface ProxyResponse {
  content: string;
  url: string;
  title: string;
  success: boolean;
  error?: string;
}

export class ProxyService {
  private static instance: ProxyService;
  private baseUrl = 'http://localhost:3001';

  static getInstance(): ProxyService {
    if (!ProxyService.instance) {
      ProxyService.instance = new ProxyService();
    }
    return ProxyService.instance;
  }

  async fetchPortalContent(url: string): Promise<ProxyResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Proxy request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Proxy service error:', error);
      return {
        content: '',
        url,
        title: 'Error',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async submitForm(url: string, formData: Record<string, string>): Promise<ProxyResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/proxy/form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, formData }),
      });

      if (!response.ok) {
        throw new Error(`Form submission failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Form submission error:', error);
      return {
        content: '',
        url,
        title: 'Error',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}