import React, { useState, useContext } from "react";
import { Web3Context } from "../context/Web3Context.jsx";
import { Card, Form, InputGroup, Button } from "react-bootstrap";
import { ethers } from "ethers";
import { Heart } from "lucide-react";

export default function Donate() {
  const { writeContract, readContract, fetchData } = useContext(Web3Context);

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount)) return;

    // check wallet is connected
    if (!writeContract) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setLoading(true);

      const don = await writeContract.donate({
        value: ethers.parseEther(amount),
      });

      await don.wait();

      setAmount("");
      alert("Thank you for your donation!");

      //refresh PUBLIC data
      if (readContract) {
        await fetchData(readContract);
      }
    } catch (error) {
      console.error(error);
      alert("Donation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // Theme Colors
  const primaryWarm = "#ea580c";
  const gradientStart = "#f97316";
  const palePeach = "#ffedd5";

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
          <h3 className="fw-bold m-0">Make a Donation</h3>
        </div>

        <p className="mb-4" style={{ color: palePeach }}>
          Your funds are locked in a smart contract and can only be spent on
          pre-approved categories.
        </p>

        <Form onSubmit={handleDonate}>
          <Form.Group className="mb-4">
            <Form.Label style={{ color: palePeach }}>Amount (ETH)</Form.Label>

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
                  color: "#ffffff",
                }}
              />

              <InputGroup.Text
                className="border-0 px-4"
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
            disabled={loading || !writeContract}
            className="w-100 py-3 fw-bold border-0 rounded-pill shadow-sm"
            style={{
              color: "#c2410c",
              backgroundColor: palePeach,
              border: "1px solid black",
              opacity: loading || !writeContract ? 0.7 : 1,
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!loading && writeContract) {
                e.target.style.backgroundColor = "#c2410c";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = palePeach;
              e.target.style.color = "#c2410c";
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
