import { AR_One_Sans, Tomorrow } from 'next/font/google';
import localFont from 'next/font/local';

export const AR = AR_One_Sans({
  subsets: ['latin'],
  variable: '--font-ar',
  display: 'swap',
});

export const TMR = Tomorrow({
  subsets: ['latin'],
  variable: '--font-tmr',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const Rubica = localFont({
  src: './rubica.woff2',
  variable: '--font-rubica',
  display: 'swap',
  style: 'normal',
})
