import express from "express";
import { config } from "dotenv";
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import errorMiddleware from "./middlewares/error.js";

const app = express();
config({ path: "./config/.env"})

// Debugging Middleware
app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    console.log('Request headers:', req.headers);
    next();
});

app.use(
    cors({
        origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
    })
);

app.use((req, res, next) => {
    console.log('Parsed request body:', req.body);
    next();
});

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);

app.use(errorMiddleware)

export default app;