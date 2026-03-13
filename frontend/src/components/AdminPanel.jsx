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

  // Custom styling for dark form inputs to keep the original design
  const darkInputStyle = {
    backgroundColor: "#111827",
    border: "1px solid #4b5563",
    color: "#ffffff",
    boxShadow: "none",
  };

  return (
    <Card
      className="border-0 shadow-sm rounded-4 mt-2"
      style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
    >
      <Card.Body className="p-4 p-lg-5">
        <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom border-secondary">
          <Settings color="#9ca3af" size={24} />
          <h4 className="m-0 fw-bold">Admin Control Panel</h4>
        </div>

        <Row className="g-5">
          {/* Add Category Form */}
          <Col md={6}>
            <Form onSubmit={handleAddCategory}>
              <h6 className="fw-medium mb-3" style={{ color: "#9ca3af" }}>
                1. Add Approved Category
              </h6>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Marketing, Hardware"
                  style={darkInputStyle}
                  required
                />
              </Form.Group>
              <Button
                type="submit"
                disabled={loading}
                className="w-100 border-0 fw-medium"
                style={{ backgroundColor: "#374151", color: "#ffffff" }}
              >
                Add Category
              </Button>
            </Form>
          </Col>

          {/* Spend Funds Form */}
          <Col md={6}>
            <Form onSubmit={handleSpend}>
              <h6 className="fw-medium mb-3" style={{ color: "#9ca3af" }}>
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
                  required
                />
              </Form.Group>

              <Row className="g-2 mb-3">
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
                    required
                  />
                </Col>
              </Row>

              <Button
                type="submit"
                disabled={loading}
                className="w-100 border-0 fw-medium d-flex justify-content-center align-items-center gap-2"
                style={{ backgroundColor: "#059669", color: "#ffffff" }}
              >
                <Send size={18} /> Execute Transfer
              </Button>
            </Form>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
