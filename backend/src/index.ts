import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from 'hono/jwt'

// Create the main Hono app
const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();
 

app.post('/api/v1/signup', async (c) => {


  /** MIDDLEWARES */
  app.use('/api/v1/blog/*', async (c, next) => {
    
    await next()
  })
  
  /** ROUTES  */
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
  } catch (e) {
    c.status(403);
		return c.json({ error: "error while signing up, maybe user with this email already exists" });
  }
})

app.post('/api/v1/signin', async (c) => {
  // return c.text('signin working')

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json()

  try {
    const user = await prisma.user.findUnique({
      where : {
        email: body.email
      }
    })
    // don't do (!user), just throw an exception
    if (!user) {
      // If user is not found, throw an error
      throw new Error(`User with email ${body.email} doesn't exist`);
    }

    const jwt = await sign( {id: user.id }, c.env.JWT_SECRET)

    return c.json({jwt})
  } 
  catch (error) {
    // console.error('Error signing in:', error);
    return c.text('not valid email')
  }
})


app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Hello Hono!')
})

export default app

/** it's exported like this, got by "cmd+click", to know which 
export type Env = {
    Bindings?: Bindings;
    Variables?: Variables;
}; 
 */