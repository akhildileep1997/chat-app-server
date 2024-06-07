import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access denied",
      });
    }
    const decoded = jwt.verify(token, process.env.Jwt_secret);
    if (!decoded) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access denied, no token found",
      });
    }
    console.log(decoded.userId);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "No user found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: "Error in protected route, server error",
      error: error.message,
    });
  }
};

export default protectRoute
