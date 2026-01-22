import axios from 'axios';

const NASA_API_KEY = 'DEMO_KEY';
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

  // Mars Rover Photos
  getMarsPhotos: async (rover = 'curiosity', sol = 1000, page = 1) => {
    try {
      const response = await apiClient.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
        params: { sol, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Mars photos:', error);
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