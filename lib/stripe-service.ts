import stripe from 'stripe';

const stripeSecretKey = new stripe(process.env.STRIPE_SECRET_KEY || "",{
    apiVersion: "2030-11-15",
});
export default stripeSecretKey;