import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import DashboardClient from "../../components/dashboard-client";
export const dynamic = "force-dynamic";
export default async function DashboardPage(){
  const user = await requireChatGPTUser("/dashboard");
  return <DashboardClient user={{name:user.displayName,email:user.email}} signOut={chatGPTSignOutPath("/")}/>;
}
