import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysqlConnection from '../database-connection/mysql';
import { RowDataPacket, OkPacket } from 'mysql2';

class RegisterController {
  static async register(req: Request, res: Response) {
    const { user_username, user_password, user_email } = req.body;

    // Basic validation
    if (!user_username || !user_password || !user_email) {
      return res.status(400).json({ message: "Username, password, and email are required" });
    }

    try {
      // Check if username or email already exists
      const [existingUsers] =  await(await mysqlConnection).execute<RowDataPacket[]>(
        'SELECT * FROM user WHERE user_username = ? OR user_email = ?',
        [user_username, user_email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Username or email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(user_password, 10);

      // Insert the new user into the database
      const [result] = await(await mysqlConnection).execute<OkPacket>(
        'INSERT INTO user (user_username, user_password, user_email) VALUES (?, ?, ?)',
        [user_username, hashedPassword, user_email]
      );

      const newUserId = result.insertId;

      // Ensure JWT secret is defined
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("JWT secret is not defined in environment variables");
        return res.status(500).json({ message: "Internal server error" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUserId, username: user_username },
        jwtSecret,
        { expiresIn: "1d" }
      );

      // Send response
      res.status(201).json({
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default RegisterController;
