import axios from 'axios';

const NASA_API_KEY = 'bxbbl5Kr0h5oBKyka15Vm0b9afC4DOecQ7yWqVey';
const BASE_URL = 'https://api.nasa.gov';

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: NASA_API_KEY
  }
});

export const nasaAPI = {
  // Astronomy Picture of the Day
  getAPOD: async (date = null) => {
    try {
      const params = date ? { date } : {};
      const response = await apiClient.get('/planetary/apod', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching APOD:', error);
      throw error;
    }
  },

  // Mars Rover Photos - Using earth_date instead of sol for better results
  getMarsPhotos: async (rover = 'curiosity', date = '2024-01-01') => {
    try {
      const response = await apiClient.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
        params: { 
          earth_date: date // Use earth_date instead of sol
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.error('No photos found for this date');
      }
      console.error('Error fetching Mars photos:', error.message);
      throw error;
    }
  },

  // Near Earth Objects
  getNEO: async (startDate, endDate) => {
    try {
      const response = await apiClient.get('/neo/rest/v1/feed', {
        params: { start_date: startDate, end_date: endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching NEO data:', error);
      throw error;
    }
  }
};

export default nasaAPI;