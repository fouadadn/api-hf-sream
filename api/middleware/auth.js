import { auth } from '../lib/firebase.js'

export async function verifyFirebaseToken(request, reply) {
    try {
        const authHeader = request.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.code(401).send({ message: 'No token provided' })
        }

        const idToken = authHeader.split(' ')[1]
        const decoded = await auth.verifyIdToken(idToken)

        // Attach user info to request for use in routes
        request.user = decoded
    } catch (err) {
        console.error('Auth error:', err)
        return reply.code(401).send({ message: 'Unauthorized' })
    }
}
