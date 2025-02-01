import subscriptionService from "../services/subscriptionService.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    const userDetails = await subscriptionService.subscribeToAffirmations(
      email
    );
    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ message: error.message || "Failed to subscribe" });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await subscriptionService.unsubscribeFromAffirmations(email);
    res
      .status(200)
      .json({ message: "Successfully unsubscribed from affirmations" });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({ message: error.message || "Failed to unsubscribe" });
  }
};

export const handleSubscriptionConfirmation = async (req, res) => {
  try {
    const message = req.body;

    await subscriptionService.handleSubscriptionConfirmation(message);
    res.status(200).json({ message: "Subscription confirmed successfully" });
  } catch (error) {
    console.error("Subscription confirmation error:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to confirm subscription" });
  }
};
