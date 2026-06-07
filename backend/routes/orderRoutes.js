import { Router } from 'express'
import {
  createCheckoutSession,
  verifyCheckoutSession,
  getMyOrders,
} from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { checkoutSessionSchema } from '../schemas/orderSchemas.js'

const router = Router()

router.use(protect)
router.get('/', getMyOrders)
router.post('/checkout-session', validate(checkoutSessionSchema), createCheckoutSession)
router.get('/verify-session/:sessionId', verifyCheckoutSession)

export default router
