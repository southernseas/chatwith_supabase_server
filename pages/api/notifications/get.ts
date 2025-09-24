import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../lib/supabase'
import Cors from 'cors'

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'OPTIONS'],
  origin: true,
  credentials: true,
})

// Helper function to run CORS middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run CORS middleware
  await runMiddleware(req, res, cors)
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Only GET requests are allowed'
    })
  }
  
  try {
    const { limit = 50, offset = 0, status } = req.query
    
    // Build query
    let query = supabaseAdmin
      .from('chatwith_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)
    
    // Add status filter if provided
    if (status && typeof status === 'string') {
      query = query.eq('status', status)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({
        success: false,
        error: 'Database error',
        message: 'Failed to fetch notifications',
        details: error.message
      })
    }
    
    return res.status(200).json({
      success: true,
      message: 'Notifications retrieved successfully',
      data: data || [],
      count: count || 0,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        hasMore: data ? data.length === Number(limit) : false
      }
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
