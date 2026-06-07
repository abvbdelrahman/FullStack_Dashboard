import 'dotenv/config'
import mongoose from 'mongoose'
import Assignment from '../models/Assignment.js'
import Course from '../models/Course.js'
import Blog from '../models/Blog.js'
import CalendarEvent from '../models/CalendarEvent.js'
import ClassSession from '../models/ClassSession.js'
import DashboardTask from '../models/DashboardTask.js'
import Discussion from '../models/Discussion.js'
import Note from '../models/Note.js'
import Notification from '../models/Notification.js'
import Resource from '../models/Resource.js'
import User from '../models/User.js'
import UserSettings from '../models/UserSettings.js'
import { connectDB } from '../config/db.js'

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const normalizeSections = (sections = []) =>
  sections.map((section) => ({
    ...section,
    items: (section.items || []).map((item) => ({
      ...item,
      title: item.title || item.label,
      label: item.label || item.title,
    })),
  }))

const countLessons = (sections = []) =>
  sections.reduce((total, section) => total + (section.items?.length || 0), 0)

const seed = async () => {
  await connectDB()

  const { default: courses } = await import('../data/courses.js')
  const { default: blogs } = await import('../data/blogs.js')

  await Promise.all([
    Assignment.deleteMany({}),
    CalendarEvent.deleteMany({}),
    ClassSession.deleteMany({}),
    Course.deleteMany({}),
    Blog.deleteMany({}),
    DashboardTask.deleteMany({}),
    Discussion.deleteMany({}),
    Note.deleteMany({}),
    Notification.deleteMany({}),
    Resource.deleteMany({}),
    UserSettings.deleteMany({}),
    User.deleteMany({}),
  ])

  const instructor = await User.create({
    name: 'Demo Instructor',
    email: 'instructor@knowledgepulse.com',
    password: 'password123',
    role: 'instructor',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  })

  const admin = await User.create({
    name: 'Demo Admin',
    email: 'admin@knowledgepulse.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  })

  const courseDocs = await Course.insertMany(
    courses.map((c) => {
      const sections = normalizeSections(c.sections)

      return {
        owner: instructor._id,
        legacyId: c.id,
        title: c.title,
        description: c.description,
        image: c.image,
        instructor: c.instructor,
        duration: c.duration,
        modules: c.modules,
        rating: c.rating,
        reviews: c.reviews,
        price: c.price,
        whatYouLearn: c.whatYouLearn,
        materialIncludes: c.materialIncludes,
        requirements: c.requirements,
        tags: c.tags,
        audience: c.audience,
        sections,
        totalLessons: countLessons(sections),
      }
    })
  )

  const [uxCourse, visualCourse, researchCourse] = courseDocs

  await Assignment.insertMany([
    {
      course: uxCourse._id,
      title: 'Review onboarding flow critique',
      description: 'Prepare feedback notes for the next live class.',
      dueDate: new Date('2026-06-14'),
      status: 'Progress',
      maxPoints: 100,
    },
    {
      course: visualCourse?._id || uxCourse._id,
      title: 'Publish visual hierarchy exercise',
      description: 'Finalize instructions and attach examples.',
      dueDate: new Date('2026-06-18'),
      status: 'Pending',
      maxPoints: 80,
    },
    {
      course: researchCourse?._id || uxCourse._id,
      title: 'Grade persona validation submissions',
      description: 'Complete grading for the latest cohort.',
      dueDate: new Date('2026-06-21'),
      status: 'Done',
      maxPoints: 100,
    },
  ])

  await CalendarEvent.insertMany([
    {
      user: instructor._id,
      title: 'Live critique: onboarding flows',
      date: '2026-06-08',
      category: 'Class',
      notes: 'Review student wireframes and edge cases.',
    },
    {
      user: instructor._id,
      title: 'Assignment grading block',
      date: '2026-06-10',
      category: 'Assignments',
      notes: 'Grade persona validation submissions.',
    },
    {
      user: instructor._id,
      title: 'Content planning',
      date: '2026-06-12',
      category: 'Planning',
      notes: 'Outline next module resources.',
    },
    {
      user: admin._id,
      title: 'Platform content audit',
      date: '2026-06-09',
      category: 'Admin',
      notes: 'Review course catalog quality and pending assignments.',
    },
  ])

  await ClassSession.insertMany([
    {
      user: instructor._id,
      title: 'Live critique: onboarding flows',
      course: uxCourse.title,
      instructor: instructor.name,
      date: '2026-06-08',
      time: '10:00 AM',
      duration: '75 min',
      status: 'Upcoming',
    },
    {
      user: instructor._id,
      title: 'Design systems office hours',
      course: visualCourse?.title || uxCourse.title,
      instructor: instructor.name,
      date: '2026-06-07',
      time: '2:00 PM',
      duration: '45 min',
      status: 'Live',
    },
    {
      user: instructor._id,
      title: 'Persona validation workshop',
      course: researchCourse?.title || uxCourse.title,
      instructor: instructor.name,
      date: '2026-06-03',
      time: '1:30 PM',
      duration: '60 min',
      status: 'Completed',
      recordingUrl: '/api/demo-downloads/persona-validation',
    },
  ])

  await Resource.insertMany([
    {
      user: instructor._id,
      title: 'Auto-layout guide',
      course: uxCourse.title,
      kind: 'PDF',
      size: '8.5 MB',
      url: '/api/demo-downloads/auto-layout.pdf',
      saved: false,
    },
    {
      user: instructor._id,
      title: 'Research interview template',
      course: researchCourse?.title || uxCourse.title,
      kind: 'PDF',
      size: '940 KB',
      url: '/api/demo-downloads/research-interview-template.pdf',
      saved: true,
    },
    {
      user: instructor._id,
      title: 'Prototype walkthrough',
      course: visualCourse?.title || uxCourse.title,
      kind: 'Video',
      size: '148 MB',
      url: '/api/demo-downloads/prototype-walkthrough.mp4',
      saved: true,
    },
  ])

  await Note.insertMany([
    {
      user: instructor._id,
      title: 'Module 1 improvements',
      course: uxCourse.title,
      body: 'Add a short checklist before the onboarding critique activity.',
    },
    {
      user: instructor._id,
      title: 'Office hours topics',
      course: visualCourse?.title || uxCourse.title,
      body: 'Cover spacing tokens, variants, and handoff mistakes.',
    },
  ])

  await Discussion.insertMany([
    {
      user: instructor._id,
      title: 'How should we document edge cases in personas?',
      course: researchCourse?.title || uxCourse.title,
      author: instructor.name,
      tags: ['Research', 'Personas'],
      excerpt: 'Collect practical examples from interviews and document only decisions that affect the design.',
      replies: [
        {
          author: 'Demo Admin',
          body: 'Keep the edge cases near the behavior notes and link them to scenarios.',
        },
      ],
    },
    {
      user: instructor._id,
      title: 'Best way to hand off responsive states',
      course: visualCourse?.title || uxCourse.title,
      author: instructor.name,
      tags: ['Handoff', 'Components'],
      excerpt: 'Use breakpoint-specific notes and keep the base component clean.',
      replies: [],
    },
  ])

  await DashboardTask.insertMany([
    {
      user: instructor._id,
      title: 'Review pending assignments',
      date: 'Monday, 08 June 2026',
      done: false,
    },
    {
      user: instructor._id,
      title: 'Upload class resources',
      date: 'Tuesday, 09 June 2026',
      done: false,
    },
    {
      user: instructor._id,
      title: 'Finalize recording links',
      date: 'Friday, 05 June 2026',
      done: true,
    },
    {
      user: admin._id,
      title: 'Audit instructor course updates',
      date: 'Tuesday, 09 June 2026',
      done: false,
    },
  ])

  await Notification.insertMany([
    {
      user: instructor._id,
      title: 'Live class starts soon',
      description: 'Design systems office hours is scheduled for today.',
      time: '1 hr ago',
      read: false,
    },
    {
      user: instructor._id,
      title: 'Assignment deadline',
      description: 'Check pending assignments due this week.',
      time: 'Yesterday',
      read: false,
    },
    {
      user: instructor._id,
      title: 'Recording uploaded',
      description: 'Persona validation workshop replay is now available.',
      time: '2 days ago',
      read: true,
    },
    {
      user: admin._id,
      title: 'Catalog updated',
      description: 'Demo instructor courses and assignments are ready for review.',
      time: 'Just now',
      read: false,
    },
  ])

  await UserSettings.insertMany([
    {
      user: instructor._id,
      weeklyDigest: true,
      classReminders: true,
      compactMode: false,
    },
    {
      user: admin._id,
      weeklyDigest: true,
      classReminders: false,
      compactMode: false,
    },
  ])

  await Blog.insertMany(
    blogs.map((b) => ({
      legacyId: b.id,
      title: b.title,
      slug: slugify(b.title),
      category: b.category,
      image: b.image,
      date: b.date,
      summary: b.summary,
      content: b.content,
    }))
  )

  console.log('Seed complete')
  console.log('Instructor login: instructor@knowledgepulse.com / password123')
  console.log('Admin login: admin@knowledgepulse.com / password123')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
