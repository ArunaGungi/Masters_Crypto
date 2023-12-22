const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { encrypt } = require('../utils/openssl');

// Load environment variables from .env file
dotenv.config();

class AuthController {

  async register(req, res) {
    console.log("req from register function", req.body);
    try {
      const { username, password } = req.body;

      // Check if the username already exists
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const newUser = new User({
          username,
          password: hashedPassword,

        });
        // Save the user to the database
        await newUser.save();
        // Send back the public key to the client
        res.status(201).json({ message: 'User registered successfully' });
      }
    } catch (error) {
      console.error('Error during user registration:', error);
      res.status(500).json({ message: 'Internal server error during user registration' });
    }
  }


  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        console.log('User not found');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare the entered password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        console.log('Password is correct');
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'User Validated' });
      }
      else {
        console.log('Password is incorrect');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }
    catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async logout(req, res) {
    res.json({ message: 'Logout successful' });
  }

}

module.exports = new AuthController();