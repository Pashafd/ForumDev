import express from "express";
import { check, validationResult } from "express-validator";
import { User } from "../../models/User";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import { IUserInfo } from "../../types/usersTypes";

const router = express.Router();

// @route       POST api/users
// @desc        Registry user
// @access      public
router.post(
    "/",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please included a valid email").isEmail(),
        check("password", "Please enter a password string and length with 6 or more characters").isString().isLength({
            min: 6,
        }),
    ],
    async (req: express.Request<any, () => void, IUserInfo>, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: "Users already exist" }] });
            }

            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm",
            });

            user = new User({
                name,
                email,
                avatar,
                password,
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

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
            console.error(err.message, "when registration user");
            res.status(500);
        }
    }
);

module.exports = router;
