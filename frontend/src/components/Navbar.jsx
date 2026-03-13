import React, { useContext } from "react";
// import { Web3Context } from "../context/Web3Context";
import { Navbar, Container, Button, Badge } from "react-bootstrap";
import { Wallet, ShieldCheck } from "lucide-react";

export default function NavbarComponent() {
  //   const { account, connectWallet, isAdmin } = useContext(Web3Context);

  return (
    <Navbar bg="white" className="shadow-sm border-bottom py-3">
      <Container style={{ maxWidth: "1152px" }}>
        <Navbar.Brand className="d-flex align-items-center gap-2 fw-bold text-dark m-0">
          <ShieldCheck color="#10b981" size={32} />
          ClearFund
        </Navbar.Brand>

        <Navbar.Collapse className="justify-content-end">
          {/* {account ? ( */}
          <div className="d-flex align-items-center gap-3">
            {/* {isAdmin && ( */}
            <Badge
              bg="success"
              bg-opacity-25
              text="success"
              pill
              className="px-3 py-2 fw-normal"
              style={{ backgroundColor: "#d1fae5", color: "#065f46" }}
            >
              Admin
            </Badge>
            {/* //   )} */}
            <div
              className="d-flex align-items-center gap-2 bg-light px-3 py-2 rounded-3 text-secondary font-monospace"
              style={{ fontSize: "0.9rem" }}
            >
              <Wallet size={16} />
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          </div>
          {/* ) : ( */}
          <Button
            onClick={connectWallet}
            style={{
              backgroundColor: "#059669",
              borderColor: "#059669",
              fontWeight: "500",
            }}
            className="px-4 py-2 rounded-3"
          >
            Connect Wallet
          </Button>
          {/* )} */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
