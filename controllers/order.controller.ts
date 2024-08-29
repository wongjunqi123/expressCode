import { Request, Response } from 'express';
import mysqlConnection from '../database-connection/mysql';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const createOrder = async (req: Request, res: Response) => {
  const token = req?.headers?.authorization?.replace(/^Bearer\s/, '');
  const decoded = jwt.verify(token || '', process.env.JWT_SECRET || '');
  const { cartItems } = req.body;
  const userId = _.get(decoded, 'userId');

  try {
    const [userRows] = await (await mysqlConnection).execute<RowDataPacket[]>(
      'SELECT user_ID, user_username, user_Address, user_phoneNo FROM user WHERE user_ID = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];

    console.log([
      user?.user_ID,
      user?.user_username || '',
      user?.user_Address,
      user?.user_phoneNo || '',
      calculateTotal(cartItems),
      cartItems.map((item: { name: string; quantity: number }) => `${item.name} (x${item.quantity})`).join(', ')
    ])

    const [orderResult] = await (await mysqlConnection).execute(
      'INSERT INTO `order` (user_ID, user_Name, user_Address, user_Phonenumber, order_amount, order_products) VALUES (?, ?, ?, ?, ?, ?)',
      [
        user?.user_ID,
        user?.user_username || '',
        user?.user_Address,
        user?.user_phoneNo || '',
        calculateTotal(cartItems),
        cartItems.map((item: { name: string; quantity: number }) => `${item.name} (x${item.quantity})`).join(', ')
      ]
    );

    const orderId = (orderResult as any).insertId;

    res.status(201).json({ message: 'Order created successfully', payload: { orderId, user } });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

const calculateTotal = (cartItems: { name: string; quantity: number }[]) => {
  return cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0).toFixed(2);
};

export default createOrder;