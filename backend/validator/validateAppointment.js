import validator from 'validator';

export const validateAppointment = (data) => {
    let errors = {};

    if (!data.firstName || data.firstName.length < 3) {
        errors.firstName = "First Name Must Contain At Least 3 Characters!";
    }

    if (!data.lastName || data.lastName.length < 3) {
        errors.lastName = "Last Name Must Contain At Least 3 Characters!";
    }

    if (!data.email || !validator.isEmail(data.email)) {
        errors.email = "Provide A Valid Email!";
    }

    if (!data.phone || data.phone.length !== 11) {
        errors.phone = "Phone Number Must Contain Exact 11 Digits!";
    }

    if (!data.nic || data.nic.length !== 13) {
        errors.nic = "NIC Must Contain Only 13 Digits!";
    }

    if (!data.dob) {
        errors.dob = "DOB Is Required!";
    }

    if (!data.gender || (data.gender !== 'Male' && data.gender !== 'Female')) {
        errors.gender = "Gender Is Required!";
    }

    if (!data.appointment_date) {
        errors.appointment_date = "Appointment Date Is Required!";
    }

    if (!data.department) {
        errors.department = "Department Name Is Required!";
    }

    if (!data.doctor || !data.doctor.firstName || !data.doctor.lastName) {
        errors.doctor = "Doctor Name Is Required!";
    }

    if (!data.address) {
        errors.address = "Address Is Required!";
    }

    if (!data.doctorId) {
        errors.doctorId = "Doctor Id Is Invalid!";
    }

    if (!data.patientId) {
        errors.patientId = "Patient Id Is Required!";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};
