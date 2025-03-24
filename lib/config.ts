import { Search, Save } from 'lucide-react';

export const DEEZER_API_URL = 'https://api.deezer.com';
export const IP_API_URL = "https://api.ipify.org";

export const BASE_URL = process.env.NODE_ENV === "production" ? "https://echord.uk" : "http://localhost:3000";

export const ICONS = {
  search: Search,
  save: Save,
};

export const ENV = {
  COOKIE_NAME: process.env.COOKIE_NAME!,
  JWT_SECRET: process.env.JWT_SECRET!,
}
