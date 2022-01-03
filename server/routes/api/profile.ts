import { validationResult, check } from "express-validator";
import express from "express";
import auth from "../../middleware/auth";

import { Profile } from "../../models/Profile";
import { ICreateProfileRequest, IGetProfileByUserIdRequest } from "../../types/profileTypes";
import { User } from "../../models/User";
import { IDeleteProfileRequest, IGetMyProfileRequest } from "../../types/usersTypes";

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

// @route       GET api/profile
// @desc        Get all users profile
// @access      Private
router.get("/", auth, async (req: express.Request, res: express.Response) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);

        res.json(profiles);
    } catch (err) {
        console.error(err.message, "error when get all profile");
        res.status(500).send("server error");
    }
});

// @route       POST api/profile/user/:user-id
// @desc        Get user profile by user-id
// @access      Private
router.post("/user", auth, async (req: IGetProfileByUserIdRequest, res: express.Response) => {
    try {
        const profile = await Profile.findById(req.body.userId).populate("user", ["name", "avatar"]);

        if (!profile) {
            return res.status(400).json({ msg: "Profile is not created for this user" });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message, "error when get profile");

        if (err.kind === "ObjectId") {
            return res.status(400).json({ msg: "User is not exist" });
        }

        res.status(500).send("server error");
    }
});

// @route       DELETE api/profile
// @desc        Delete users and profile
// @access      Private
router.delete("/", auth, async (req: IDeleteProfileRequest, res: express.Response) => {
    try {
        await Profile.findByIdAndRemove(req.user.id);
        await User.findByIdAndRemove(req.user.id);

        res.json({ msg: "User removed" });
    } catch (err) {
        console.error(err.message, "error when get users current profile");
        res.status(500).send("server error");
    }
});

module.exports = router;
