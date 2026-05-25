import bootstrapp from './bootstrapp/bootstrapp'
import Bun from 'bun'

(async () => {
  const app = await bootstrapp()
  const port = process.env.APP_PORT || 3000

  Bun.serve({
    port,
    fetch: app.fetch,
    error(err) {
      console.error('Server error:', err)
      return new Response('Internal Server Error', { status: 500 })
    },
  })

  console.log(`Server running on http://localhost:${port}`)
})()
