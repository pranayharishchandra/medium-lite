import { PrismaClient } from '@prisma/client/extension'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'

// remember this as syntax, when you want to use
const app = new Hono<{
  Bindings : {
    DATABASE_URL: string
  }
}>()



app.post('/api/v1/user/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())




  return c.text('Hello Hono!')
})

app.post('/api/v1/user/signin', (c) => {
  return c.text('Hello Hono!')
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