import Jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = Jwt.sign({ userId }, process.env.Jwt_secret, {
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //milli second format
      httpOnly: true, //prevent un-authorized access
      sameSite: 'strict',
    secure:process.env.NODE_ENV !== 'development'
  });

};

export default generateTokenAndSetCookie