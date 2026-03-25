import React, { useContext, useState } from "react";
import { Web3Context } from "../context/Web3Context";
import { Navbar, Container, Button, Badge, Offcanvas } from "react-bootstrap";
import { Wallet, ShieldCheck, Menu, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NavbarComponent() {
  const { account, connectWallet, isAdmin } = useContext(Web3Context);

  // Define main colors
  const primaryWarm = "#ea580c"; // buttons
  const adminBadgeBg = "#ffedd5"; // backgrounds
  const adminBadgeText = "#9a3412"; // clicked/hovered-over buttons
  const textDark = "#1e293b"; // text

  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sidebarStyles = {
    offcanvas: {
      backgroundColor: adminBadgeBg,
      borderRight: "none",
      color: "#4a3728",
      borderRadius: "20px",
    },
    innerContainer: {
      backgroundColor: "rgba(74, 55, 40, 0.08)",
      borderRadius: "15px",
      padding: "20px",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    navButton: {
      display: "flex",
      alignItems: "center",
      padding: "12px 15px",
      borderRadius: "20px",
      textDecoration: "none",
      color: "#ea580c",
      fontWeight: "600",
      transition: "all 0.3s ease",
      border: "2px solid #ea580c",
      cursor: "pointer",
      marginTop: "20px",
    },
  };

  return (
    <Navbar bg="white" className="shadow-sm border-bottom py-3">
      <Offcanvas
        show={show}
        onHide={handleClose}
        style={sidebarStyles.offcanvas}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title
            style={{
              fontWeight: "800",
              letterSpacing: "1px",
              color: "#634a36",
            }}
          >
            MENU
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div style={sidebarStyles.innerContainer}>
            {/* Home Button */}
            <button
              style={sidebarStyles.navButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "white";
                e.currentTarget.style.backgroundColor = "#9a3412e1";
                e.currentTarget.style.border = "none";
                e.currentTarget.style.gap = "20px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#ea580c";
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.border = "2px solid #ea580c";
                e.currentTarget.style.gap = "15px";
              }}
            >
              <Home size={22} style={{ marginBottom: "2px" }} />
              <span>Home</span>
            </button>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 15px",
                borderRadius: "20px",
                textDecoration: "none",
                backgroundColor: "#99310ee3",
                color: "white",
                fontWeight: "600",
                transition: "all 0.3s ease",
                cursor: "pointer",
                marginTop: "50px",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#6c250de1";
                e.currentTarget.style.gap = "20px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#99310ee3";
                e.currentTarget.style.gap = "15px";
              }}
              onClick={() => navigate("/")}
            >
              <LogOut size={22} style={{ marginBottom: "2px" }} />

              <span>Exit</span>
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      {/* Changed to fluid and added padding to match your new App.jsx layout */}
      <Container fluid className="px-4 px-md-5">
        <Menu
          size={30}
          style={{ marginRight: "20px" }}
          color={primaryWarm}
          onClick={handleShow}
        />
        <Navbar.Brand className="d-flex align-items-center gap-2 fw-bold m-0">
          <ShieldCheck color={primaryWarm} size={32} />
          <span
            style={{
              color: textDark,
              fontSize: "1.4rem",
              letterSpacing: "-0.5px",
              fontWeight: "bold",
            }}
          >
            <span style={{ color: primaryWarm }}>Clear</span>Fund
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
