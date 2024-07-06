import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import User from "../models/userSchema.js"; 
import ErrorHandler from "../middlewares/error.js";
import { validateUser } from "../validator/validateUser.js";
import { db } from "../database/firebase.js";
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtToken.js'
import cloudinary from 'cloudinary';

export const patientRegister = catchAsyncErrors(async (req, res, next) => {

    const { firstName, lastName, email, phone, nic, dob, gender, password, role } = req.body;
    
    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !password
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    
    const { isValid, errors } = validateUser(req.body);
    if (!isValid) {
        const errorMessage = Object.values(errors).join(', ');
        return next(new ErrorHandler(errorMessage, 400));
    }

    try {
        const userRef = db.collection('users');
        const querySnapshot = await userRef.where('email', '==', email).get();
        if (!querySnapshot.empty) {
            return next(new ErrorHandler("User already registered!", 400));
        }

        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            password,
            role,
        });

        await user.save();

        generateToken(user, "User Registered!", 200, res)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword || !role) {
        console.log("Validation failed: Please Provide All Details");
        return next(new ErrorHandler("Please Provide All Details", 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password and Confirm password doesn't match!", 400));
    }

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            console.log("User not found: Invalid Email Or Password");
            return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        console.log("Password mismatch: Invalid Email Or Password");
        return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }

    if (role !== user.role) {
        console.log("Role mismatch: User Not Found With This Role");
        return next(new ErrorHandler("User Not Found With This Role!", 400));
    }
    console.log("Login successful");

    generateToken(user, "User Logged In!", 200, res)

    } catch (error) {
        console.error("Login error:", error.message);
        return next(new ErrorHandler(error.message, 500));
    }
});

export const addNewAdmin = catchAsyncErrors(async(req, res, next) => {
    const { firstName, lastName, email, phone, nic, dob, gender, password } = req.body;
    console.log(req.body)
    if( !firstName || !lastName || !email || !phone || !nic || !dob || !gender || !password ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    const userRef = db.collection('users');
    const querySnapshot = await userRef.where('email', '==', email).get();
    if (!querySnapshot.empty) {
        return next(new ErrorHandler("User already registered!", 400));
    }

    const user = new User({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        role: "Admin",
    });

    await user.save();
    res.status(200).json({
        success: true,
        message: "New Admin Registered!",
    })
});

export const getAllDoctors = catchAsyncErrors(async(req, res, next) => {
    try {
        const doctors = await User.findByRole('Doctor');
        res.status(200).json({
            success: true,
            doctors,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

export const getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async(req, res, next) => {
    res
        .status(200)
        .cookie("adminToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Admin Logged Out Successfully",
        });
});

export const logoutPatient = catchAsyncErrors(async(req, res, next) => {
    res
        .status(200)
        .cookie("patientToken", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Patient Logged Out Successfully",
        });
});

export const addNewDoctor = catchAsyncErrors(async(req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if(!allowedFormats.includes(docAvatar.mimetype)){
        return next(new ErrorHandler("File Format not Supported!", 400));
    }
    const {
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            password,
            doctorDepartment
        } = req.body;

    if (
        (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !password ||
        !doctorDepartment)
    ) {
        return next(new ErrorHandler("Please Provide Full Details!", 400));
    }
        const userRef = db.collection('users');
        const querySnapshot = await userRef.where('email', '==', email).get();
        if (!querySnapshot.empty) {
            return next(new ErrorHandler("User already registered!", 400));
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(
            docAvatar.tempFilePath
        );

        if( !cloudinaryResponse || !cloudinaryResponse.error) {
            console.error(
                "Cloudinary Error:",
                cloudinaryResponse.error || "Unknown Cloudinary Error"
            );
        }

        const doctor = new User({
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            password,
            role: "Doctor",
            doctorDepartment,
            docAvatar: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            }
        });
        await doctor.save();
        res.status(200).json({
            success: true,
            message: "New Doctor Registered!",
            doctor
        });
});