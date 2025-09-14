import pool from '../config/connectDB.js';

const validAccountTypes = [
	'chequing',
	'savings',
	'investment',
	'cash',
	'credit',
];

const validRegistrationTypes = ['TFSA', 'RRSP', 'FSHA', 'Non-reg'];

const validCurrencyCodes = ['CAD', 'USD'];

export const getAccountsForUser = async (userId) => {
	const result = await pool.query(
		'SELECT * FROM financial_accounts WHERE user_id = $1 ORDER BY created_at DESC',
		[userId]
	);
	return result.rows;
};
export const createAccount = async (userId, accountData) => {
	const {
		name,
		accountType,
		institution,
		registrationType,
		currency,
		description,
	} = accountData;

	// map camelCase to snake_case
	const account_type = accountType;
	const registration_type = registrationType;

    console.log(accountData);
	// validation
	const missingFields = [];
	if (!name) missingFields.push('name');
	if (!account_type) missingFields.push('account_type');
	if (!currency) missingFields.push('currency');
	if (!institution) missingFields.push('institution');
	if (!registration_type) missingFields.push('registration_type');

	if (missingFields.length > 0) {
		throw new Error(`Required fields are missing: ${missingFields.join(', ')}`);
	}

	if (!validAccountTypes.includes(account_type)) {
		throw new Error('Invalid account type');
	}

	if (!validRegistrationTypes.includes(registration_type)) {
		throw new Error('Invalid registration type');
	}

	if (!validCurrencyCodes.includes(currency)) {
		throw new Error('Invalid currency');
	}

	const result = await pool.query(
		`INSERT INTO financial_accounts (user_id, name, account_type, institution, currency, description, registration_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
		[
			userId,
			name,
			account_type,
			institution,
			currency,
			description,
			registration_type,
		]
	);
	return result.rows[0];
};

export const updateAccount = async (userId, accountId, accountData) => {
    const {
        name,
        accountType,
        institution,
        registrationType,
        currency,
        description,
    } = accountData;

    // map camelCase to snake_case
    const account_type = accountType;
    const registration_type = registrationType;

    // validation
    if (account_type && !validAccountTypes.includes(account_type)) {
        throw new Error('Invalid account type');
    }

    if (registration_type && !validRegistrationTypes.includes(registration_type)) {
        throw new Error('Invalid registration type');
    }

    if (currency && !validCurrencyCodes.includes(currency)) {
        throw new Error('Invalid currency');
    }

    const result = await pool.query(
        `UPDATE financial_accounts
     SET name = $1, account_type = $2, institution = $3, currency = $4, description = $5, registration_type = $6
     WHERE id = $7 AND user_id = $8 RETURNING *`,
        [name, account_type, institution, currency, description, registration_type, accountId, userId]
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
