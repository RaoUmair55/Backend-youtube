import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) =>{
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
   const {fullName, email, username, password} = req.body
   console.log("email" , email)
   console.log("username" , username)

  
//    if(fullName ===""){
//     throw new ApiError(400, "fullname is required")
//    }
    if ([fullName, email, username, password].some((field)=>
    field?.trim() === "")
       ) {
        throw new ApiError(400, "All fied are required")
    }

    const existedUser = await User.findOne({
        $or:[{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409 , "User with this email or user name already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;  //take file then store in folder 
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,  "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avataer file is required")
    }



    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something wrog while registering user")
    }


    return res.status(201).json(
       new ApiResponse(200, createdUser, "User regertred successfully")
    )

})



export {registerUser}