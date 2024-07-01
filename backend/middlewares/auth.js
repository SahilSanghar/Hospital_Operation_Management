import User from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncErrors(async(req, res, next) => {
    try {
        const token = req.cookies.adminToken;
        if (!token) {
            return next(new ErrorHandler("Admin Not Authenticated!", 400));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByEmail(decoded.id);

        if (!user) {
            return next(new ErrorHandler("Admin Not Found!", 404));
        }

        if (user.role !== "Admin") {
            return next(new ErrorHandler("Unauthorized Access!", 403));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid Token!", 401));
    }
});

export const isPatientAuthenticated = catchAsyncErrors(async(req, res, next) => {
    const token = req.cookies.patientToken;
    if(!token) {
        return next(new ErrorHandler("Patient Not Authenticated!", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findByEmail(decoded.id);
    if(req.user.role !== "Patient") {
        return next(
            new ErrorHandler(
                `${req.user} not authorized for this resources!`,
                403
            )
        );
    }
    next();
});