import { Request, Response } from 'express';
import mysqlConnection from '../database-connection/mysql';
import { OkPacket } from 'mysql2';

class SaveProfileDetailsController {
  static async saveProfileDetails(req: Request, res: Response) {
    const { userId, user_age, user_gender, user_phoneNo, user_address } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      const [existingUser] = await (await mysqlConnection).execute(
        'SELECT * FROM user WHERE user_id = ?',
        [userId]
      );

      if (Array.isArray(existingUser) && existingUser.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      const [result] = await (await mysqlConnection).execute<OkPacket>(
        'UPDATE user SET user_age = ?, user_gender = ?, user_phoneNo = ?, user_address = ? WHERE user_id = ?',
        [user_age || null, user_gender || null, user_phoneNo || null, user_address || null, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "No changes made to the profile" });
      }

      res.status(203).json({
        message: "Profile details updated successfully",
      });
    } catch (error) {
      console.error("Save profile details error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default SaveProfileDetailsController;
