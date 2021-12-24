import { IGetMyProfileRequest } from "./../../types/usersTypes";
import express from "express";
import auth from "../../middleware/auth";

import { Profile } from "../../models/Profile";
import { User } from "../../models/User";

const router = express.Router();

// @route       GET api/profile/me
// @desc        Get current users profile
// @access      Private

router.get("/me", auth, async (req: IGetMyProfileRequest, res: express.Response) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message, "error when get users current profile");
        res.status(500).send("server error");
    }
});

module.exports = router;
