import {loadStripe} from "@stripe/stripe-js"


const stripePromise = loadStripe(process.env.STRIPE_PUBLISH_KEY || "");
export default stripePromise;