import path from 'node:path';
import process from 'node:process';
import { GetNewsArticleUseCase } from '@/application/news/GetNewsArticleUseCase';
import { ListNewsUseCase } from '@/application/news/ListNewsUseCase';
import { ListRecentNewsUseCase } from '@/application/news/ListRecentNewsUseCase';
import { FileSystemNewsArticleRepository } from './FileSystemNewsArticleRepository';

const contentRoot = path.join(process.cwd(), 'content');

const newsArticleRepository = new FileSystemNewsArticleRepository(contentRoot);

export const listNewsUseCase = new ListNewsUseCase(newsArticleRepository);
export const listRecentNewsUseCase = new ListRecentNewsUseCase(newsArticleRepository);
export const getNewsArticleUseCase = new GetNewsArticleUseCase(newsArticleRepository);

export { newsArticleRepository };
