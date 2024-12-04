import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

export const f1Api = {
  async getTeams() {
    try {
      const response = await api.get('/constructors');
      
      // Create an array of promises and await them all at once
      return Promise.all(response.data.map(async team => ({
        id: team.constructor_id,
        name: team.constructor_name,
        color: team.constructor_color || '#000000',
        performance: await this.calculateTeamPerformance(team.constructor_id),
        history: await this.calculateTeamHistory(team.constructor_id),
        innovation: await this.calculateInnovation(team.constructor_id),
        drivers: await this.calculateDriverPerformance(team.constructor_id),
        sustainability: await this.calculateSustainability(team.constructor_id)
      })));
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },

  async calculateTeamPerformance(constructorId) {
    try {
      // Get lap times and race results for the team
      const [lapTimes, results] = await Promise.all([
        api.get('/laps', { params: { constructor_id: constructorId }}),
        api.get('/results', { params: { constructor_id: constructorId }})
      ]);
      
      // Calculate performance score based on lap times and results
      // This is a simplified example - you'll need to implement your own scoring logic
      return this.calculatePerformanceScore(lapTimes.data, results.data);
    } catch (error) {
      console.error('Error calculating team performance:', error);
      return 0;
    }
  },

  // Helper method to calculate performance score
  calculatePerformanceScore(lapTimes, results) {
    // Implement your scoring logic here
    // This should return a number between 0-100
    // Example: Average position, fastest laps, consistency, etc.
    return 0; // Placeholder
  }

  // Implement other calculation methods:
  // - calculateTeamHistory()
  // - calculateInnovation()
  // - calculateDriverPerformance()
  // - calculateSustainability()
}; 