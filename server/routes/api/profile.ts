import { validationResult, check } from "express-validator";
import { IGetMyProfileRequest } from "./../../types/usersTypes";
import express from "express";
import auth from "../../middleware/auth";

import { Profile } from "../../models/Profile";
import { User } from "../../models/User";
import { ICreateProfileRequest, IUserProfile } from "../../types/profileTypes";

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

// @route       POST api/profile
// @desc        Create or update users profile
// @access      Private
router.post(
    "/",
    [auth, check("status", "Status is required").not().isEmpty(), check("skills", "Skills is required").not().isEmpty()],
    async (req: ICreateProfileRequest, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Build profile object
        const profileFields: { user?: unknown; company?: unknown; skills?: unknown } = {};
        profileFields.user = req.user.id;

        const reqKeys = Object.keys(req.body);

        reqKeys.forEach((key) => {
            switch (true) {
                case key === "skills": {
                    profileFields.skills = req.body.skills.split(",").map((x: string) => x.trim());
                    break;
                }
                case req.body[key] !== null && req.body[key] !== undefined: {
                    profileFields[key] = req.body[key];
                    break;
                }
            }
        });

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                // Update
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
                return res.json(profile);
            }

            // Create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message, "when create user profile");
            res.status(500).send("server error");
        }
    }
);

module.exports = router;
