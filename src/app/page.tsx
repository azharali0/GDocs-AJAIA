import { redirect } from "next/navigation";

export default function Home() {
  // The middleware handles authentication, 
  // so we can safely redirect anyone hitting the root to the dashboard.
  redirect("/dashboard");
}
