
const authorizeAdmin = (req, res, next) => {

    if(!req.user.isAdmin) return res.status(403).json({ message: "Access denied! Connect your administration to add."})
    next();
}

export default authorizeAdmin;