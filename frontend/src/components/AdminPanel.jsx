import React, { useState, useContext } from "react";
import { Web3Context } from "../context/Web3Context.jsx";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { ethers } from "ethers";
import { Settings, Send } from "lucide-react";

export default function AdminPanel() {
  const { contract, isAdmin, fetchData, provider } = useContext(Web3Context);
  const [category, setCategory] = useState("");
  const [spendDetails, setSpendDetails] = useState({
    category: "",
    amount: "",
    destination: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return null;

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const tx = await contract.addCategory(category);
      await tx.wait();
      setCategory("");
      alert("Category added successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpend = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const amountWei = ethers.parseEther(spendDetails.amount);
      const tx = await contract.spend(
        spendDetails.category,
        amountWei,
        spendDetails.destination,
      );
      await tx.wait();
      setSpendDetails({ category: "", amount: "", destination: "" });
      await fetchData(contract, provider);
      alert("Funds routed successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Design System Colors for Secure Admin Area
  const primaryWarm = "#ea580c"; // Sunset Orange
  const bgDark = "#0f172a"; // Deep Slate (Premium, secure dark tone)
  const textMuted = "#94a3b8"; // Slate 400
  const inputBg = "rgba(255, 255, 255, 0.04)";
  const inputBorder = "rgba(255, 255, 255, 0.08)";

  // Custom styling for dark form inputs
  const darkInputStyle = {
    backgroundColor: inputBg,
    border: `1px solid ${inputBorder}`,
    color: "#ffffff",
    boxShadow: "none",
    padding: "0.75rem 1rem",
    transition: "border-color 0.2s ease",
  };

  return (
    <Card
      className="border-0 shadow-lg rounded-4 mt-3"
      style={{ backgroundColor: bgDark, color: "#ffffff" }}
    >
      <Card.Body className="p-4 p-lg-5">
        <div
          className="d-flex align-items-center gap-3 mb-4 pb-4"
          style={{ borderBottom: `1px solid ${inputBorder}` }}
        >
          <div
            className="p-2 rounded-3 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "rgba(234, 88, 12, 0.15)" }}
          >
            <Settings color={primaryWarm} size={24} />
          </div>
          <h4 className="m-0 fw-bold" style={{ letterSpacing: "-0.5px" }}>
            Admin Control Panel
          </h4>
        </div>

        <Row className="g-5">
          {/* Add Category Form */}
          <Col md={6}>
            <Form onSubmit={handleAddCategory}>
              <h6
                className="fw-semibold mb-3"
                style={{ color: textMuted, letterSpacing: "0.5px" }}
              >
                1. Add Approved Category
              </h6>
              <Form.Group className="mb-4">
                <Form.Control
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Marketing, Hardware"
                  style={darkInputStyle}
                  className="rounded-3"
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                disabled={loading}
                className="w-100 border-0 fw-semibold rounded-pill py-2 shadow-sm"
                style={{
                  backgroundColor: "#1e293b", // Slate 800
                  color: "#f8fafc",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#334155")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#1e293b")
                }
              >
                Add Category
              </Button>
            </Form>
          </Col>

          {/* Spend Funds Form */}
          <Col md={6}>
            <Form onSubmit={handleSpend}>
              <h6
                className="fw-semibold mb-3"
                style={{ color: textMuted, letterSpacing: "0.5px" }}
              >
                2. Route Funds
              </h6>

              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Category Name"
                  value={spendDetails.category}
                  onChange={(e) =>
                    setSpendDetails({
                      ...spendDetails,
                      category: e.target.value,
                    })
                  }
                  style={darkInputStyle}
                  className="rounded-3"
                  required
                />
              </Form.Group>

              <Row className="g-2 mb-4">
                <Col xs={4}>
                  <Form.Control
                    type="number"
                    step="0.001"
                    placeholder="ETH"
                    value={spendDetails.amount}
                    onChange={(e) =>
                      setSpendDetails({
                        ...spendDetails,
                        amount: e.target.value,
                      })
                    }
                    style={darkInputStyle}
                    className="rounded-3"
                    required
                  />
                </Col>
                <Col xs={8}>
                  <Form.Control
                    type="text"
                    placeholder="Destination 0x..."
                    value={spendDetails.destination}
                    onChange={(e) =>
                      setSpendDetails({
                        ...spendDetails,
                        destination: e.target.value,
                      })
                    }
                    style={{ ...darkInputStyle, fontFamily: "monospace" }}
                    className="rounded-3"
                    required
                  />
                </Col>
              </Row>

              <Button
                type="submit"
                disabled={loading}
                className="w-100 border-0 fw-bold d-flex justify-content-center align-items-center gap-2 rounded-pill py-2 shadow-sm"
                style={{
                  backgroundColor: primaryWarm,
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = "#c2410c";
                    e.target.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = primaryWarm;
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                <Send size={18} />{" "}
                {loading ? "Executing..." : "Execute Transfer"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
