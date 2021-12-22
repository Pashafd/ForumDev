import express from "express";
import auth from "../../middleware/auth";
import { IAuthRequest } from "../../types/authTypes";
import { User } from "../../model/User";
const router = express.Router();

// @route       GET api/auth
// @desc        Text route
// @access      public
router.get("/", auth, async (req: IAuthRequest, res: express.Response) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message, "when user auth");
        res.status(500).json({ msg: "User auth server error" });
    }
});

module.exports = router;
