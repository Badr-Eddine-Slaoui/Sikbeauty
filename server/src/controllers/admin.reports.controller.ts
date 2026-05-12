import { Request, Response } from 'express';
import * as reportsService from '../services/admin.reports.service';

export const getReports = async (req: Request, res: Response) => {
    try {
        const reportsData = await reportsService.getReportsData();
        
        res.status(200).json({
            success: true,
            data: reportsData
        });
    } catch (error) {
        console.error('Error fetching reports data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reports data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
