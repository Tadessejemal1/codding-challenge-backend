const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If user is found and password is correct, create a token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the token and role in the response
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateUserRole = async (req, res) => {
    if (req.user.role !== 'Author') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    try {
      const { userId, role } = req.body;
      await User.findByIdAndUpdate(userId, { role });
      res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
      res.status(500).json({ error });
    }
  };
  
