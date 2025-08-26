import pool from '../config/connectDB.js';

export const getAccountsForUser = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM financial_accounts WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};