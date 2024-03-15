import { Hono } from 'hono';
import blogRouter from './routes/blog';


// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
}>();

// routes
app.route('/api/v1/blog',blogRouter)



export default app

/** it's exported like this, got by "cmd+click", to know which 
export type Env = {
    Bindings?: Bindings;
    Variables?: Variables;
}; 
 */

/**env
  -> env variable is not decleared globally, 
  -> so it needs to be initalized inside the route
 */

/** PRISMA inialization
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
 */