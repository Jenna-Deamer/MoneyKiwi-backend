import express from 'express';
import { getFinancialAccounts } from '../controllers/financialAccountsController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to protect routes
router.use(ensureAuthenticated);

router.get('/', getFinancialAccounts);
// router.get('/:id', getAccountById);
// router.post('/', createAccount);
// router.put('/:id', updateAccount);
// router.delete('/:id', deleteAccount);

export default router;
