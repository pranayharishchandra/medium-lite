// Route - 1
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from 'hono/jwt'

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}>();

// Middleware - 1
blogRouter.use('/*', async (c, next) => {

  await next()
})

// <====================================><====================================>

// Route - 1 
blogRouter.post('/signup', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  // CHALLENGE -> not using await below
  const body = await c.req.json();

  try {

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    });

    return c.text('jwt here')
  } 
  catch (e) {
    c.status(403);
    return c.json({ error: "error while signing up, maybe user with this email already exists" });
  }
})

// Route - 2
blogRouter.post('/login', async (c) => {
  // return c.text('signin working')

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json()

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })

    // don't do (!user), just throw an exception
    if (!user) {
      // If user is not found, throw an error
      throw new Error(`User with email ${body.email} doesn't exist`);
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)

    return c.json({ jwt })
  }
  catch (error) {
    // console.error('Error signing in:', error);
    return c.text('not valid email')
  }
})

// Route - 3
blogRouter.put('/', (c) => {
  return c.text('Hello Hono! /')
})

// Route - 4
blogRouter.get('/bulk', (c) => {
  return c.text('Hello Hono, /bulk!')
})

// Route - 5
blogRouter.get('/:id', (c) => {
  return c.text('Hello Hono! /:id')
})


export default blogRouter