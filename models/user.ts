import  {Schema, model, models} from 'mongoose';
import Email from 'next-auth/providers/email';

const userSchema = new Schema({
    email : {
        type : String,
        unique : [true,"Email already exists"],
        required : [true,"Email is required"],
    },
    name : {
        type : String,
        required : [true,"Name is required"],
    },
    image : {
        type : String,
    },
});

const User = models.User || model("User",userSchema);
export default User