import User from "../model/userModel.js";

//logic for fetching all users
export const getUsersForSidebarController = async (req, res) => {
  try {
    console.log('inside side bar logic');
    const loggedInUserId = req.user._id;
    console.log(loggedInUserId);
    const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    // console.log(allUsers);
    return res.status(200).send({
      success: true,
      message: `All users except user with ID ${loggedInUserId} fetched`,
      users: allUsers,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      success: false,
      message: "Something went wrong, server error",
      error: error.message,
    });
  }
};
//logic for getting single user details
export const getSingleUserDetailController = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: id })
    if (user) {
      return res.status(200).send({
        success: true,
        message: `details of ${user.fullName} fetched successfully`,
        user:user
      })
    } else {
      return res.status(404).send({
        success: false,
        message:'cannot get user details'
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message:'server error,something went wrong in single user'
    })
  }
}

//logic for updating user details

export const updateUserDetailsController = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "from params");

    const { userName } = req.body;
    const profilePic = req.file ? req.file.filename : undefined;
    console.log(req.body, "body data");
    console.log(profilePic, "file data");

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User details not found",
      });
    }

    if (userName) {
      user.userName = userName;
    }
    if (profilePic) {
      user.profilePic = profilePic;
    }

    const updatedUserDetails = await user.save();

    if (updatedUserDetails) {
      return res.status(200).send({
        success: true,
        message: `Details of ${updatedUserDetails.userName} updated successfully`,
        user: updatedUserDetails,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Server error, something went wrong in updating user details",
    });
  }
};


