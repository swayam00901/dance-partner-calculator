// filepath: /c:/Users/DELL/Documents/source/dance-partner-calculator/src/tests/dancePreferencesController.test.ts
import request from 'supertest';
import express from 'express';
import { DancePreferencesController } from '../controllers/DancePreferencesController';
import { PartnerCalculationService } from '../services/partnerCalculationService';

const app = express();
app.use(express.json());

const partnerCalculationService = new PartnerCalculationService();
const dancePreferencesController = new DancePreferencesController(partnerCalculationService);

app.get('/dance-preferences', dancePreferencesController.getDancePreferences);

describe('DancePreferencesController', () => {
  beforeAll(async () => {
    await partnerCalculationService.initializeDatabase();
  });

  afterAll(async () => {
    await partnerCalculationService.closeDatabase();
  });

  test('should return 200 if dance style counts are available', async () => {
    const response = await request(app).get('/dance-preferences');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ least_popular: "Foxtrot",most_popular: "Waltz" });
  });

  test('should return most and least popular dance styles', async () => {
    // Insert some test data into the database
    const db = partnerCalculationService.getDatabase();
    if (db) {
      await db.run('INSERT INTO dance_styles (style, count) VALUES (?, ?)', ['Waltz', 10]);
      await db.run('INSERT INTO dance_styles (style, count) VALUES (?, ?)', ['Tango', 5]);
      await db.run('INSERT INTO dance_styles (style, count) VALUES (?, ?)', ['Foxtrot', 1]);
    } else {
      throw new Error('Database is not initialized');
    }

    const response = await request(app).get('/dance-preferences');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      most_popular: 'Waltz',
      least_popular: 'Foxtrot'
    });
  });
});