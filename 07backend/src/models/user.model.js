import mongoose,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userSchema=new Schema({
 username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true //helps in searching for users by username
 },
 email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true 
 },

 fullName:{
    type:String,
    required:true,
    trim:true,
    lowercase:true
 },
 
 avatar:{
    type:String, //take URL of the avatar image using cloudinary service
    required:true
 },

 coverimage:{
    type:String
 },

 watchhistory:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video"
 }],

 password:{
    type:String,
    required:[true,"Password is required"]
 },

 refreshToken:{
    type:String,
 }


},
{
    timestamps:true
}


)

userSchema.pre('save',async function(next){ //pre is the hook that runs before saving the document,save is the event that triggers the hook ,and next is the callback function to proceed to the next middleware,asyn because bcrption take time to hash the password,arrow function is not used because it does not bind the this keyword to the user document
    if(!this.isModified('password')) return next(); //if password is not modified, then skip hashing
    this.password=await bcrypt.hash(this.password,10); //hash the password with 10 rounds of salt
    next(); //proceed to the next middleware
})

userSchema.methods.isPasswordCorrect=async function(enteredPassword){ //method to compare the entered password with the hashed password
    return await bcrypt.compare(enteredPassword,this.password);//this.password is the hashed password stored in the database
}

userSchema.methods.generateAccessToken= function(){ //method to generate access token
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName,
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
}

userSchema.methods.generateRefreshToken= function(){ //method to generate refresh token
    return jwt.sign({_id:this._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
}
export const User=mongoose.model('User',userSchema);