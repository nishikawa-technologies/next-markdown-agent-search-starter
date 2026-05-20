import { Noto_Sans_JP } from 'next/font/google';

export const notoSansJp = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'], // Next.jsが日本語サブセットをまだ提供していないためlatinを指定
  display: 'swap',
});
