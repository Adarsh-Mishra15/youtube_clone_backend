import mongoose from "mongoose";
import { asyncHandler } from "../utils/asynchandler.js";

const healthCheck = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

export {healthCheck}