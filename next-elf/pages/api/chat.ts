import type { NextApiRequest, NextApiResponse } from 'next'

const API_KEY = process.env.DIFY_API_KEY
const API_URL = 'https://api.dify.ai/v1/chat-messages'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          inputs: {},
          query: message,
          response_mode: 'blocking',
          conversation_id: '',
          user: 'user',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch from Dify API')
      }

      const data = await response.json()
      res.status(200).json({ response: data.answer })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'An error occurred while processing your request' })
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}