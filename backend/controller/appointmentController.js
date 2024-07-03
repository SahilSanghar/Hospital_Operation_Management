import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Appointment from "../models/appointmentSchema.js";
import User from "../models/userSchema.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited = false,
        address,
    } = req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !address
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department,
    });

    if (isConflict.length === 0) {
        return next(new ErrorHandler("Doctor not found", 404));
    }

if (isConflict.length > 1) {
    return next(
    new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
    )
    );
}

    const doctorId = isConflict[0].id;
    const patientId = req.user.id;

const appointmentData = {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
        firstName: doctor_firstName,
        lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
    status: 'Pending'
    };

try {
    const appointmentId = await Appointment.create(appointmentData);
    res.status(200).json({
        success: true,
        appointmentId,
        message: "Appointment Send!",
    });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
try {
    const appointments = await Appointment.getAll();
    res.status(200).json({
        success: true,
        appointments,
    });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

try {
    let appointment = await Appointment.getById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404));
    }

await Appointment.update(id, req.body);
    res.status(200).json({
        success: true,
        message: "Appointment Status Updated!",
    });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

try {
    let appointment = await Appointment.getById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment Not Found!", 404));
    }

    await Appointment.delete(id);
    res.status(200).json({
        success: true,
        message: "Appointment Deleted!",
    });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
