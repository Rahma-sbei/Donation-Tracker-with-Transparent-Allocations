import NavbarComponent from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Donate from "./components/Donate";
import AdminPanel from "./components/AdminPanel";
import { Web3Provider } from "./context/Web3Context";
import { Container, Col, Row } from "react-bootstrap";

export default function App() {
  //console.log("App is rendering");

  return (
    <Web3Provider>
      <div
        style={{
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          fontFamily: "system-ui, sans-serif",
          border: "2px solid black",
        }}
      >
        <NavbarComponent />

        <Container
          fluid
          style={{
            marginTop: "70px",
            width: "90%",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div className="mb-4">
            <h1 className="fw-bold text-dark mb-2">Transparent Fund Tracker</h1>
            <p style={{ fontWeight: "bold", color: "#868585" }}>
              See exactly where every piece of ETH goes on the blockchain.
            </p>
          </div>

          <div
            style={{
              border: "1px solid black",
              gap: "35px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Col
              lg={8}
              className="d-flex flex-column gap-4"
              style={{ border: "1px solid black" }}
            >
              <Dashboard />
              <AdminPanel />
            </Col>

            <Col lg={3}>
              <div className="sticky-top" style={{ top: "2rem", zIndex: 1 }}>
                <Donate />
              </div>
            </Col>
          </div>
        </Container>
      </div>
    </Web3Provider>
  );
}
