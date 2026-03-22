import React, { useContext } from "react";
import { Web3Context } from "../context/Web3Context";
import { Navbar, Container, Button, Badge } from "react-bootstrap";
import { Wallet, ShieldCheck } from "lucide-react";

export default function NavbarComponent() {
  const { account, connectWallet, isAdmin } = useContext(Web3Context);

  // Define main colors
  const primaryWarm = "#ea580c"; // buttons
  const adminBadgeBg = "#ffedd5"; // backgrounds
  const adminBadgeText = "#9a3412"; // clicked/hovered-over buttons
  const textDark = "#1e293b"; // text

  return (
    <Navbar
      bg="white"
      className="shadow-sm border-bottom py-3"
      // Removed the 5px solid black border
    >
      {/* Changed to fluid and added padding to match your new App.jsx layout */}
      <Container fluid className="px-4 px-md-5">
        <Navbar.Brand className="d-flex align-items-center gap-2 fw-bold m-0">
          <ShieldCheck color={primaryWarm} size={32} />
          <span
            style={{
              color: textDark,
              fontSize: "1.4rem",
              letterSpacing: "-0.5px",
            }}
          >
            ClearFund
          </span>
        </Navbar.Brand>

        <Navbar.Collapse className="justify-content-end">
          {account ? (
            <div className="d-flex align-items-center gap-3">
              {isAdmin && (
                <Badge
                  pill
                  className="px-3 py-2 fw-semibold"
                  style={{
                    backgroundColor: adminBadgeBg,
                    color: adminBadgeText,
                    border: "1px solid #fdba74",
                    letterSpacing: "0.5px",
                  }}
                >
                  Admin
                </Badge>
              )}
              <div
                className="d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm"
                style={{
                  backgroundColor: "#f8fafc",
                  color: "#475569",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                <Wallet size={18} color={primaryWarm} />
                <span className="font-monospace">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            </div>
          ) : (
            <Button
              onClick={connectWallet}
              className="px-4 py-2 rounded-pill shadow-sm border-0"
              style={{
                backgroundColor: primaryWarm,
                fontWeight: "600",
                letterSpacing: "0.3px",
                transition: "background-color 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#c2410c")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = primaryWarm)
              }
            >
              Connect Wallet
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
