import multer from 'multer'
import { AppError } from '../utils/AppError.js'

const storage = multer.memoryStorage()

const videoFileFilter = (req, file, callback) => {
  if (!file.mimetype.startsWith('video/')) {
    return callback(new AppError('Only video files are allowed', 400))
  }

  callback(null, true)
}

export const uploadLectureVideo = multer({
  storage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
})
