import { Readable } from 'node:stream'
import { v2 as cloudinary } from 'cloudinary'
import { AppError } from '../utils/AppError.js'

const requiredEnv = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']

export const isCloudinaryConfigured = () =>
  requiredEnv.every((key) => Boolean(process.env[key]))

export const getCloudinary = () => {
  if (!isCloudinaryConfigured()) {
    throw new AppError('Cloudinary is not configured on the server', 503)
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })

  return cloudinary
}

export const uploadVideoBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploader = getCloudinary().uploader.upload_stream(
      {
        resource_type: 'video',
        folder: process.env.CLOUDINARY_LECTURES_FOLDER || 'lms/lectures',
        overwrite: true,
        ...options,
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    Readable.from(buffer).pipe(uploader)
  })

export const getVideoThumbnailUrl = (publicId) =>
  getCloudinary().url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [{ start_offset: 'auto' }],
  })

export const deleteVideoAssets = async (publicIds = []) => {
  const uniquePublicIds = [...new Set(publicIds.filter(Boolean))]
  if (uniquePublicIds.length === 0 || !isCloudinaryConfigured()) return []

  return Promise.allSettled(
    uniquePublicIds.map((publicId) =>
      getCloudinary().uploader.destroy(publicId, { resource_type: 'video' })
    )
  )
}
