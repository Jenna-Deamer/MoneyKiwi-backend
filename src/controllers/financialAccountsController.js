import '../config/passportConfig.js';
import { getAccountsForUser } from '../services/financialAccountsService.js';



export const getFinancialAccounts = async (req, res) => {
  try {
    const userId = req.user.id;
    const accounts = await getAccountsForUser(userId);
    res.status(200).json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
