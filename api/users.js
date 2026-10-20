import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import express from "express";
import { createToken } from "#utils/jwt";
const router = express.Router();
export default router;


router.post("/register", requireBody(["username", "password"]), async (req, res) => {
    try {
        const user = await createUser(req.body.username, req.body.password);
        const token = createToken({ id : user.id });
        res.status(201).send(token);
    } catch (error) {
        next();
    }
});


router.post("/login", requireBody(["username", "password"]), async (req, res, next) => {
    const user = await getUserByUsernameAndPassword(req.body.username, req.body.password);
    if(!user) return res.status(401).send("Invalid username or password.");
    const token = createToken({ id: user.id });
    res.send(token);
});

