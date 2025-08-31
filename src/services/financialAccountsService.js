import pool from '../config/connectDB.js';

export const getAccountsForUser = async (userId) => {
	const result = await pool.query(
		'SELECT * FROM financial_accounts WHERE user_id = $1 ORDER BY created_at DESC',
		[userId]
	);
	return result.rows;
};

export const createAccount = async (req, res) => {
	const { name, account_type, institution, currency, description } = req.body;
	const userId = req.user.id;

	// validation
	if (!name || !account_type || !currency || !institution) {
		return res.status(400).json({ error: 'Required fields are missing' });
	}

	const validAccountTypes = [
		'Chequing',
		'Savings',
		'Investment',
		'Cash',
		'Credit',
	];

	if (!validAccountTypes.includes(account_type)) {
		return res.status(400).json({ error: 'Invalid account type' });
	}

	const validCurrencyCodes = ['CAD', 'USD'];
	if (!validCurrencyCodes.includes(currency)) {
		return res.status(400).json({ error: 'Invalid currency' });
	}

	try {
		const result = await pool.query(
			`INSERT INTO financial_accounts (user_id, name, account_type, institution, currency, description)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
			[name, account_type, institution, currency, description]
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to create account' });
	}
};

export const updateAccount = (userId) => {};
