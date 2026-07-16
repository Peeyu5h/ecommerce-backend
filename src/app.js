import express, { json } from "express";
import  cors  from "cors";

import authRoutes  from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("App running")
});

export default app;