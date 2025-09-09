import pool from '../config/connectDB.js';

const validAccountTypes = [
	'chequing',
	'savings',
	'investment',
	'cash',
	'credit',
];
const validCurrencyCodes = ['CAD', 'USD'];

export const getAccountsForUser = async (userId) => {
	const result = await pool.query(
		'SELECT * FROM financial_accounts WHERE user_id = $1 ORDER BY created_at DESC',
		[userId]
	);
	return result.rows;
};
export const createAccount = async (userId, accountData) => {
	const { name, account_type, institution, currency, description } =
		accountData;

	// validation
	if (!name || !account_type || !currency || !institution) {
		throw new Error('Required fields are missing');
	}

	if (!validAccountTypes.includes(account_type)) {
		throw new Error('Invalid account type');
	}

	if (!validCurrencyCodes.includes(currency)) {
		throw new Error('Invalid currency');
	}

	const result = await pool.query(
		`INSERT INTO financial_accounts (user_id, name, account_type, institution, currency, description)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
		[userId, name, account_type, institution, currency, description]
	);

	return result.rows[0];
};

export const updateAccount = async (userId, accountId, accountData) => {
	const { name, account_type, institution, currency, description } =
		accountData;

	const result = await pool.query(
		`UPDATE financial_accounts
     SET name = $1, account_type = $2, institution = $3, currency = $4, description = $5
     WHERE id = $6 AND user_id = $7 RETURNING *`,
		[name, account_type, institution, currency, description, accountId, userId]
	);

	if (result.rowCount === 0) {
		throw new Error('Account not found');
	}

	return result.rows[0];
};

export const archiveAccount = async (userId, accountId) => {
	const result = await pool.query(
		`UPDATE financial_accounts
     SET archived = TRUE
     WHERE id = $1 AND user_id = $2 RETURNING *`,
		[accountId, userId]
	);

	if (result.rowCount === 0) {
		throw new Error('Account not found or already archived');
	}

	return result.rows[0];
};
