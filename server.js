const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
