import { getChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import DashboardClient from "../../components/dashboard-client";
export const dynamic = "force-dynamic";
export default async function DashboardPage(){
  const user = await getChatGPTUser();
  return <DashboardClient
    user={user ? {name:user.displayName,email:user.email} : {name:"Guest",email:"local@bitewise.app"}}
    signOut={user ? chatGPTSignOutPath("/") : "/"}
    storage={user ? "api" : "browser"}
  />;
}
