import { PartnerCalculationService } from '../services/partnerCalculationService';
import { Request, Response } from 'express';
import { CalculatePartnersRequest } from '../models/request';

export class CalculatePartnersController {
    private partnerCalculationService: PartnerCalculationService;

    constructor(partnerCalculationService: PartnerCalculationService) {
        this.partnerCalculationService = partnerCalculationService;
    }

    public calculatePartners = (req: Request, res: Response): void => {
        const requestData: CalculatePartnersRequest = req.body;
        if (!requestData) {
            res.status(400).json({ error: 'Invalid request data' });
            return;
        }
    
        try {
            const averagePartners = this.partnerCalculationService.calculateAveragePartners(requestData);
            console.log("averagePartners", averagePartners);
            averagePartners.then((numberOfPartners) => {
                res.status(200).json({ average_dance_partners: numberOfPartners });
            }).catch((error) => {
                res.status(500).json({ error: error.message });
            });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    };
}