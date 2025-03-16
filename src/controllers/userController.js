const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users", error: err });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err });
    }
};