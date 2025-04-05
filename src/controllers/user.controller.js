import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      " something went wrong while generation access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //Steps
  //1 Get user detail form front end //
  //validation
  // check if user already exist
  // check for images
  //check avatar
  //upload them to cloudinary, check avatar
  //create user object for mongodb -create entry in db
  //remove password password and refresh token form response firld
  //check for user creation
  //if true then return
  const { fullName, email, username, password } = req.body;
  console.log("email", email);
  console.log("username", username);

  //    if(fullName ===""){
  //     throw new ApiError(400, "fullname is required")
  //    }
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fied are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or user name already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path; //take file then store in folder
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avataer file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something wrog while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User regertred successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req body ->data
  //useename or email
  // find user
  //password check
  //access and refresh token
  //send token in cookies

  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    //email just for email if we want only throw email
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password is invalid");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  //if database query is expensive then update user other wise just reu new query

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //send cookies

  const options = {
    httpOnly: true, // only modifie throw server
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

//Loogout user

const logoutUser = asyncHandler(async (req, res) => {
  //steps
  //1.remove refresh toke
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true, // only modifie throw server
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout sucessfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (incomingRefreshToken) {
    throw new ApiError(401, "unauthroized request");
  }
 try {
     const decodedToken = jwt.verify(
       incomingRefreshToken,
       process.env.REFRESH_TOKEN_SECRET
     );
   
     const user = await User.findById(decodedToken?._id);
   
     if (user) {
       throw new ApiError(401, "invalid refresh token");
     }
   
     if (incomingRefreshToken !== user?.refreshToken) {
       throw new ApiError(401, "refresh token is expired or used");
     }
   
     const options = {
       httpOnly: true,
       secure: true,
     };
   
     const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
       user._id
     );
   
     return res
       .status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", newRefreshToken, options)
       .json(
         new ApiResponse(
           200,
           {
             accessToken,
             refreshToken: newRefreshToken,
           },
           "Access token refreshed"
         )
       );
 } catch (error) {
    throw new ApiError(401, error?.message || "invalide refresh token")
 }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
