import { IP_API_URL } from '@/utils';

export async function fetchIp(): Promise<string> {
  const { ip } = await fetch(`${IP_API_URL}?format=json`).then((res) =>
    res.json()
  );
  return ip;
}
