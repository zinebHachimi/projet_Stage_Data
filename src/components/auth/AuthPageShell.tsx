import type { ReactNode } from "react";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <main
      className="w-100 float-left position-relative main-box"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 mb-5 mb-lg-0">
            <span
              className="d-block text-uppercase font-weight-700"
              style={{
                color: "#0f766e",
                fontSize: "13px",
                letterSpacing: "3px",
              }}
            >
              {eyebrow}
            </span>
            <h1 className="mt-3 font-weight-bold mb-4" style={{ color: "#0f172a", fontSize: "40px", lineHeight: "1.2" }}>
              {title}
            </h1>
            <p style={{ color: "#334155", fontSize: "16px", lineHeight: "1.6" }}>
              {description}
            </p>

            <div
              className="mt-4 p-4 rounded-3"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              }}
            >
              <h5 className="font-weight-bold" style={{ color: "#0f172a", fontSize: "16px" }}>
                <i className="fa-solid fa-circle-info mr-2 text-info"></i> Support Technique AlgoJob AI
              </h5>
              <p className="small mb-0 mt-2" style={{ color: "#475569", lineHeight: "1.5" }}>
                Besoin d&apos;aide pour configurer votre compte ou pour utiliser notre outil de data gathering ? Contactez notre assistance technique par email a <strong>support@algojob.ai</strong>.
              </p>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="mx-auto" style={{ maxWidth: "500px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "24px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  padding: "40px",
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
