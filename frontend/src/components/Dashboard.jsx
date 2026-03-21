import React, { useContext } from "react";
import { Web3Context } from "../context/Web3Context";
import { Card, Badge, ListGroup } from "react-bootstrap";
import { Activity, Landmark, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const { balance, events } = useContext(Web3Context);

  // Design System Colors
  const primaryWarm = "#ea580c"; // Sunset Orange
  const softPeach = "#ffedd5"; // Warm background for icons and badges
  const textDark = "#1e293b"; // Slate 800 for primary text
  const textMuted = "#64748b"; // Slate 500 for secondary text
  const borderLight = "#e2e8f0"; // Slate 200 for subtle dividers

  return (
    <div className="d-flex flex-column gap-4">
      {/* Display some stats */}
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4 d-flex justify-content-between align-items-center">
          <div>
            <p
              className="fw-semibold mb-1"
              style={{
                color: textMuted,
                fontSize: "0.9rem",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Available Funds
            </p>
            <h2
              className="fw-bold m-0"
              style={{ color: textDark, letterSpacing: "-1px" }}
            >
              {balance}{" "}
              <span style={{ fontSize: "1.5rem", color: textMuted }}>ETH</span>
            </h2>
          </div>
          <div
            className="p-3 rounded-4 shadow-sm"
            style={{ backgroundColor: softPeach, border: "1px solid #fed7aa" }}
          >
            <Landmark color={primaryWarm} size={28} />
          </div>
        </Card.Body>
      </Card>

      {/* Events List */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header
          className="p-4 d-flex align-items-center gap-2 border-bottom-0"
          style={{
            backgroundColor: "#f8fafc",
            borderBottom: `1px solid ${borderLight}`,
          }}
        >
          <Activity size={22} color={primaryWarm} />
          <h6
            className="m-0 fw-bold"
            style={{ color: textDark, fontSize: "1.1rem" }}
          >
            Recent Transparent Spending
          </h6>
        </Card.Header>

        <ListGroup variant="flush">
          {events.length === 0 ? (
            <div
              className="p-5 text-center"
              style={{ color: textMuted, backgroundColor: "#ffffff" }}
            >
              <div className="mb-2 opacity-50">
                <Activity size={32} />
              </div>
              <p className="m-0 fw-medium">No spending events recorded yet.</p>
            </div>
          ) : (
            events.map((ev, i) => (
              <ListGroup.Item
                key={i}
                className="p-4 d-flex justify-content-between align-items-center border-bottom"
                style={{
                  backgroundColor: "#ffffff",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fdf8f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffffff")
                }
              >
                <div>
                  <Badge
                    pill
                    className="mb-2 px-3 py-2 shadow-sm"
                    style={{
                      backgroundColor: softPeach,
                      color: "#9a3412", // Deep rust orange for readable contrast
                      fontWeight: "600",
                      border: "1px solid #fed7aa",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {ev.category}
                  </Badge>
                  <p
                    className="m-0 font-monospace"
                    style={{ color: textMuted, fontSize: "0.85rem" }}
                  >
                    To: {ev.destination}
                  </p>
                </div>
                <div className="text-end">
                  <p
                    className="fw-bold m-0 d-flex align-items-center gap-1 fs-5"
                    style={{ color: textDark }}
                  >
                    {ev.amount} ETH{" "}
                    <ArrowUpRight
                      size={22}
                      color={primaryWarm}
                      strokeWidth={2.5}
                    />
                  </p>
                </div>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>
    </div>
  );
}
