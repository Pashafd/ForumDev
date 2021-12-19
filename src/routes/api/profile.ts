import express from "express";
const router = express.Router();
// @route       GET api/profile
// @desc        Text route
// @access      public
router.get("/", (req, res) => {
    res.send("Profile route");
});

module.exports = router;
