import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4000" , // Allow specific domains
    credentials: true // Allow cookies to be sent
}));

app.use(express.json({ limit: "16kb" })); // Limit JSON body size to 16KB
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Limit URL-encoded data size to 16KB

app.use(express.static("public")); // Serve static assets from the "public" folder

app.use(cookieParser()); // Correctly call cookieParser middleware

// Routes declaration
import userRoutes from "./routes/user.routes.js"
app.use("/api/v1/users", userRoutes);


export default app;
