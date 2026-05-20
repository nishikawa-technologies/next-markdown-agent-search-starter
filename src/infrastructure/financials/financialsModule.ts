import path from 'node:path';
import process from 'node:process';
import { GetFinancialStatementUseCase } from '@/application/financials/GetFinancialStatementUseCase';
import { ListFinancialStatementsUseCase } from '@/application/financials/ListFinancialStatementsUseCase';
import { FileSystemFinancialStatementRepository } from './FileSystemFinancialStatementRepository';

const contentRoot = path.join(process.cwd(), 'content');

const financialStatementRepository = new FileSystemFinancialStatementRepository(
  contentRoot,
);

export const listFinancialStatementsUseCase = new ListFinancialStatementsUseCase(
  financialStatementRepository,
);
export const getFinancialStatementUseCase = new GetFinancialStatementUseCase(
  financialStatementRepository,
);
export { financialStatementRepository };
