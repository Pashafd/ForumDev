import { validationResult, check } from "express-validator";
import express from "express";
import auth from "../../middleware/auth";
import { Profile } from "../../models/Profile";
import { User } from "../../models/User";
import { IRequestWithUser } from "../../types/types";
import { IRequestDeleteExperience, IUserProfileExperience } from "../../types/profileTypes";

const router = express.Router();

// @route       GET api/profile/me
// @desc        Get current users profile
// @access      Private
router.get("/me", auth, async (req: IRequestWithUser, res: express.Response) => {
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
    async (req: IRequestWithUser, res: express.Response) => {
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
router.post("/user", auth, async (req: IRequestWithUser, res: express.Response) => {
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
router.delete("/", auth, async (req: IRequestWithUser, res: express.Response) => {
    try {
        await Profile.findByIdAndRemove(req.user.id);
        await User.findByIdAndRemove(req.user.id);

        res.json({ msg: "User removed" });
    } catch (err) {
        console.error(err.message, "error when get users current profile");
        res.status(500).send("server error");
    }
});

// @route       PUT api/profile/experience
// @desc        Add profile experience
// @access      Private
router.put(
    "/experience",
    [
        auth,
        check("title", "title is required").not().isEmpty(),
        check("company", "company is required").not().isEmpty(),
        check("from", "From date is required").not().isEmpty(),
    ],
    async (req: IRequestWithUser, res: express.Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const { title, company, from, to, current, description, location, id } = req.body;

        const newExp = { title, company, location, from, to, current, description, id };

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message, "error when add profile experience");
            res.status(500).send("Server error");
        }
    }
);


// @route       POST api/profile/experience
// @desc        Delete profile experience
// @access      Private
router.delete(
    "/experience",
    [auth, check("experienceId", "id is required").not().isEmpty()],
    async (req: IRequestDeleteExperience, res: express.Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.experience = profile.experience.filter((exp: IUserProfileExperience) => exp.id !== req.body.experienceId);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message, "error when deleting profile experience");
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
