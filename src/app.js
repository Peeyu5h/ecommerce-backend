import express, { json } from "express";
import  cors  from "cors";

import authRoutes  from "./routes/auth.routes.js";

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("App running")
});

export default app;