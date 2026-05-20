import path from 'node:path';
import process from 'node:process';
import { GetPageUseCase } from '@/application/content/GetPageUseCase';
import { FileSystemPageRepository } from './FileSystemPageRepository';

const contentRoot = path.join(process.cwd(), 'content');

const pageRepository = new FileSystemPageRepository(contentRoot);

export const getPageUseCase = new GetPageUseCase(pageRepository);
