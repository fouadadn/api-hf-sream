import { db } from "../lib/firebase.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

export default async function wishlistRoute(fastify, opts) {

    const wishlistRef = db.collection('wishlist');

    fastify.get("/", { preHandler: verifyFirebaseToken }, async (request, reply) => {
        const user = request.user
        const snapshot = await wishlistRef.where("uid", "==", user.uid).get();
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        if (!items.length > 0) {
            return reply.send({ message: "your wishlist is empty" })
        }

        return reply.send(items)
    })

    fastify.post('/', {
        preHandler: verifyFirebaseToken,
        schema: {
            body: {
                type: 'object',
                required: ['show_id', 'title', "img", "genres", "rate"],
                properties: {
                    title: { type: 'string' },
                    show_id: { type: 'number' },
                    img: { type: 'string' },
                    genres: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    rate: { type: 'number' }
                }
            }
        },
        handler: async (request, reply) => {
            const user = request.user
            const { show_id, title, img, genres, rate } = request.body;
            const date = new Date()
            const dateTime = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate()}/${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`

            const ifShowExist = await wishlistRef.where("show_id", "==", show_id).get()
            const items = ifShowExist.docs.map(doc => ({ id: doc.id, ...doc.data() }))

            if (items.length > 0) {
                return reply.send({ message: "you already add this show to your wishlist" })
            }

            const newDoc = await wishlistRef.add({
                show_id: show_id,
                title: title,
                img: img,
                rate: rate,
                genres: genres,
                uid: user.uid,
                createdAt: dateTime
            })
            return reply.code(201).send({ id: newDoc.id, message: 'Wishlist item added' })
        }
    }
    )


    fastify.delete('/:id', async (request, reply) => {
        await wishlistRef.doc(request.params.id).delete()
        return reply.send({ message: 'Wishlist item deleted' })
    })

}





// all the crud

// export default async function wishlistRoute(fastify) {
//   const wishlistRef = db.collection('wishlist')

//   // ✅ Create
//   fastify.post('/wishlist', async (request, reply) => {
//     const { title, description } = request.body
//     const newDoc = await wishlistRef.add({ title, description, createdAt: new Date() })
//     return reply.code(201).send({ id: newDoc.id, message: 'Wishlist item added' })
//   })

//   // 📥 Read All
//   fastify.get('/wishlist', async (_, reply) => {
//     const snapshot = await wishlistRef.get()
//     const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
//     return reply.send(items)
//   })

//   // 📄 Read One
//   fastify.get('/wishlist/:id', async (request, reply) => {
//     const doc = await wishlistRef.doc(request.params.id).get()
//     if (!doc.exists) return reply.code(404).send({ message: 'Not found' })
//     return reply.send({ id: doc.id, ...doc.data() })
//   })

//   // ✏️ Update
//   fastify.put('/wishlist/:id', async (request, reply) => {
//     const docRef = wishlistRef.doc(request.params.id)
//     await docRef.update(request.body)
//     return reply.send({ message: 'Wishlist item updated' })
//   })

//   // 🗑️ Delete
//   fastify.delete('/wishlist/:id', async (request, reply) => {
//     await wishlistRef.doc(request.params.id).delete()
//     return reply.send({ message: 'Wishlist item deleted' })
//   })
// }
