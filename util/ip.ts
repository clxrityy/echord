import { IP_API_URL } from '@/util';

export async function fetchIp(): Promise<string> {
  const { ip } = await fetch(`${IP_API_URL}?format=json`).then((res) =>
    res.json()
  );
  return ip;
}
