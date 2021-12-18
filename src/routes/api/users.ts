import { express } from "../../server";
const router = express.Router();
// @route       GET api/users
// @desc        Text route
// @access      public
router.get("/", (req, res) => {
    res.send("Users route");
});

module.exports = router;
