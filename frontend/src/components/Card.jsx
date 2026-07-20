// frontend/src/components/Card.jsx
import React from 'react'

const Card = ({ children, className = '', hoverable = false, onClick }) => {
  return (
    <div 
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  )
}

export default Card