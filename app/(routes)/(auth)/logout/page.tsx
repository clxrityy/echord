import { handleCurrentSession } from '@/app/_actions/session';
// import axios from "axios";
import { redirect } from 'next/navigation';
import { connection } from 'next/server';

export default async function Page() {
  await connection();
  const session = await handleCurrentSession();

  if (session.userId) {
    return redirect('/');
  }

  // const logout = await axios.post("/api/auth/logout", {
  //   sessionId: session.sessionId,
  //   userId: session.userId,
  // });

  return <></>;
}
