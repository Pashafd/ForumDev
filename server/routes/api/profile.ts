import { validationResult, check } from "express-validator";
import express from "express";
import auth from "../../middleware/auth";
import { Profile } from "../../models/Profile";
import { User } from "../../models/User";
import { IRequestWithUser } from "../../types/types";
import {
    IProfileCreateRequest,
    IRequestDeleteExperience,
    IUserProfile,
    IUserProfileEducation,
    IUserProfileExperience,
} from "../../types/profileTypes";
import { HydratedDocument } from "mongoose";
import request from "request";
import config from "config";

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
    [auth, check("status", "status is required").not().isEmpty(), check("skills", "Skills is required").not().isEmpty()],
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
            if (key === "skills") {
                profileFields.skills = req.body.skills.split(",").map((x: string) => x.trim());
            } else if (req.body[key] !== null && req.body[key] !== undefined) {
                profileFields[key] = req.body[key];
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

// @route       POST api/profile/user
// @desc        Get user profile by user-id
// @access      Private
router.post(
    "/user",
    [auth, check("userId", "userId is required").not().isEmpty()],
    async (req: IRequestWithUser, res: express.Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
    }
);

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
    async (req: IProfileCreateRequest, res: express.Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const { title, company, from, to, current, description, location, id } = req.body;

        const newExp = { title, company, location, from, to, current, description, id };

        try {
            const profile: HydratedDocument<IUserProfile> = await Profile.findOne({ user: req.user.id });

            if (req.body.current) {
                const currentExistInList = profile.experience.some((field) => !!field.current);

                if (currentExistInList) {
                    res.status(400).json({
                        msg: "current field must be unique, please delete one of the experience with current: true field",
                    });
                }
            }

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message, "error when add profile education");
            res.status(500).send("Server error");
        }
    }
);

// @route       DELETE api/profile/education
// @desc        Delete profile education from profile
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

export interface IEducationRequest extends IRequestWithUser {
    education: IUserProfileEducation;
}

// @route       PUT api/profile/education
// @desc        Add profile education
// @access      Private
router.put(
    "/education",
    [
        auth,
        check("school", "school is required").not().isEmpty(),
        check("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
        check("from", "From date is required").not().isEmpty(),
        check("degree", "Degree is required").not().isEmpty(),
    ],
    async (req: IEducationRequest, res: express.Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const { school, fieldofstudy, from, to, current, description, degree, id } = req.body;

        const newEducation = { school, fieldofstudy, from, to, current, description, degree, id };

        try {
            const profile: HydratedDocument<IUserProfile> = await Profile.findOne({ user: req.user.id });

            if (req.body.current) {
                const currentExistInList = profile.education.some((field) => !!field.current);

                if (currentExistInList) {
                    res.status(400).json({
                        msg: "current field must be unique, please delete one of the education with current: true field",
                    });
                }
            }

            profile.education.unshift(newEducation);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message, "error when add profile education");
            res.status(500).send("Server error");
        }
    }
);

// @route       DELETE api/profile/education
// @desc        Delete profile education from profile
// @access      Private
router.delete(
    "/education",
    [auth, check("educationId", "id is required").not().isEmpty()],
    async (req: IEducationRequest, res: express.Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        try {
            const profile = await Profile.findOne({ user: req.user.id });

            profile.education = profile.education.filter((exp: IUserProfileEducation) => exp.id !== req.body.educationId);

            await profile.save();

            res.json(profile);
        } catch (err) {
            console.error(err.message, "error when deleting profile education");
            res.status(500).send("Server error");
        }
    }
);

// @route       GET api/profile/github/:username
// @desc        get sorted user repos from github
// @access      Public
router.get("/github/:username", async (req: IRequestWithUser, res: express.Response) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=${req.params.perPage || 5}&sort=${
                req.params.sortBy || "created"
            }:${req.params.sort || 0 ? "asc" : "desc"}&client_id=${config.get("githubClientId")}&client_secret=${config.get(
                "githubSecret"
            )}`,
            headers: { "user-agent": "nodejs" },
        };

        request(options, (error, response, body) => {
            if (error) {
                console.error(error);
            }

            if (response.statusCode !== 200) {
                res.status(404).json({ msg: "No github profile found" });
            } else {
                res.json(JSON.parse(body));
            }
        });
    } catch (err) {
        console.error(err.message, "error when get users repos from github");
        res.status(500).send("server error");
    }
});

module.exports = router;
