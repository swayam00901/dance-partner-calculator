import { Request, Response } from 'express';
import { PartnerCalculationService } from '../services/partnerCalculationService';

export class DancePreferencesController {
    private partnerCalculationService: PartnerCalculationService;

    constructor(partnerCalculationService: PartnerCalculationService) {
        this.partnerCalculationService = partnerCalculationService;
    }

    public getDancePreferences = async (_: Request, res: Response): Promise<void> => {
        try {
            const danceStyleCounts = await this.partnerCalculationService.getDanceStyleCounts();
            if (!danceStyleCounts || Object.keys(danceStyleCounts).length === 0) {
                res.status(404).json({ error: 'No dance style counts available' });
                return;
            }

            for (const [style, count] of Object.entries(danceStyleCounts)) {
                console.log(`Dance style: ${style}, Count: ${count}`);
            }

            console.log("danceStyleCounts Promise resolved with:", danceStyleCounts);
            const sortedStyles = Object.entries(danceStyleCounts).filter(([_, count]) => count > 0).sort((a, b) => b[1] - a[1]);

            const mostPopular = sortedStyles[0] ? sortedStyles[0][0] : null;
            const leastPopular = sortedStyles[sortedStyles.length - 1] ? sortedStyles[sortedStyles.length - 1][0] : null;

            res.status(200).json({ most_popular: mostPopular, least_popular: leastPopular });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve dance preferences' });
        }
    };
}