import CryptoJS from "crypto-js";

export const encrypt = (value: string) => CryptoJS.AES.encrypt(value, process.env.ENCRYPTION_KEY!).toString();

export const decrypt = (ciphertext: string) => CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY!).toString(CryptoJS.enc.Utf8);
