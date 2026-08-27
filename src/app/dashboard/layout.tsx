import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px", display: "flex", justifyContent: "center", position: "sticky", top: 0, zIndex: 50 }}>
        <header style={{ 
          padding: "8px 8px 8px 12px", 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          backgroundColor: "#1f1f1f",
          borderRadius: "32px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.15), 0 5px 15px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "700px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* Logo Circle */}
            <div style={{ 
              width: "40px", 
              height: "40px", 
              backgroundColor: "white", 
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "#111"
            }}>
              A<span style={{ color: "#ff9900" }}>.</span>
            </div>
            
            {/* Nav Links */}
            <nav style={{ display: "flex", gap: "20px", color: "white", fontSize: "0.95rem" }}>
              <span style={{ cursor: "pointer" }}>Dashboard</span>
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {/* User Pill / Sign Out */}
            <div style={{ 
              backgroundColor: "white", 
              padding: "10px 20px", 
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}>
              <span style={{ color: "#111", fontSize: "0.9rem", fontWeight: 500 }}>{session.user.email}</span>
              <form action="/api/auth/signout" method="POST" style={{ margin: 0 }}>
                <button type="submit" style={{ 
                  color: "#d93025", 
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  padding: 0
                }}>
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>
      </div>
      <main style={{ flex: 1, padding: "32px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        {children}
      </main>
    </div>
  );
}
