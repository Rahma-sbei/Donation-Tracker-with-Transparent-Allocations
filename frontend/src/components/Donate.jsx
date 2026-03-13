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

  return (
    <Card
      className="border-0 shadow-lg rounded-4 text-white"
      style={{
        backgroundImage: "linear-gradient(to bottom right, #10b981, #0d9488)",
      }}
    >
      <Card.Body className="p-4 p-lg-5">
        <div className="d-flex align-items-center gap-3 mb-3">
          <Heart size={32} color="#a7f3d0" fill="#a7f3d0" />
          <h3 className="fw-bold m-0">Make a Donation</h3>
        </div>

        <p className="mb-4" style={{ color: "#d1fae5", lineHeight: "1.6" }}>
          Your funds are locked in a smart contract and can only be spent on
          pre-approved categories.
        </p>

        <Form onSubmit={handleDonate}>
          <Form.Group className="mb-4">
            <Form.Label style={{ color: "#d1fae5", fontWeight: "500" }}>
              Amount (ETH)
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                step="0.001"
                placeholder="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="border-0 shadow-none text-white py-2"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
              <InputGroup.Text
                className="border-0 border-start-0"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "#a7f3d0",
                  fontWeight: "500",
                }}
              >
                ETH
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button
            type="submit"
            disabled={loading || !contract}
            className="w-100 py-3 fw-bold border-0"
            style={{
              backgroundColor: "#ffffff",
              color: "#047857",
              opacity: loading || !contract ? 0.7 : 1,
            }}
          >
            {loading ? "Processing..." : "Donate Now"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
