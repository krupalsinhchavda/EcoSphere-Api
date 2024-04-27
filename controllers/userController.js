const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            message: "Get Users Successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const CreateUser = async (req, res) => {
    try {
        const users = await userService.CreateUser();
        res.status(201).json({
            message: "Create User Successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Define other controller functions like getUserById, createUser, updateUser, and deleteUser

module.exports = {
    getAllUsers, CreateUser
    // Other controller functions
};
