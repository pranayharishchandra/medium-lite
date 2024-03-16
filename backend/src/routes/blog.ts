import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { verify } from 'hono/jwt';

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
  Variables: {
    userId: string
  }
}>();

// <===========================>MIDDLEWARE<===========================>

// If the user is authonticated means having the valid JWT token then they can access the following routes

// Middleware - 1 - (fetching the user details - (userId) using token)
blogRouter.use('/*', async (c, next) => {
  try {
    // jwt from header
    const jwt = c.req.header('Authorization')

    // no token means not authorized
    if (!jwt) {
      throw new Error('Unauthorized jwt')
    }

    // if token exists, extract token from jwt
    const token = jwt.split(' ')[1]
    console.log(token)

    // verify the token, and get the user info
    const userInfo = await verify(token, c.env.JWT_SECRET)

    // if you didn't get user info obj, means not valid user
    if (!userInfo) {
      throw new Error('Unauthorized user')
    }

    // otherwise set the user id in header "userId"
    c.set('userId', userInfo.id)
    await next()
  } 
  catch (e: any) {
    c.status(401)
    return c.json({
      message: e.message
    })
  }


})

// <===========================>ROUTES<===========================>



// Route - 3 - (creating post) (title, content, authorId)
blogRouter.post('/', async (c) => {

	const userId = c.get('userId');
  // return c.text("userId: " + userId)
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const post = await prisma.post.create({
		data: {
			title: body.title,
			content: body.content,
			authorId: userId
		}
	});
	return c.json({
		id: post.id
	});
})

// Route - 4 - updating (patch) (id, authorId)
blogRouter.patch('/', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const userId = c.get("userId")
    // const userId = '999999'

    if (!userId) {
      throw new Error("userId undefined")
    }

    const updatedPost = await prisma.post.update({
      where: {
        // if user want to edit a post, make sure
        // that the post is written by the logged in user
        id: body.id,
        authorId: userId
      },
      data: {
        title: body.title,
        content: body.content
      }
    })

    if (!updatedPost) {
      throw new Error("post could not be updated")
    }

    return c.json({
      updatedPost
    })
  }
  catch (e: any) {
    return c.json({
      message: e.message
    })
  }

})

// Route - 5
blogRouter.get('/bulk', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.post.findMany()

  return c.json({
    posts
  })
  // return c.text('Hello Hono, /bulk!')
})

// Route - 6
blogRouter.get('/:id', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  // const userId = c.get('userId')
  // return c.text(userId)

  const id = c.req.param('id')
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new Error(`no post with id: ${id}`)
    }

    return c.json({
      post
    })
  }
  catch (e: any) {

    return c.json({
      message: e.message
    })
  }
  return c.text(`/:id: ${id}`)
})


export default blogRouter


/** authorId
  -> creating
  -> updating 
  for them user should be verified, 
  where,
      authorId: userId
 */