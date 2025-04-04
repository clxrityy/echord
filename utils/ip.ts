import { IP_API_URL } from '@/utils';
import axios from 'axios';

export async function fetchIp(): Promise<string> {
  const { ip } = await axios
    .get(`${IP_API_URL}?format=json`)
    .then((res) => res.data);
  return ip;
}
