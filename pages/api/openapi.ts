import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Try multiple possible locations for the file
    const possiblePaths = [
      path.join(process.cwd(), 'openapi.yaml'),
      path.join(process.cwd(), 'public', 'openapi.yaml'),
      path.join(process.cwd(), '..', 'openapi.yaml')
    ];

    let fileContent = '';
    let fileFound = false;

    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          fileContent = fs.readFileSync(filePath, 'utf8');
          fileFound = true;
          break;
        }
      } catch (err) {
        console.log(`File not found at ${filePath}`);
      }
    }

    if (!fileFound) {
      // Fallback: return a basic OpenAPI spec
      fileContent = `openapi: 3.0.3
info:
  title: ChatWith Notifications API
  description: A Next.js API server for managing notifications with Supabase integration.
  version: 1.0.0
servers:
  - url: ${req.headers.host}
    description: Production server
paths:
  /api/notifications:
    get:
      summary: Get notifications
      responses:
        '200':
          description: Success
  /api/openapi:
    get:
      summary: Get OpenAPI specification
      responses:
        '200':
          description: OpenAPI YAML file`;
    }
    
    res.setHeader('Content-Type', 'application/x-yaml');
    res.setHeader('Content-Disposition', 'inline; filename="openapi.yaml"');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(fileContent);
  } catch (error) {
    console.error('Error reading openapi.yaml:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
