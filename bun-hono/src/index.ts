import bootstrapp from './bootstrapp/bootstrapp'

// const app = bootstrapp()
// const port = process.env.PORT || 3000

// const server = Bun.serve({
//   port,
//   fetch: app.fetch,
//   error(err) {
//     console.error('Server error:', err)
//     return new Response('Internal Server Error', { status: 500 })
//   },
// })

// console.log(`Server running on http://localhost:${server.port}`)

// import bootstrapp from './bootstrapp/bootstrapp'
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
