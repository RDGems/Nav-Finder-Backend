export enum AccountType {
    Admin = 'Admin',
    User = 'User',
    Guest = 'Guest',
}
export enum Gender {
    MALE = "Male",
    FEMALE = "Female"
}
export enum AccountStatus {
    ACTIVE = 'Active',
    INACTIVE = 'InActive',
    BLOCKED = 'Blocked',
    DELETED = 'Deleted'
}
export enum SecurityQuestions {
    FirstPet = "What is your pet's name?",
    FirstCar = "What was the make and model of your first car?",
    ChildhoodStreet = "What was the name of the street where you grew up?",
    FirstSchool = "What was the name of your first school?",
    MothersMaidenName = "What is your mother's maiden name?",
    FavoriteMovie = "What is your favorite movie?",
    FavoriteBook = "What is your favorite book?",
    FavoriteColor = "What is your favorite color?",
    FathersMiddleName = "What is your father's middle name?",
    FavoriteTeacher = "What was the name of your favorite teacher?"
}

export const vehicleOptions = ["Car", "Bus", "Bike", "Rickshaw"];
export const documentTypes = [
    "aadhaarcard",
    "pancard",
    "drivingLicence",
    "vehicleRegistration",
    "insurance",
    "driverPhoto",
    "vehiclePermit"
];