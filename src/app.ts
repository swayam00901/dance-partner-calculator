import express, { Request as ExpressRequest, Response } from 'express';
import bodyParser from 'body-parser';
import { CalculatePartnersController } from './controllers/calculatePartnersController';
import { DancePreferencesController } from './controllers/DancePreferencesController';
import { PartnerCalculationService } from './services/partnerCalculationService';
import { setupSwagger } from './swagger';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const partnerCalculationService = new PartnerCalculationService();
const calculatePartnersController = new CalculatePartnersController(partnerCalculationService);
const dancePreferencesController = new DancePreferencesController(partnerCalculationService);

/**
 * @swagger
 * /calculate-partners:
 *   post:
 *     summary: Calculate average dance partners
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total_leaders:
 *                 type: integer
 *               total_followers:
 *                 type: integer
 *               dance_styles:
 *                 type: array
 *                 items:
 *                   type: string
 *               leader_knowledge:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: string
 *               follower_knowledge:
 *                 type: object
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: string
 *               dance_duration_minutes:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Average dance partners calculated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average_dance_partners:
 *                   type: number
 *       400:
 *         description: Invalid request data
 */
app.post('/calculate-partners', async (req: ExpressRequest, res: Response) => {
    await calculatePartnersController.calculatePartners(req, res);
});

/**
 * @swagger
 * /dance-preferences:
 *   get:
 *     summary: Get the most and least popular dance styles
 *     responses:
 *       200:
 *         description: Most and least popular dance styles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 most_popular:
 *                   type: string
 *                 least_popular:
 *                   type: string
 */
app.get('/dance-preferences', async (req: ExpressRequest, res: Response) => {
    await dancePreferencesController.getDancePreferences(req, res);
});

setupSwagger(app);

app.listen(port, () => {
    console.log(`Dance Partner Calculator API is running on http://localhost:${port}/api-docs`);
});
export default app;