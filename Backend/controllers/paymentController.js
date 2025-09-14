import axios from "axios";
import User from "../models/User.js";

export const initiatePayment = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isAccountVerified) {
      return res.status(400).json({ message: "Please verify your account first" });
    }

    // Determine amount from subscription plan
    let amount = 0;
    if (user.subscription.plan === "monthly") amount = 100; 
    if (user.subscription.plan === "yearly") amount = 1000; 

    // Call Chapa API
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency: "ETB",
        email: user.email,
        first_name: user.name,
        tx_ref: `tx-${Date.now()}`,
        callback_url: `${process.env.BACKEND_URL}/api/payment/callback`, // backend callback
        return_url: `${process.env.FRONTEND_URL}/payment/success`, // frontend success page
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ checkout_url: response.data.data.checkout_url });
  } catch (err) {
    console.error("Payment init error: ", err.response?.data || err.message);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

// Webhook callback (Chapa notifies after payment)
export const paymentCallback = async (req, res) => {
  const { status, tx_ref, email } = req.body; // check Chapa docs for exact payload

  try {
    if (status === "success") {
      const user = await User.findOne({ email });
      if (user) {
        const now = new Date();
        const endDate =
          user.subscription.plan === "monthly"
            ? new Date(now.setMonth(now.getMonth() + 1))
            : new Date(now.setFullYear(now.getFullYear() + 1));

        user.subscription.isActive = true;
        user.subscription.startDate = new Date();
        user.subscription.endDate = endDate;
        await user.save();
      }
    }

    res.json({ message: "Payment processed" });
  } catch (err) {
    console.error("Payment callback error: ", err.message);
    res.status(500).json({ message: "Payment processing failed" });
  }
};