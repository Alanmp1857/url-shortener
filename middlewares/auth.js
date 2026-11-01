const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req,res,next) {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.redirect('/login');
    }
    const user = await getUser(sessionId);
    if (!user) {
        return res.redirect('/login');
    }
    req.user = user;
    next();
}

async function checkAuth(req,res,next) {
    const sessionId = req.cookies.sessionId;
    const user = await getUser(sessionId);
    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedInUserOnly,
    checkAuth
}