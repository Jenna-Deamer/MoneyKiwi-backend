import express from 'express';
import {
  getFinancialAccounts,
  createAccountController,
  updateAccountController,
  archiveAccountController
} from '../controllers/financialAccountsController.js';import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to protect routes
router.use(ensureAuthenticated);

router.get('/', ensureAuthenticated, getFinancialAccounts);
router.post('/', ensureAuthenticated, createAccountController);
router.put('/:accountId', ensureAuthenticated, updateAccountController);
router.delete('/:accountId', ensureAuthenticated, archiveAccountController);

export default router;
