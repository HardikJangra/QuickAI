import { getAuth } from "@clerk/express";

export const auth = (req, res, next) => {
  try {
    const authData = getAuth(req);

    if (!authData || !authData.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = authData.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
