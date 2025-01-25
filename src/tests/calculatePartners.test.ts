// filepath: /c:/Users/DELL/Documents/source/dance-partner-calculator/src/tests/calculatePartners.test.ts
import { PartnerCalculationService } from '../services/partnerCalculationService';
import { CalculatePartnersRequest } from '../models/request';

describe('PartnerCalculationService', () => {
  let service: PartnerCalculationService;

  beforeAll(async () => {
    service = new PartnerCalculationService();
    await service.initializeDatabase();
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await service.closeDatabase();
  });

  test('should calculate average dance partners correctly', async () => {
    const request: CalculatePartnersRequest = {
      total_leaders: 10,
      total_followers: 15,
      dance_styles: ['Waltz', 'Tango', 'Foxtrot'],
      leader_knowledge: {
        '1': ['Waltz', 'Tango'],
        '2': ['Foxtrot'],
        '3': ['Waltz', 'Foxtrot'],
        // Add more leaders as needed
      },
      follower_knowledge: {
        'A': ['Waltz', 'Tango', 'Foxtrot'],
        'B': ['Tango'],
        'C': ['Waltz'],
        // Add more followers as needed
      },
      dance_duration_minutes: 120,
    };

    const averagePartners = await service.calculateAveragePartners(request);
    expect(averagePartners).toBeGreaterThan(0);
  });

  test('should handle no common dance styles', async () => {
    const request: CalculatePartnersRequest = {
      total_leaders: 10,
      total_followers: 15,
      dance_styles: ['Waltz', 'Tango', 'Foxtrot'],
      leader_knowledge: {
        '1': ['Waltz'],
        '2': ['Tango'],
        '3': ['Foxtrot'],
        // Add more leaders as needed
      },
      follower_knowledge: {
        'A': ['Salsa'],
        'B': ['Bachata'],
        'C': ['Merengue'],
        // Add more followers as needed
      },
      dance_duration_minutes: 120,
    };

    const averagePartners = await service.calculateAveragePartners(request);
    expect(averagePartners).toBe(8);
  });

  test('should handle empty leader and follower knowledge', async () => {
    const request: CalculatePartnersRequest = {
      total_leaders: 10,
      total_followers: 15,
      dance_styles: ['Waltz', 'Tango', 'Foxtrot'],
      leader_knowledge: {},
      follower_knowledge: {},
      dance_duration_minutes: 120,
    };

    const averagePartners = await service.calculateAveragePartners(request);
    expect(averagePartners).toBe(8);
  });
});