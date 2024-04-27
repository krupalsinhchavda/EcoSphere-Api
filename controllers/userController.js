const userService = require('../services/userService');

const createUser = async (req, res) => {
    try {
        const { username, email, password_hash, bio, age, gender, registration_date } = req.body;
        const userData = {
            username,
            email,
            password_hash,
            bio,
            age,
            gender,
            registration_date
        };
        const newUser = await userService.createUser(userData);

        res.status(201).json({
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        // const id = req.query.id;
        const DeleteById = await userService.DeleteUser(id);
        res.status(200).json({
            message: "Delete User Successfully",
            Data: DeleteById
        })
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const { page, limit, orderBy, orderDirection, ...filterParams } = req.query;
        const pagination = { page, limit, orderBy, orderDirection };
        const users = await userService.getAllUsers(pagination, filterParams);
        
        // Check if no users were found
        if (users.data.length === 0) {
            return res.status(200).json({
                message: "No users found",
                data: []
            });
        }

        res.status(200).json({
            message: "Get All Users Successfully",
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id
        // const id = req.query.id
        const UserById = await userService.getUserById(id);
        res.status(200).json({
            message: "Get User By Id Data Successfully",
            Data: UserById
        })
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllUsers, getUserById, DeleteUser, createUser
    // Other controller functions
};
