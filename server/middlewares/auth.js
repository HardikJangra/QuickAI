import { clerkClient } from "@clerk/clerk-sdk-node";
import { requireAuth } from "@clerk/express";

// Middleware to check user plan and usage
export const auth = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    await new Promise((resolve, reject) => {
      requireAuth()(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch user data from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Check premium plan from Clerk metadata (or your own logic)
    const hasPremiumPlan = user.publicMetadata?.plan === "premium";

    // For free users, handle free_usage
    if (!hasPremiumPlan) {
      let freeUsage = user.privateMetadata?.free_usage ?? 5; // Default 5 free credits

      if (freeUsage <= 0) {
        return res.status(403).json({
          success: false,
          message: "Free usage limit reached. Upgrade to premium.",
        });
      }

      // Decrease free usage
      freeUsage -= 1;

      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: freeUsage },
      });

      req.free_usage = freeUsage;
    } else {
      req.free_usage = Infinity; // Unlimited for premium
    }

    req.plan = hasPremiumPlan ? "premium" : "free";
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
