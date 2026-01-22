import axios from 'axios';

const NASA_API_KEY = 'bxbbl5Kr0h5oBKyka15Vm0b9afC4DOecQ7yWqVey';
const BASE_URL = 'https://api.nasa.gov';
const IMAGES_API_URL = 'https://images-api.nasa.gov';

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: NASA_API_KEY
  }
});

// Separate client for Images API (doesn't need API key)
const imagesClient = axios.create({
  baseURL: IMAGES_API_URL
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

  // NASA Image and Video Library Search
  searchImages: async (query = 'mars', mediaType = 'image') => {
    try {
      const response = await imagesClient.get('/search', {
        params: {
          q: query,
          media_type: mediaType
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error searching images:', error.message);
      throw error;
    }
  },

  // Get asset manifest for specific media
  getAsset: async (nasaId) => {
    try {
      const response = await imagesClient.get(`/asset/${nasaId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching asset:', error.message);
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