import express from "express";
import { User } from "../../models/User";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs";
import { IUserInfo } from "../../types/usersTypes";
import auth from "../../middleware/auth";
import { IAuthRequest } from "../../types/authTypes";

const router = express.Router();

// @route       GET api/auth
// @desc        Test route
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

// @route       POST api/auth
// @desc        Auth user and get token
// @access      public
router.post(
    "/",
    [check("email", "Please included a valid email").isEmail(), check("password", "Password is requeued").isString().exists()],
    async (req: IAuthRequest, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user: IUserInfo = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            const token: string = config.get("jwtToken");

            if (token) {
                jwt.sign(
                    payload,
                    token,
                    {
                        expiresIn: 36000,
                    },
                    (err, token) => {
                        if (err) {
                            throw err;
                        }

                        res.json({ token });
                    }
                );
            } else {
                res.send("Something wrong with jwt create token");
            }
        } catch (err) {
            console.error(err.message, "when auth user");
            res.status(500);
        }
    }
);

module.exports = router;
