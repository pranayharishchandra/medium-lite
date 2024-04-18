// Route - 1
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign } from 'hono/jwt'
import { signupInput } from '@pranay-tensen/tensenbloglite-common-app'

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
  Variables: {
    userId: string
  }
}>();

// <===========================> Routes <===========================>

// Route - 1 
userRouter.post('/signup', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // CHALLENGE -> not using await below
    const body = await c.req.json();

    // Validate request body using Zod schema
    const validatedData = signupInput.parse(body);

    // creating user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: validatedData.password
      }
    });

    // Generating JWT token
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.text('jwt here')
  } 
  catch (e:any) {
    c.status(403);
    return c.json({ 
      error: "error while signing up, maybe user with this email already exists",
      message: e.message
   });
  }
})

// Route - 2 - user login
userRouter.post('/login', async (c) => {
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
    c.status(403)
    return c.text('not valid email')
  }
})

export default userRouter

/* jwt: sign
JWT (JSON Web Tokens) signing is a process in which you create a token containing some claims (data) and a signature using a secret key. 
This token can be sent between parties and used to verify the authenticity of the claims and ensure that the token has not been tampered with.
*/

/*
* env is not global like in express, so we need to write same code in every function
 */