import User from '../model/userModel.js'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../token/generateToken.js';


//logic for sign up
export const signUpUserController = async(req, res) => {
  try {
    const { fullName, userName, password, gender, confirmPassword } = req.body
    if (password !== confirmPassword) {
      console.log('inside sign-up api 1');
      return res.status(400).send({
        success: false,
        message:'password and confirm password does not match'
      })
    }
    const user = await User.findOne({ userName });
    if (user) {
          console.log("inside sign-up api 2");
            return res.status(400).send({
              success: false,
              message: "user already exist please log in",
            });
    } 
    console.log("inside sign-up api 3");
    //dynamically setting avatar (from avatar placeholder)
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
    //hashing
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    //new user
    const newUser = new User({
      fullName,
      userName,
      password:hashedPassword,
      gender,
      profilePic:gender == 'male' ? boyProfilePic : girlProfilePic
    })
    generateTokenAndSetCookie(newUser._id,res)
    await newUser.save();
    return res.status(201).send({
      success: true,
      message: `Your account with user-name ${userName} created successfully`,
      user: newUser,
    })
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: 'something went wrong server error',
      error:error.message
    })
  }
};

//login for login
export const loginUserController = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    const passwordMatch = await bcrypt.compare(password, user?.password || "");
    if (!user || !passwordMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    generateTokenAndSetCookie(user._id, res);
    return res.status(200).send({
      success: true,
      message: `Welcome ${userName}`,
      user: user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: "Something went wrong server error",
      error: error.message,
    });
  }
};



// logout
export const logoutUserController = async(req, res) => {
  try {
    res.cookie('jwt', "", { maxAge: 0 })
    return res.status(200).send({
      success: true,
      message:'logged out successfully'
    })
  } catch (error) {
            console.log(error.message);
            return res.status(500).send({
              success: false,
              message: "something went wrong server error",
              error: error.message,
            });
  }
};
