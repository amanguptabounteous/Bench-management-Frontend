// src/components/ExpandableCard.jsx
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

function ExpandableCard({ title, subtitle, children }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Header
        onClick={() => setExpanded(!expanded)}
        style={{
          cursor: 'pointer',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <strong>{title}</strong> — <span className="text-muted">{subtitle}</span>
        </div>
        <div>
          <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
        </div>
      </Card.Header>
      {expanded && <Card.Body>{children}</Card.Body>}
    </Card>
  );
}

export default ExpandableCard;
