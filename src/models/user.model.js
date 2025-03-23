import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new Schema(
    {
        username:{
            type:String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
    
        email:{
            type:String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fulname:{
            type:String,
            require: true,
            trim: true,
            index: true
        },
        avatar:{
            type:String, // cloudinary url 
            require: true,
        },
        coverImage:{
            type:String, // cloudinary url 
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId, // give type of object id for conn b/w to model
                ref: "Video" // where it id avaible
            }
        ],
        password:{
            type: String,
            required: [true , "Password is required"]
        },
        refreshToken:{
            type: String
        }
    },
    {
        timestamps:true
    }
)

//pre hook from moongose to encrypt password

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//to compare we use password that user write to login and the stored pass in db that is encrypted so we use 
//custom method from mongoose to compare and use bcrypt 

userSchema.methods.isPasswprdCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//methods to generate acces token $ refresh token using jwt
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
     {
        _id:this._id,
        email: this.email,
        username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
            {
            _id:this._id,
            },
           process.env.REFRESH_TOKEN_SECRET,
           {
               expiresIn: process.env.REFRESH_TOKEN_EXPIRY
           }
       )
}


export const User = mongoose.model("User", userSchema)