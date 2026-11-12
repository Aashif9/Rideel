import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/auth.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.get("/", (req, res) => {
    res.send("RIDEEL Auth Service is running!");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Auth service is running on port ${PORT}`);
});
