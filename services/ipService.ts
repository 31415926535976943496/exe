export const fetchIpInfo = async (): Promise<{ ip: string; city: string; country: string }> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch IP');
    }
    const data = await response.json();
    return {
      ip: data.ip || 'Unknown',
      city: data.city || 'Unknown',
      country: data.country_name || 'Unknown',
    };
  } catch (error) {
    console.error("Error fetching IP info:", error);
    return {
      ip: '127.0.0.1',
      city: 'Localhost',
      country: 'Local Network'
    };
  }
};