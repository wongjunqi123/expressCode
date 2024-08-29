import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysqlConnection from '../database-connection/mysql';
import { RowDataPacket } from 'mysql2';

class LoginController {
  static async login(req: Request, res: Response) {
    const { user_username, user_password } = req.body;

    console.log(user_username, user_password);
    // Basic validation
    if (!user_username || !user_password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    try {
      // Fetch the user from the database
      const [rows] = await(await mysqlConnection).execute<RowDataPacket[]>(
        'SELECT * FROM user WHERE user_username = ?',
        [user_username]
      );

      // Check if user exists
      if (rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = rows[0] as any; // Type assertion to access properties

      // Check password is valid
      const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Ensure JWT secret is defined
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error("JWT secret is not defined in environment variables");
        return res.status(500).json({ message: "Internal server error" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.user_id, username: user.user_username },
        jwtSecret,
        { expiresIn: "1d" }
      );

      // Send success response with token and user info
      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.user_id,
          username: user.user_username,
          email: user.user_email,
          age: user.user_age,
          gender: user.user_gender,
          phoneNo: user.user_phoneNo,
          address: user.user_address
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default LoginController;