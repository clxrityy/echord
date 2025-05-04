import CryptoJS from 'crypto-js';
import { ENV } from './constants';

export const encrypt = (value: string) =>
  CryptoJS.AES.encrypt(value, ENV.ENCRYPTION_SECRET).toString();

export const decrypt = (ciphertext: string) =>
  CryptoJS.AES.decrypt(ciphertext, ENV.ENCRYPTION_SECRET).toString(
    CryptoJS.enc.Utf8
  );
