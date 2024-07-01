// controllers/messageController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Message from "../models/messageSchema.js";
import { validateMessage } from "../validator/validateMessage.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    const { isValid, errors } = validateMessage({ firstName, lastName, email, phone, message });

    if (!isValid) {
        return next(new ErrorHandler(JSON.stringify(errors), 400));
    }

    await Message.create({ firstName, lastName, email, phone, message });
    res.status(200).json({
        success: true,
        message: "Message Sent!",
    });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    // try {
    const messages = await Message.getAll();
    res.status(200).json({
        success: true,
        messages,
    });
    // } catch (error) {
    // return next(new ErrorHandler(error.message, 400));
    // }
});
