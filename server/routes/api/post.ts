import express from "express";

const router = express.Router();

// @route       GET api/posts
// @desc        Text route
// @access      public
router.get("/", (req: express.Request, res: express.Response) => {
    res.send("Posts route");
});

module.exports = router;
