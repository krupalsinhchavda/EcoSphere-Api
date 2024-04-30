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
const modifyPassword = async (req, res) => {
    try {
        const { username, password_hash, newpassword } = req.body;
        const modifyData = {
            username,
            password_hash,
            newpassword
        };
        
        const modifiedPasswordData = await authService.modifyPassword(modifyData);
        res.status(200).json({ message: "Modify Password Successfully", data: modifiedPasswordData });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    userLogin, modifyPassword   // Other controller functions
};