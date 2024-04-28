const authService = require('../services/authService');

const userLogin = async (req, res) => {
    try {
        const { username, password_hash } = req.body;
        const loginData = {
            username,
            password_hash
        };

        const userLogin = await authService.userLogin(loginData);
        res.status(200).json({ message: 'Login successful', Data: userLogin });

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    userLogin    // Other controller functions
};