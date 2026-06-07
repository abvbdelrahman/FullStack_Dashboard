import { getStripe } from '../config/stripe.js'
import { fulfillOrders } from '../utils/fulfillOrders.js'

export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return res.status(503).json({ message: 'Stripe webhook secret is not configured' })
  }

  let event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderIds = session.metadata?.orderIds?.split(',').filter(Boolean) || []
    await fulfillOrders(orderIds)
  }

  res.json({ received: true })
}
