const User = require('../models/user');
const {v4: uuidv4}  = require("uuid");
const {setUser} = require("../service/auth");

async function handleUserSignup(req,res) {
    const { name, email, password } = req.body;
    await User.create({ name, email, password });
    return res.redirect('/');
}

async function handleUserLogin(req,res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    if (user.password !== password) {
        return res.status(401).json({ error: "Invalid password" });
    }
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie('sessionId', sessionId);
    return res.redirect('/');
}

module.exports = {
    handleUserSignup,
    handleUserLogin
}