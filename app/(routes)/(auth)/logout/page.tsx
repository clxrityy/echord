import { handleCurrentSession } from "@/app/_handlers/session";
import axios from "axios";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await handleCurrentSession();

  if (session.userId) {
    return redirect("/");
  }

  const logout = await axios.post("/api/auth/logout", {
    sessionId: session.sessionId,
    userId: session.userId,
  })

  return <>

  </>
}
