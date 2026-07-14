import express, { json } from "express";
import  cors  from "cors";

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("App running")
});

app.get("/health", (req, res) => {
    res.json({
        "status": "OK",
        "message": "Server is healthy"
    })
})

export default app;