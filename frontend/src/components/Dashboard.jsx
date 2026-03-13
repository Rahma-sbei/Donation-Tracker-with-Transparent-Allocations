import React, { useContext } from "react";
// import { Web3Context } from '../context/Web3Context';
import { Card, Badge, ListGroup } from "react-bootstrap";
import { Activity, Landmark, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  // const { balance, events } = useContext(Web3Context);

  return (
    <div className="d-flex flex-column gap-4">
      {/* Top Stat */}
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4 d-flex justify-content-between align-items-start">
          <div>
            <p
              className="text-muted fw-medium mb-1"
              style={{ fontSize: "0.9rem" }}
            >
              Available Funds
            </p>
            <h2 className="fw-bold text-dark m-0">ETH</h2>
          </div>
          <div className="p-3 rounded-3" style={{ backgroundColor: "#ecfdf5" }}>
            <Landmark color="#059669" size={24} />
          </div>
        </Card.Body>
      </Card>

      {/* Events List */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header className="bg-light border-bottom-0 p-3 px-4 d-flex align-items-center gap-2">
          <Activity size={20} className="text-muted" />
          <h6 className="m-0 fw-bold text-dark">Recent Transparent Spending</h6>
        </Card.Header>

        <ListGroup variant="flush">
          {/* {events.length === 0 ? (
            <div className="p-4 text-center text-muted">
              No spending events recorded yet.
            </div>
          ) : (
            events.map((ev, i) => (
              <ListGroup.Item
                key={i}
                className="p-4 d-flex justify-content-between align-items-center border-bottom"
              >
                <div>
                  <Badge
                    pill
                    className="mb-2 px-3 py-1"
                    style={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      fontWeight: "600",
                    }}
                  >
                    {ev.category}
                  </Badge>
                  <p
                    className="text-muted m-0 font-monospace"
                    style={{ fontSize: "0.85rem" }}
                  >
                    To: {ev.destination}
                  </p>
                </div>
                <div className="text-end">
                  <p className="fw-bold text-dark m-0 d-flex align-items-center gap-1 fs-5">
                    {ev.amount} ETH <ArrowUpRight size={20} color="#10b981" />
                  </p>
                </div>
              </ListGroup.Item>
            ))
          )} */}
        </ListGroup>
      </Card>
    </div>
  );
}
