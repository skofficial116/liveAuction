import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Stripe from "stripe";

export const clerkWebhooks = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "user.created") {
      await User.create({
        _id: data.id,
        _name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        _email: data.email_addresses?.[0]?.email_address,
        _imageUrl: data.image_url,
      });
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  const event = request.body;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"];
    try {
      event = Stripe.webhooks.constructEvent(
        request.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);

      const courseData = await Course.findById(
        purchaseData.courseId.toString()
      );
      courseData.enrolledStudents.push(userData);

      await courseData.save();
      userData.enrolledCourses.push(courseData._id);
      // Then define and call a method to handle the successful payment intent.
      purchaseData.status = "completed";
      await purchaseData.save();
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentMethod = event.data.object;
      const paymentIntentId = paymentIntentId;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);

      purchaseData.status = "failed";
      await purchaseData.save();
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.json({received:true})
};
