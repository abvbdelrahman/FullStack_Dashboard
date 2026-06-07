import Blog from '../models/Blog.js'
import { AppError } from '../utils/AppError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const formatBlog = (blog) => ({
  id: blog._id,
  legacyId: blog.legacyId,
  title: blog.title,
  category: blog.category,
  image: blog.image,
  date: blog.date,
  summary: blog.summary,
  content: blog.content,
})

export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 })
  res.json(blogs.map(formatBlog))
})

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) throw new AppError('Blog not found', 404)
  res.json(formatBlog(blog))
})
