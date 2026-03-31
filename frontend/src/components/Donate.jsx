import React, { useState, useContext } from "react";
import { Web3Context } from "../context/Web3Context.jsx";
import { Card, Form, InputGroup, Button } from "react-bootstrap";
import { ethers } from "ethers";
import { Heart } from "lucide-react";

export default function Donate() {
  const { contract, fetchData, provider } = useContext(Web3Context);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;

    try {
      setLoading(true);
      const tx = await contract.donate({ value: ethers.parseEther(amount) });
      await tx.wait();

      setAmount("");
      alert("Thank you for your donation!");
      await fetchData(contract, provider);
    } catch (error) {
      console.error(error);
      alert("Donation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // Design Theme Colors
  const primaryWarm = "#ea580c"; // Sunset Orange
  const gradientStart = "#f97316"; // Lighter vibrant orange for the gradient
  const palePeach = "#ffedd5"; // Soft warm color for subtle text/icons

  return (
    <Card
      className="border-0 shadow-lg rounded-4 text-white"
      style={{
        backgroundImage: `linear-gradient(135deg, ${gradientStart} 0%, ${primaryWarm} 100%)`,
      }}
    >
      <Card.Body className="p-4 p-lg-5">
        <div className="d-flex align-items-center gap-3 mb-3">
          <Heart size={32} color={palePeach} fill={palePeach} />
          <h3 className="fw-bold m-0" style={{ letterSpacing: "-0.5px" }}>
            Make a Donation
          </h3>
        </div>

        <p className="mb-4" style={{ color: palePeach, lineHeight: "1.6" }}>
          Your funds are locked in a smart contract and can only be spent on
          pre-approved categories.
        </p>

        <Form onSubmit={handleDonate}>
          <Form.Group className="mb-4">
            <Form.Label style={{ color: palePeach, fontWeight: "500" }}>
              Amount (ETH)
            </Form.Label>
            <InputGroup className="rounded-3 overflow-hidden">
              <Form.Control
                type="number"
                step="0.001"
                placeholder="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="border-0 shadow-none py-3"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#ffffff", // Keeps input text white
                }}
              />
              <InputGroup.Text
                className="border-0 border-start-0 px-4"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: palePeach,
                  fontWeight: "600",
                }}
              >
                ETH
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button
            type="submit"
            disabled={loading || !contract}
            className="w-100 py-3 fw-bold border-0 rounded-pill shadow-sm"
            bg=""
            style={{
              color: "#c2410c",
              fontSize: "1.05rem",
              letterSpacing: "0.3px",
              opacity: loading || !contract ? 0.7 : 1,
              transition: "transform 0.2s ease",
              border: "1px solid black",
              backgroundColor: palePeach,
            }}
            onMouseEnter={(e) => {
              console.log("mouse in");
              e.target.style.backgroundColor = "#c2410c";
              e.target.style.color = "white";

              if (!loading && contract)
                e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = palePeach;
              e.target.style.color = "#c2410c";

              if (!loading && contract)
                e.target.style.transform = "translateY(0)";
            }}
          >
            {loading ? "Processing..." : "Donate Now"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
