import mongoose, { Schema } from 'mongoose';
import { AccountType, Gender, AccountStatus, SecurityQuestions } from '../../utils/common/model.constants';
import Jwt from "jsonwebtoken"
const bcrypt = require("bcryptjs");
const userSchema = new Schema({
    // base fields for signup
    userName: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,

    },
    accountType: {
        type: String,
        enum: Object.values(AccountType),
        default: AccountType.User,
    },


    // Onboarding process models

    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
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
    },

    address: {
        landmark: {
            type: String,
            trim: true,
        },
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        postalCode: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        }
    },

    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
    },
    AccountStatus: {
        type: String,
        enum: Object.values(AccountStatus),
        default: AccountStatus.INACTIVE,
    },
    securityQuestions: {
        question1: {
            type: String,
            trim: true,
            maxLength: [100, "Security question 1 is up to 100 characters"],
            enum: Object.values(SecurityQuestions),
        },
        answer1: {
            type: String,
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
    otp: {
        type: String,
        default: null
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
    isDriver:{
        type:Boolean,
        default:false
    }
},

    { timestamps: true }
)


// generate hashed password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
// validate password
userSchema.methods.validatePassword = async function (password: string) {
    const match = await bcrypt.compare(password, this.password);
    console.log(`Entered password: ${password}`);
    console.log(`Stored hashed password: ${this.password}`);
    console.log(`Passwords match: ${match}`);
    return match;
};

// Generate AccessToken
userSchema.methods.generateAccessToken = async function () {
    const payload = {
        id: this._id,
        email: this.email,
        userName: this.userName,
        accountType: this.accountType,
        AccountStatus: this.AccountStatus,
        isOnboarded: this.isOnboarded,
        isDriver:this.isDriver
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
        isDriver:this.isDriver
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