import React from 'react';
import { Box } from "@mui/material";

const Chip = ({ label, color, size, sx }) => {
  const getColor = () => {
    switch(color) {
      case 'success': return '#2ecc71';
      case 'warning': return '#f39c12';
      case 'error': return '#e74c3c';
      default: return '#3498db';
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: getColor(),
        color: 'white',
        padding: size === 'small' ? '2px 8px' : '4px 12px',
        borderRadius: '16px',
        fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        ...sx
      }}
    >
      {label}
    </Box>
  );
};

export default Chip;