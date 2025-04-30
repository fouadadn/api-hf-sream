import Fastify from 'fastify'
import wishlistRoute from './routes/wishlist.js'


const app = Fastify({
  logger: true,
})

app.register(wishlistRoute, { prefix: 'api/wishlist' })

app.get('/', async (req, reply) => {
  return reply.status(200).send({ message: 'hello from fouad' })
})

// async function start() {
//   await app.listen({ port: 3001 })
//   console.log('Server is running at http://localhost:3001')
// }

// start()

export default async function handler(req, reply) {
  await app.ready()
  app.server.emit('request', req, reply)
}