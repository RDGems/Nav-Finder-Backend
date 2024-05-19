import { body, param } from "express-validator";


const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("userName")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLength({ min: 3 })
            .withMessage("Username must be at lease 3 characters long"),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')

    ];
};
const userLoginValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid")
    ];
};
const userOnboardingValidator = () => {
    return [
        body("firstName")
            .trim()
            .notEmpty()
            .withMessage("Firstname is required")
            .isLength({ min: 3 })
            .withMessage("Firstname must be at lease 3 characters long"),
        body("lastName")
            .trim()
            .notEmpty()
            .withMessage("Lastname is required")
            .isLength({ min: 3 })
            .withMessage("Lastname must be at lease 3 characters long"),
        body("mobile")
            .trim()
            .notEmpty()
            .withMessage("Mobile number is required"),
        body("address.landmark")
            .trim()
            .notEmpty()
            .withMessage("Landmark is required"),
        body("address.street")
            .trim()
            .notEmpty()
            .withMessage("Street is required"),
        body("address.city")
            .trim()
            .notEmpty()
            .withMessage("City is required"),
        body("address.state")
            .trim()
            .notEmpty()
            .withMessage("State is required"),
        body("address.country")
            .trim()
            .notEmpty()
            .withMessage("Country is required"),
        body("address.postalCode")
            .trim()
            .notEmpty()
            .withMessage("Postal code is required"),
        body("dob")
            .trim()
            .notEmpty()
            .withMessage("Date of birth is required"),
        body("gender")
            .trim()
            .notEmpty()
            .withMessage("Gender is required"),
        body("securityQuestions.question1")
            .trim()
            .notEmpty()
            .withMessage("Security question is required"),
        body("securityQuestions.answer1")
            .trim()
            .notEmpty()
            .withMessage("Security answer is required")
    ];
};
const passwordResetValidators = () => {
    return [
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    ];
};
export {
    userLoginValidator,
    userRegisterValidator,
    userOnboardingValidator,
    passwordResetValidators
};
