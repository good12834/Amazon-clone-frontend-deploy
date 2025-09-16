const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (request, response) => response.status(200).send("hello world"));

app.post("/payment/create", async (request, response) => {
  const total = request.query.total;
  logger.log("Payment Request Received for this amount >>> ", total);

  const stripeInstance = stripe(functions.config().stripe.key);
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});
exports.api = onRequest({ cors: true, maxInstances: 10 }, app);



