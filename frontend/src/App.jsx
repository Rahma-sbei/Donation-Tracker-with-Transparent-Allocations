import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigRight } from "lucide-react";
function App() {
  // Initialize the navigation hook
  const navigate = useNavigate();

  // colors
  const colors = {
    primaryWarm: "#ea580c",
    adminBadgeBg: "#ffedd5",
    adminBadgeText: "#9a3412",
    textDark: "#1e293b",
  };

  // style objects
  const styles = {
    wrapper: {
      background: `linear-gradient(135deg, ${colors.adminBadgeBg} 0%, #fff7ed 50%, #ffffff 100%)`,
      minHeight: "100vh",
      color: colors.textDark,
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      overflowX: "hidden",
    },
    nav: {
      padding: "20px 0",
    },
    brand: {
      fontWeight: 800,
      fontSize: "1.5rem",
      letterSpacing: "-0.5px",
      color: colors.textDark,
    },
    btnPrimary: {
      backgroundColor: colors.primaryWarm,
      border: "none",
      color: "white",
      padding: "12px 30px",
      fontSize: "1.1rem",
      fontWeight: 600,
      transition: "all 0.3s ease",
      boxShadow: `0 4px 15px rgba(234, 88, 12, 0.3)`,
      cursor: "pointer",
      borderRadius: "40px",
      width: "250px",
      letterSpacing: "2px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "30px",
      height: "100%",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
      borderTop: `4px solid ${colors.primaryWarm}`,
      transition: "all 0.4s ease",
    },
    iconWrapper: {
      backgroundColor: colors.adminBadgeBg,
      color: colors.adminBadgeText,
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      fontSize: "1.8rem",
      marginBottom: "20px",
    },
  };

  return (
    <div className="d-flex flex-column" style={styles.wrapper}>
      {/*CSS animations & hover effects */}
      <style>
        {`
          .hover-btn:hover {
            background-color: ${colors.adminBadgeText} !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(154, 52, 18, 0.4) !important;
          }
          .hover-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(234, 88, 12, 0.15) !important;
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

          .anim-fade-in { animation: fadeIn 1s ease-out forwards; }
          .anim-slide-up { opacity: 0; animation: slideUp 1s ease-out forwards; }

          .delay-1 { animation-delay: 0.2s; }
          .delay-2 { animation-delay: 0.4s; }
          .delay-3 { animation-delay: 0.6s; }
        `}
      </style>

      {/* Navigation */}
      <nav style={styles.nav} className="anim-fade-in">
        <div className="container d-flex justify-content-between align-items-center">
          <div style={styles.brand}>
            <span style={{ color: colors.primaryWarm }}>Clear</span>Fund
          </div>
          <button
            onClick={() => navigate("/home")}
            className="hover-btn"
            style={styles.btnPrimary}
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="container flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center py-5">
        <div className="row justify-content-center w-100">
          <div className="col-lg-8 anim-slide-up">
            <h1
              className="display-3 fw-bold mb-4"
              style={{ color: colors.textDark }}
            >
              Restoring Trust Through <br />
              <span style={{ color: colors.primaryWarm }}>
                Transparent Donations
              </span>
            </h1>
            <p
              className="lead mb-5 px-md-5"
              style={{ color: colors.textDark, opacity: 0.8 }}
            >
              A revolutionary Web3 platform powered by Ethereum Smart Contracts.
              We ensure every contribution is trackable, and funds are only
              spent in predefined, administrator-approved categories.
            </p>
            <div className="d-flex justify-content-center gap-3 mb-5">
              {/* Changed button to navigate to /home */}
              <button
                onClick={() => navigate("/home")}
                className="hover-btn btn-lg"
                style={styles.btnPrimary}
                onMouseEnter={(e) => {
                  e.currentTarget.style.gap = "20px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.gap = "5px";
                }}
              >
                Get Started
                <ArrowBigRight
                  style={{ marginTop: "3px" }}
                  size={18}
                  color="white"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="row g-4 mt-4 w-100">
          <div className="col-md-4 anim-slide-up delay-1">
            <div
              className="hover-card d-flex flex-column align-items-center text-center"
              style={styles.card}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={styles.iconWrapper}
              >
                🔗
              </div>
              <h4 className="fw-bold mb-3" style={{ color: colors.textDark }}>
                Public Transparency
              </h4>
              <p className="text-muted mb-0">
                Say goodbye to distrust. Every donation and transaction is
                recorded on an immutable public ledger, ensuring 100%
                visibility.
              </p>
            </div>
          </div>

          <div className="col-md-4 anim-slide-up delay-2">
            <div
              className="hover-card d-flex flex-column align-items-center text-center"
              style={styles.card}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={styles.iconWrapper}
              >
                📂
              </div>
              <h4 className="fw-bold mb-3" style={{ color: colors.textDark }}>
                Categorized Spending
              </h4>
              <p className="text-muted mb-0">
                Funds can only be spent within predefined categories established
                by authorized administrators, enforcing strict accountability.
              </p>
            </div>
          </div>

          <div className="col-md-4 anim-slide-up delay-3">
            <div
              className="hover-card d-flex flex-column align-items-center text-center"
              style={styles.card}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={styles.iconWrapper}
              >
                🔐
              </div>
              <h4 className="fw-bold mb-3" style={{ color: colors.textDark }}>
                Role-Based Security
              </h4>
              <p className="text-muted mb-0">
                Secured by OpenZeppelin’s AccessControl, only designated roles
                are permitted to manage funds, protecting the treasury.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 anim-fade-in delay-3">
        <div className="container">
          <p
            className="mb-0 small fw-semibold"
            style={{ color: colors.adminBadgeText }}
          >
            Powered by React.js • Solidity • Ethers.js
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
