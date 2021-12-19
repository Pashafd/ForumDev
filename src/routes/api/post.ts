import express from "express";
const router = express.Router();
// @route       GET api/posts
// @desc        Text route
// @access      public
router.get("/", (req, res) => {
    res.send("Posts route");
});

module.exports = router;
