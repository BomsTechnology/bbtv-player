export const getProxyUrl = (originalStreamUrl: string) => {
    const proxyBase = "http://localhost:3000/"; // Ton serveur Nginx
    const encodedUrl = encodeURIComponent(originalStreamUrl);
    return `${proxyBase}stream?url=${encodedUrl}`;
  };