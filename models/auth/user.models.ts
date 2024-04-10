import mongoose, { Schema } from 'mongoose';
import { AccountType, Gender, AccountStatus, SecurityQuestions } from '../../utils/constants/model.constants';
const validator = require("validator");
import Jwt from "jsonwebtoken"
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
    // base fields for signup
    userName: {
        type: String,
        required: [true, "Please enter your username"],
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
        maxLength: [15, "Your username is up to 15 characters"],
        minLength: [3, "Your username is at least 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid email"],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        minlength: [8, "Password should contain atleast 8 characters"],
        maxlength: [50, "Password should be not more than 50 characters"],
        validate: {
            validator: function (v: string) {
                // Regular expression to check if password contains at least one uppercase letter, one lowercase letter, one digit, and one special character
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/;
                return regex.test(v);
            },
            message: "Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
        }
    },
    accountType: {
        type: String,
        enum: Object.values(AccountType),
        default: AccountType.User,
        required: [true, "AccountType is required"],
    },


    // Onboarding process models

    firstName: {
        type: String,
        trim: true,
        // maxLength: [50, "First name is up to 50 characters"],
        // minLength: [3, "First name is at least 3 characters"]
    },
    lastName: {
        type: String,
        trim: true,
        // maxLength: [50, "Last name is up to 50 characters"],
        // minLength: [3, "Last name is at least 3 characters"]
    },
    avatar: {
        type: {
            url: String,
            localPath: String,
        },
    },
    mobile: {
        type: String,
        trim: true,
        // validate: [validator.isMobilePhone, "Please enter valid mobile number"]
    },

    address: {
        landmark: {
            type: String,
            trim: true,
            // maxLength: [100, "Landmark is up to 100 characters"]
        },
        street: {
            type: String,
            trim: true,
            // required: [true, "Street is required"],
            // maxLength: [100, "Street is up to 100 characters"]
        },
        city: {
            type: String,
            trim: true,
            // required: [true, "City is required"],
            // maxLength: [50, "City is up to 50 characters"]
        },
        state: {
            type: String,
            trim: true,
            // required: [true, "State is required"],
            // maxLength: [50, "State is up to 50 characters"]
        },
        postalCode: {
            type: String,
            trim: true,
            // required: [true, "Postal code is required"],
            // maxLength: [20, "Postal code is up to 20 characters"]
        },
        country: {
            type: String,
            trim: true,
            // required: [true, "Country is required"],
            // maxLength: [50, "Country is up to 50 characters"]
        }
    },

    dob: {
        type: Date,
        // required: [true, "Date of birth is required"]
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
        // required: [true, "Gender is required"],
    },
    AccountStatus: {
        type: String,
        enum: Object.values(AccountStatus),
        default: AccountStatus.INACTIVE,
    },
    securityQuestions: {
        question1: {
            type: String,
            // required: [true, "Please enter security question 1"],
            trim: true,
            maxLength: [100, "Security question 1 is up to 100 characters"],
            enum: Object.values(SecurityQuestions),
        },
        answer1: {
            type: String,
            // required: [true, "Please enter answer for security question 1"],
            trim: true,
            maxLength: [100, "Answer for security question 1 is up to 100 characters"]
        }
    },

    isOnboarded: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: ""
    },
    emailVerificationToken: {
        type: String,
        default: ""
    },
    emailVerificationTokenExpiresAt: {
        type: Date,
    },
    forgotPasswordToken: {
        type: String,
        default: ""
    },
    forgotPasswordTokenExpiresAt: {
        type: Date,
    },
},

    { timestamps: true }
)


// generate hashed password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// validate password
userSchema.methods.validatePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

// Generate AccessToken
userSchema.methods.generateAccessToken = async function () {
    const payload = {
        id: this._id,
        email: this.email,
        userName: this.userName,
        accountType: this.accountType,
        AccountStatus: this.AccountStatus,
        isOnboarded: this.isOnboarded,
    };
    return Jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET!, { expiresIn: process.env.JWT_ACCESS_EXPIRY });
}
// Generate RefreshToken
userSchema.methods.generateRefreshToken = async function () {
    const payload = {
        id: this._id,
        email: this.email,
        userName: this.userName,
        accountType: this.accountType,
        AccountStatus: this.AccountStatus,
        isOnboarded: this.isOnboarded,
    };
    return Jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET!, { expiresIn: process.env.JWT_REFRESH_EXPIRY });
}
userSchema.methods.generateTemporaryToken = async function () {
    // const unHashedToken
    return Jwt.sign({ email: this.email, userName: this.userName }, process.env.JWT_EMAIL_TOKEN_SECRET!, {
        expiresIn: process.env.JWT_EMAIL_EXPIRY
    })

}

const User = mongoose.models.user || mongoose.model('User', userSchema);
export default User;