import React, { useState, useContext } from "react";
import { Web3Context } from "../context/Web3Context.jsx";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { ethers } from "ethers";
import { Settings, Send } from "lucide-react";

export default function ControlPanel() {
  const { writeContract, readContract, isAdmin, isSpender, fetchData } =
    useContext(Web3Context);

  const [category, setCategory] = useState("");

  const [spendDetails, setSpendDetails] = useState({
    categoryId: "",
    amount: "",
    destination: "",
    memo: "",
  });

  const [loading, setLoading] = useState(false);

  // hide if user is not an admin nor a spender
  if (!isAdmin && !isSpender) return null;

  // admin : add category

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!writeContract) {
      alert("Connect wallet first");
      return;
    }

    try {
      setLoading(true);

      const tx = await writeContract.addCategory(category);
      await tx.wait();

      setCategory("");
      alert("Category added successfully!");

      if (readContract) await fetchData(readContract);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // spender : spend funds
  const handleSpend = async (e) => {
    e.preventDefault();

    if (!writeContract) {
      alert("Connect wallet first");
      return;
    }

    try {
      setLoading(true);

      const amountWei = ethers.parseEther(spendDetails.amount);

      const tx = await writeContract.spend(
        Number(spendDetails.categoryId),
        amountWei,
        spendDetails.destination,
        spendDetails.memo,
      );

      await tx.wait();

      setSpendDetails({
        categoryId: "",
        amount: "",
        destination: "",
        memo: "",
      });

      if (readContract) await fetchData(readContract);

      alert("Funds routed successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const primaryWarm = "#ea580c";
  const bgDark = "#0f172a";
  const textMuted = "#94a3b8";
  const inputBg = "rgba(255, 255, 255, 0.04)";
  const inputBorder = "rgba(255, 255, 255, 0.08)";

  const darkInputStyle = {
    backgroundColor: inputBg,
    border: `1px solid ${inputBorder}`,
    color: "#ffffff",
    boxShadow: "none",
    padding: "0.75rem 1rem",
    borderRaduis: "15px",
  };

  return (
    <>
      <style>
        {`
          .inpColor::placeholder {
            color: #a0a0a0;
            opacity: 1;          }
        `}
      </style>
      <Card
        className="border-0 shadow-lg rounded-4 mt-3"
        style={{
          backgroundColor: bgDark,
          color: "#ffffff",
          marginBottom: "20px",
        }}
      >
        <Card.Body className="p-4 p-lg-5">
          <div
            className="d-flex align-items-center gap-3 mb-4 pb-4"
            style={{ borderBottom: `1px solid ${inputBorder}` }}
          >
            <div
              className="p-2 rounded-3"
              style={{ backgroundColor: "rgba(234, 88, 12, 0.15)" }}
            >
              <Settings color={primaryWarm} size={24} />
            </div>
            <h4 className="m-0 fw-bold">Control Panel</h4>
          </div>

          <Row className="g-5">
            {isAdmin && (
              <Col md={isSpender ? 6 : 12}>
                <Form onSubmit={handleAddCategory}>
                  <h6 className="mb-3" style={{ color: textMuted }}>
                    Add Category
                  </h6>

                  <Form.Control
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Marketing"
                    style={darkInputStyle}
                    className="inpColor"
                    required
                  />

                  <Button
                    type="submit"
                    disabled={loading || !writeContract}
                    style={{
                      color: "white",
                      backgroundColor: "#c2410c",
                      border: "1px solid black",
                      opacity: loading || !writeContract ? 0.7 : 1,
                      transition: "transform 0.2s ease",
                      marginTop: "30px",
                      width: "100%",
                      borderRadius: "15px",
                      fontWeight: "bold",
                      letterSpacing: "2px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#e9ae97";
                      e.target.style.color = "#c2410c";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#c2410c";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Add Category
                  </Button>
                </Form>
              </Col>
            )}

            {isSpender && (
              <Col md={isAdmin ? 6 : 12}>
                <Form onSubmit={handleSpend}>
                  <h6 className="mb-3" style={{ color: textMuted }}>
                    Route Funds
                  </h6>

                  <Form.Control
                    type="number"
                    placeholder="Category ID"
                    value={spendDetails.categoryId}
                    onChange={(e) =>
                      setSpendDetails({
                        ...spendDetails,
                        categoryId: e.target.value,
                      })
                    }
                    style={{ ...darkInputStyle, marginBottom: "15px" }}
                    className="inpColor"
                    required
                  />

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
                        className="inpColor"
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
                        className="inpColor"
                        required
                      />
                    </Col>
                  </Row>

                  <Form.Control
                    type="text"
                    placeholder="Memo (optional)"
                    value={spendDetails.memo}
                    onChange={(e) =>
                      setSpendDetails({
                        ...spendDetails,
                        memo: e.target.value,
                      })
                    }
                    style={darkInputStyle}
                    className="inpColor"
                  />

                  <Button
                    type="submit"
                    disabled={loading || !writeContract}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      color: "white",
                      backgroundColor: "#c2410c",
                      border: "1px solid black",
                      opacity: loading || !writeContract ? 0.7 : 1,
                      transition: "transform 0.2s ease",
                      borderRadius: "15px",
                      fontWeight: "bold",
                      letterSpacing: "2px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#e9ae97";
                      e.target.style.color = "#c2410c";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#c2410c";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    <Send size={18} color="white" />{" "}
                    {loading ? "Executing..." : "Execute Transfer"}
                  </Button>
                </Form>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
