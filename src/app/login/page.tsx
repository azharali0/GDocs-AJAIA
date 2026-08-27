"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const autofill = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", alignItems: "center", backgroundColor: "#fff", paddingTop: "14px" }}>
      
      {/* Amazon-style Logo */}
      <div style={{ marginBottom: "18px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "normal", letterSpacing: "-1px", color: "#111" }}>
          Ajaia<span style={{ color: "#ff9900", fontSize: "38px", lineHeight: "0" }}>.</span>
        </h1>
      </div>

      <div style={{ width: "100%", maxWidth: "350px" }}>
        {error && (
          <div style={{ marginBottom: "14px", padding: "14px 18px", border: "1px solid #c40000", borderRadius: "3px", boxShadow: "0 0 0 4px rgba(221, 0, 0, 0.1) inset", backgroundColor: "#fff" }}>
            <h4 style={{ color: "#c40000", fontSize: "13px", fontWeight: 700, margin: "0 0 4px 0" }}>There was a problem</h4>
            <p style={{ fontSize: "13px", color: "#111", margin: 0 }}>{error}</p>
          </div>
        )}

        <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px 26px", marginBottom: "22px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 400, marginBottom: "10px", color: "#111" }}>Sign in</h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "2px", color: "#111" }}>
                Email or mobile phone number
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "7px", fontSize: "13px", border: "1px solid #a6a6a6", borderTopColor: "#949494", borderRadius: "3px", boxShadow: "0 1px 0 rgba(255,255,255,.5), 0 1px 0 rgba(0,0,0,.07) inset", outline: "none" }}
                onFocus={(e) => { e.target.style.borderColor = "#e77600"; e.target.style.boxShadow = "0 0 3px 2px rgba(228,121,17,.5)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#a6a6a6"; e.target.style.boxShadow = "0 1px 0 rgba(255,255,255,.5), 0 1px 0 rgba(0,0,0,.07) inset"; }}
                required
              />
            </div>
            
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label htmlFor="password" style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "2px", color: "#111" }}>
                  Password
                </label>
                <span style={{ fontSize: "13px", color: "#0066c0", cursor: "pointer" }}>Forgot your password?</span>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "7px", fontSize: "13px", border: "1px solid #a6a6a6", borderTopColor: "#949494", borderRadius: "3px", boxShadow: "0 1px 0 rgba(255,255,255,.5), 0 1px 0 rgba(0,0,0,.07) inset", outline: "none" }}
                onFocus={(e) => { e.target.style.borderColor = "#e77600"; e.target.style.boxShadow = "0 0 3px 2px rgba(228,121,17,.5)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#a6a6a6"; e.target.style.boxShadow = "0 1px 0 rgba(255,255,255,.5), 0 1px 0 rgba(0,0,0,.07) inset"; }}
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ 
                width: "100%", 
                backgroundColor: "#ffd814", 
                borderColor: "#fcd200", 
                borderStyle: "solid",
                borderWidth: "1px",
                borderRadius: "8px", 
                color: "#111", 
                padding: "8px", 
                fontSize: "13px", 
                cursor: "pointer",
                boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",
                marginTop: "4px"
              }}
              onMouseEnter={(e) => { if(!isLoading) e.currentTarget.style.backgroundColor = "#f7ca00" }}
              onMouseLeave={(e) => { if(!isLoading) e.currentTarget.style.backgroundColor = "#ffd814" }}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p style={{ fontSize: "12px", color: "#111", marginTop: "18px", lineHeight: "1.5" }}>
            By continuing, you agree to Ajaia's <span style={{ color: "#0066c0", cursor: "pointer" }}>Conditions of Use</span> and <span style={{ color: "#0066c0", cursor: "pointer" }}>Privacy Notice</span>.
          </p>
          
          <div style={{ marginTop: "22px" }}>
            <span style={{ fontSize: "13px", color: "#0066c0", cursor: "pointer" }}>▶ Need help?</span>
          </div>

        </div>

        {/* New to Amazon Divider */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "14px" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e7e7e7" }}></div>
          <span style={{ color: "#767676", fontSize: "12px", padding: "0 8px" }}>New to Ajaia?</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e7e7e7" }}></div>
        </div>

        {/* Create Account Button */}
        <button 
          style={{ 
            width: "100%", 
            backgroundColor: "#fff", 
            border: "1px solid #d5d9d9", 
            borderRadius: "8px", 
            padding: "8px", 
            fontSize: "13px", 
            color: "#111",
            boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",
            cursor: "pointer",
            marginBottom: "26px"
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f7fafa"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fff"}
        >
          Create your Ajaia account
        </button>

        {/* Dev Sandbox Helper */}
        <div style={{ borderTop: "1px solid #e7e7e7", paddingTop: "20px" }}>
          <h5 style={{ fontSize: "12px", color: "#767676", marginBottom: "12px", textAlign: "center" }}>Test Accounts (Dev)</h5>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { n: "Alice", e: "alice@ajaia.test" },
              { n: "Bob", e: "bob@ajaia.test" },
              { n: "Charlie", e: "charlie@ajaia.test" }
            ].map(user => (
              <button 
                key={user.e}
                type="button"
                onClick={() => autofill(user.e, "password123")}
                style={{ fontSize: "11px", padding: "4px 8px", backgroundColor: "#f3f3f3", border: "1px solid #d5d9d9", borderRadius: "4px", cursor: "pointer", color: "#111" }}
              >
                {user.n}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div style={{ width: "100%", marginTop: "auto", borderTop: "1px solid #ddd", background: "#f3f3f3", padding: "30px 0" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "24px", fontSize: "11px", color: "#0066c0", marginBottom: "10px" }}>
          <span style={{ cursor: "pointer" }}>Conditions of Use</span>
          <span style={{ cursor: "pointer" }}>Privacy Notice</span>
          <span style={{ cursor: "pointer" }}>Help</span>
        </div>
        <p style={{ textAlign: "center", fontSize: "11px", color: "#555" }}>
          © 1996-2026, Ajaia.com, Inc. or its affiliates
        </p>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
