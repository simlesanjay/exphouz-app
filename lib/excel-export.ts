"use server";

import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';

// Helper to generate workbook buffer
export async function generateRequirementsWorkbook() {
    const requirements = await prisma.requirement.findMany({
        include: {
            client: {
                select: {
                    displayName: true,
                    user: { select: { email: true, mobile: true } }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const data = requirements.map(req => ({
        ID: req.id,
        Title: req.title,
        Description: req.description,
        Client_Name: req.client.displayName || 'N/A',
        Client_Email: req.client.user.email,
        Client_Mobile: req.client.user.mobile || 'N/A',
        Project_Type: req.projectType,
        Property_Type: req.propertyType,
        Area: req.propertyArea,
        Budget: req.budgetRange,
        Location: req.location,
        Status: req.status,
        Created_At: req.createdAt.toISOString()
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Requirements");

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
}
