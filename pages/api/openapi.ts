import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'openapi.yaml');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    res.setHeader('Content-Type', 'application/x-yaml');
    res.setHeader('Content-Disposition', 'inline; filename="openapi.yaml"');
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error reading openapi.yaml:', error);
    res.status(404).json({ message: 'File not found' });
  }
}
