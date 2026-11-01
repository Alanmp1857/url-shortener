
const sessionIdToUserMap = new Map(); // Map to store sessionId to user mapping


async function setUser(id, user) {
    sessionIdToUserMap.set(id, user);
}

async function getUser(id) {
    return sessionIdToUserMap.get(id);
}

module.exports = {
    setUser,
    getUser
};