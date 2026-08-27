import { auth } from "@/auth";

import { getDocuments } from "@/app/actions/document";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const { myDocs, sharedDocs } = await getDocuments();

  return <DashboardClient myDocs={myDocs} sharedDocs={sharedDocs} />;
}
