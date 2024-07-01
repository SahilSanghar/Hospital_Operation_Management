import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import User from "../models/userSchema.js"; 
import ErrorHandler from "../middlewares/error.js";
import { validateUser } from "../validator/ValidateUser.js";
import { db } from "../database/firebase.js";
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtToken.js'

export const patientRegister = catchAsyncErrors(async (req, res, next) => {

    const { firstName, lastName, email, phone, nic, dob, gender, password, role } = req.body;
    
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