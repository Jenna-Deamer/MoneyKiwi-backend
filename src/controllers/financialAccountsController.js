import '../config/passportConfig.js';
import {
	getAccountsForUser,
	createAccount,
	updateAccount,
	archiveAccount,
} from '../services/financialAccountsService.js';

export const getFinancialAccounts = async (req, res) => {
	try {
		const userId = req.user.id;
		const accounts = await getAccountsForUser(userId);
		res.status(200).json({ success: true, data: accounts });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
};

export const createAccountController = async (req, res) => {
	try {
		const userId = req.user.id;
		const account = await createAccount(userId, req.body);
		res.status(201).json({ success: true, data: account });
	} catch (err) {
		console.error(err);
		res.status(400).json({ success: false, error: err.message });
	}
};

export const updateAccountController = async (req, res) => {
	try {
		const userId = req.user.id;
		const { accountId } = req.params;
		const updatedAccount = await updateAccount(userId, accountId, req.body);
		res.status(200).json({ success: true, data: updatedAccount });
	} catch (err) {
		console.log(err);
		res.status(400).json({ success: false, error: err.message });
	}
};

export const archiveAccountController = async (req, res) => {
	try {
		const userId = req.user.id;
		const { accountId } = req.params;
		const archivedAccount = await archiveAccount(userId, accountId);
		res.status(200).json({ success: true, data: archivedAccount });
	} catch (err) {
		res.status(400).json({ success: false, error: err.message });
	}
};
