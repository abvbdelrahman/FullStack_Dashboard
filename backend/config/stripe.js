import Stripe from 'stripe'

let stripe

export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }

  return stripe
}

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY)
