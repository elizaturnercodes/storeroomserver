const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create User
exports.createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    await user.save();
    const { password: _, ...userData } = user.toObject();
    res.status(201).json({ status: 'success', data: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ status: 'success', message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register User
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/', // Optional but recommended
      maxAge: 24 * 60 * 60 * 1000, // Optional: sets expiry to 24 hours
    });

    const { password: _, ...userData } = user.toObject();
    res.status(201).json({ message: 'Register successful', user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/', // Optional but recommended
      maxAge: 24 * 60 * 60 * 1000, // Optional: sets expiry to 24 hours
    });

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ status: 'success', message: 'Login successful', user: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout User
exports.logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, secure: true, sameSite: 'strict', expires: new Date(0) });
  res.status(200).json({ message: 'Logout successful' });
};
