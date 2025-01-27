import apiService from './api.service';

class MockService {
  private static instance: MockService;
  
  private constructor() {}

  static getInstance(): MockService {
    if (!MockService.instance) {
      MockService.instance = new MockService();
    }
    return MockService.instance;
  }

  async getPrivateData() {
    try {
      const response = await apiService.api.get('/private');
      return response.data;
    } catch (error) {
      console.log('❌ Error fetching private data:', error);
      throw error;
    }
  }
}

const mockService = MockService.getInstance();
export default mockService; 