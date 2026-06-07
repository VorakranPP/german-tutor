import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { model, max_tokens, system, messages } = req.body

    const response = await client.messages.create({
      model,
      max_tokens,
      system,
      messages,
    })

    return res.status(200).json(response)
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      error: error.message || 'Internal server error',
    })
  }
}
