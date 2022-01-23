import express from "express";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth";
import { Post } from "../../models/Post";
import { User } from "../../models/User";
import { IRequestWithUser } from "../../types/types";
import { IUserInfo } from "../../types/usersTypes";
import { IPostsRequest } from "../../types/postsTypes";

const router = express.Router();

// @route       POST api/posts
// @desc        Create the post
// @access      private
router.post(
    "/",
    [auth, check("text", "text field is required").not().isEmpty()],
    async (req: IRequestWithUser, res: express.Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        try {
            const user: IUserInfo = await User.findById(req.user.id).select("-password");

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });

            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message, "error when create new post");
            res.status(500).send("server error");
        }
    }
);

// @route       GET api/posts
// @desc        Get all posts
// @access      private
router.get("/", [auth], async (req: IRequestWithUser, res: express.Response) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message, "error when get all posts");
        res.status(500).send("server error");
    }
});

// @route       POST api/posts/:post-id
// @desc        Get post by ID
// @access      private
router.get("/:id", [auth], async (req: IPostsRequest, res: express.Response) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        res.json(post);
    } catch (err) {
        console.error(err.message, "error when get current posts");

        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }

        res.status(500).send("server error");
    }
});

// @route       DELETE api/posts/:post-id
// @desc        remove the post
// @access      private
router.delete("/:id", [auth], async (req: IPostsRequest, res: express.Response) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        //check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User not authorized" });
        }

        await post.remove();
        res.json({ msg: `post ${postId} removed` });
    } catch (err) {
        console.error(err.message, "error when delete the post");

        if (err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }

        res.status(500).send("server error");
    }
});
module.exports = router;
