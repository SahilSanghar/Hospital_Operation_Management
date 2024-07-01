import validator from 'validator';

export const validateUser = (data, isNewUser = true) => {
    let errors = {};

    if (!data) {
        errors.general = 'User data is missing.';
        return { isValid: false, errors };
    }

    if (!data.firstName || data.firstName.length < 3) {
        errors.firstName = 'First Name must be at least 3 characters long.';
    }

    if (!data.lastName || data.lastName.length < 3) {
        errors.lastName = 'Last Name must be at least 3 characters long.';
    }

    if (!data.email || !validator.isEmail(data.email)) {
        errors.email = 'Please provide a valid email address.';
    }

    if (!data.phone || !validator.isLength(data.phone, { min: 11, max: 11 })) {
        errors.phone = 'Phone Number must contain exactly 11 digits.';
    }

    if (!data.nic || !validator.isLength(data.nic, { min: 13, max: 13 })) {
        errors.nic = 'NIC must contain exactly 13 digits.';
    }

    if (!data.dob || !validator.isDate(data.dob)) {
        errors.dob = 'Please provide a valid date of birth.';
    }

    if (!data.gender || !['Male', 'Female'].includes(data.gender)) {
        errors.gender = "Gender must be either 'Male' or 'Female'.";
    }

    if (isNewUser && (!data.password || data.password.length < 8)) {
        errors.password = 'Password must be at least 8 characters long.';
    }

    if (!data.role || !['Patient', 'Doctor', 'Admin'].includes(data.role)) {
        errors.role = "Role must be either 'Patient', 'Doctor', or 'Admin'.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
