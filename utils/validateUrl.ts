export default function validateUrl(url: string): void  {
    
    if (!url || typeof url !== 'string') {
      throw new Error('URL is required');
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error('URL must start with http:// or https://');
    }

    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL format');
    }
  }