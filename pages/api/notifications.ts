import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../lib/supabase'
import Cors from 'cors'

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: true, // Allow all origins in development
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

// Interface for the notification data
interface NotificationData {
  lastname: string
  firstname: string
  email: string
  subject: string
  details: string
}

// Validation function
function validateNotificationData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.lastname || typeof data.lastname !== 'string' || data.lastname.trim().length === 0) {
    errors.push('lastname is required and must be a non-empty string')
  }
  
  if (!data.firstname || typeof data.firstname !== 'string' || data.firstname.trim().length === 0) {
    errors.push('firstname is required and must be a non-empty string')
  }
  
  if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
    errors.push('email is required and must be a non-empty string')
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push('email must be a valid email address')
    }
  }
  
  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
    errors.push('subject is required and must be a non-empty string')
  }
  
  if (!data.details || typeof data.details !== 'string' || data.details.trim().length === 0) {
    errors.push('details is required and must be a non-empty string')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run CORS middleware
  await runMiddleware(req, res, cors)
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Only POST requests are allowed'
    })
  }
  
  try {
    // Get data from request body
    const data: NotificationData = req.body
    
    // Validate the data
    const validation = validateNotificationData(data)
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid input data',
        details: validation.errors
      })
    }
    
    // Prepare data for insertion
    const notificationData = {
      lastname: data.lastname.trim(),
      firstname: data.firstname.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      details: data.details.trim(),
      created_at: new Date().toISOString(),
      status: 'new' // Default status
    }
    
    console.log('Inserting notification data:', notificationData)
    
    // Insert data into Supabase
    const { data: insertedData, error } = await supabaseAdmin
      .from('chatwith_notifications')
      .insert([notificationData])
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({
        success: false,
        error: 'Database error',
        message: 'Failed to insert notification data',
        details: error.message
      })
    }
    
    if (!insertedData || insertedData.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'Insert failed',
        message: 'No data was inserted'
      })
    }
    
    console.log('Successfully inserted notification:', insertedData[0])
    
    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: {
        id: insertedData[0].id,
        lastname: insertedData[0].lastname,
        firstname: insertedData[0].firstname,
        email: insertedData[0].email,
        subject: insertedData[0].subject,
        created_at: insertedData[0].created_at
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
