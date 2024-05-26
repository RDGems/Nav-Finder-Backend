

export const lookupData = {
    genders: [
        { key: 'Male', value: 'Male' },
        { key: 'Female', value: 'Female' },
        { key: 'Others', value: 'Others' },
    ],
    securityQuestions: [
        { "key": "FirstPet", "value": "What is your pet's name?" },
        { "key": "FirstCar", "value": "What was the make and model of your first car?" },
        { "key": "ChildhoodStreet", "value": "What was the name of the street where you grew up?" },
        { "key": "FirstSchool", "value": "What was the name of your first school?" },
        { "key": "MothersMaidenName", "value": "What is your mother's maiden name?" },
        { "key": "FavoriteMovie", "value": "What is your favorite movie?" },
        { "key": "FavoriteBook", "value": "What is your favorite book?" },
        { "key": "FavoriteColor", "value": "What is your favorite color?" },
        { "key": "FathersMiddleName", "value": "What is your father's middle name?" },
        { "key": "FavoriteTeacher", "value": "What was the name of your favorite teacher?" },
        { "key": "OTHERS", "value": "Others" }
    ],
    documents: [
        { "key": "aadhaarcard", "value": "Aadhaar Card" },
        { "key": "pancard", "value": "PAN Card" },
        { "key": "drivingLicence", "value": "Driving License - Front" },
        { "key": "vehicleRegistration", "value": "Registration Certificate (RC)" },
        { "key": "insurance", "value": "Vehicle Insurance" },
        { "key": "vehiclePermit", "value": "Vehicle Permit" },
        { "key": "driverPhoto", "value": "Profile Photo" },
    ],
    documentContents: [
        {
            "key": "aadhaarcard", "value": {

                "content": `Enter your Aadhaar and we'll get your information from UIDAI. By
            sharing your Aadhar details, you hereby confirm that you have shared
            such details voluntarily.`,
                "image": true,
                "name": false,
                "expiry": false,
                "idnumber": true,
            }
        },
        {
            "key": "pancard", "value": {

                "content": `Enter your PAN card number and we'll get the required information
            from the NSDL, or you can upload your PAN card instead.`,
                "image": true,
                "name": false,
                "expiry": false,
                "idnumber": true,
            }
        },
        {
            "key": "vehicleRegistration", "value": {

                "content": `Enter your licence plate number and we'll get the required information
            from the Vahan and Sarathi portal of MoRTH, or you can upload your
            Registration Certificate (RC) instead.`,
                "image": true,
                "name": true,
                "expiry": true,
                "idnumber": true,
            }
        },
        {
            "key": "insurance", "value": {
                "content": `Make sure photo is not blurred and these details are clearly visible -
            Model, Vehicle number, Chasis number, Registration Name, Start Date,
            Expiry Date, Financier name or Company name. You may need to
            submit additional photos if your document has multiple pages or
            sides or if first image was not clear.`,
                "image": true,
                "name": true,
                "expiry": true,
                "idnumber": true,
            }
        },
        {
            "key": "vehiclePermit", "value": {

                "content": `If the vehicle owner name on the vehicle documents is different from mine, then
            I hereby confirm that I have the vehicle owners consent to drive this vehicle on
            the navfinder Platform, This declaration can be treated as a No-Objection Certificate (NOC)
            and releases navfinder from any legal obligations and consequences.`,
                "image": true,
                "name": true,
                "expiry": true,
                "idnumber": true,
            }
        },
        {
            "key": "drivingLicence", "value": {

                "content": `Your driving license is essential for verifying your eligibility to drive. Please ensure that the details are clearly visible in the uploaded image. Note that once you submit your driving license, it cannot be changed unless it's expired or renewed.`,

                "image": true,
                "name": false,
                "expiry": true,
                "idnumber": true,
            }
        },
        {
            "key": "driverPhoto", "value": {

                "content": `Your profile photo helps people recognize you. Please note that once you submit
            your profile photo it cannot be changed. 
            `,

                "image": true,
                "name": false,
                "expiry": false,
                "idnumber": false,
            }
        }


    ],
    vehicleTypes: [
        {
            'vehicleType': "Car",
            'id': 1,
            'image': "uberGo",
            'title': "Drive four whellers with ease"
        },
        {
            'vehicleType': "Bike",
            'id': 2,
            'image': "bike",
            'title': "Bike with white number plate"
        },
        {
            'vehicleType': "Bike",
            'id': 3,
            'image': "bike",
            'title': "Bike with white number plate"
        },
        {
            'vehicleType': "Rickshaw",
            'id': 4,
            'image': "rickshaw",
            'title': "Drives took took with ease"
        },
        {
            'vehicleType': "Bus",
            'id': 5,
            'image': "bus",
            'title': "Experienced bus driver"
        }
    ]
};
