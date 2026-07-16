export const getUser = (req, res) => {
    const currentUserProfile = req.user;
    res.status(200).json(
        {message: "User profile retrieved successfully.", currentUserProfile}
    );
}