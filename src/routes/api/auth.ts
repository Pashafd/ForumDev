import express from "express";
const router = express.Router();
// @route       GET api/auth
// @desc        Text route
// @access      public
router.get("/", (req, res) => {
    res.send("Auth route");
});

module.exports = router;
