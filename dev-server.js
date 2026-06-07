// Simple dev server for API routes during local development
// Run alongside Vite with: node dev-server.js

import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
const PORT = 3001

// Load API key
const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) {
  console.error('❌ ANTHROPIC_API_KEY not set')
  process.exit(1)
}

const client = new Anthropic({ apiKey })

app.use(cors())
app.use(express.json())

app.post('/api/anthropic', async (req, res) => {
  try {
    const { model, max_tokens, system, messages } = req.body

    const response = await client.messages.create({
      model,
      max_tokens,
      system,
      messages,
    })

    res.json(response)
  } catch (error) {
    console.error('API Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Dev API server running on http://localhost:${PORT}`)
  console.log(`   Vite dev server should proxy /api to this port`)
})
