const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
app.use(express.json());
app.post('/create-payment-intent', async (req, res) => {
 try {
 const paymentIntent = await stripe.paymentIntents.create({
 amount: req.body.amount,
 currency: 'AUD',
 });
 res.json({ clientSecret: paymentIntent.client_secret });
 } catch (error) {
 res.status(500).json({ error: error.message });
 }
});
app.listen(3001, () => {
 console.log('Server is listening on port 3001');
});