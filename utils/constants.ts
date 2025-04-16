import {
  Search,
  Save,
  CircleUserRound,
  LogIn,
  Settings,
  Heart,
  Ellipsis,
  Pointer,
  GripVertical,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const DEEZER_API_URL = 'https://api.deezer.com';
export const IP_API_URL = 'https://api.ipify.org';

export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://echord.uk'
    : 'http://localhost:3000';

export const FEED_ITEMS_PER_PAGE = 6;

export const ICONS = {
  search: Search,
  save: Save,
  user: CircleUserRound,
  login: LogIn,
  settings: Settings,
  favorite: Heart,
  link: Ellipsis,
  interaction: Pointer,
  grip: GripVertical,
  trash: Trash2,
  right: ChevronRight,
  left: ChevronLeft,
};

export const ENV = {
  COOKIE_NAME: process.env.COOKIE_NAME!,
  JWT_SECRET: process.env.JWT_SECRET!,
  CRON_SECRET: process.env.CRON_SECRET!,
};

export const DEFAULT_VALUES = {
  MIN_PASS_LENGTH: 8,
  MAX_PASS_LENGTH: 32,
  MAX_USERNAME_LENGTH: 20,
  MIN_USERNAME_LENGTH: 3,
};
