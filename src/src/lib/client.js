// Proxy client that calls backend API instead of Anthropic directly
// This keeps the API key safe on the server

export const client = {
  messages: {
    create: async (params) => {
      const response = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'API request failed')
      }

      return response.json()
    },
  },
}
