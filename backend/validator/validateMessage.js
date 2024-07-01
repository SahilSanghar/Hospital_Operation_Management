import validator from "validator";

// validation.js (example structure)
export const validateMessage = (data) => {
    let errors = {};

    if (!data.firstName || data.firstName.length < 3) {
        errors.firstName = "First Name must be at least 3 characters long.";
    }

    if (!data.lastName || data.lastName.length < 3) {
        errors.lastName = "Last Name must be at least 3 characters long.";
    }

    if (!validator.isEmail(data.email)) {
        errors.email = "Please provide a valid email address.";
    }

    if (!validator.isLength(data.phone, { min: 10, max: 10 })) {
        errors.phone = "Phone Number must contain exactly 10 digits.";
    }

    if (!data.message || data.message.length < 10) {
        errors.message = "Message must be at least 10 characters long.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
