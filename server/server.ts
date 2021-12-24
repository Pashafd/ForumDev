import express from "express";
import { connectDB } from "../config/db";

const app = express();
express.json({});

// Connect DB
connectDB();

// Init Middleware
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => res.send("API Running"));

// Define routes
app.use("/api/auth", require("./routes/api/auth.ts"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/posts", require("./routes/api/post.ts"));
app.use("/api/profile", require("./routes/api/profile"));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
