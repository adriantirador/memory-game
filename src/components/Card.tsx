"use client"

import React from 'react'
import { Card as MUICard, CardContent, Typography } from '@mui/material'
import { Props } from '../types/Card'

const Card: React.FC<Props> = ({ card, onClick }) => {
  const display = card.flipped || card.matched

  return (
    <MUICard
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        width: '100%',
        aspectRatio: '1 / 1', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: display ? '#fff' : '#1976d2',
        color: display ? '#000' : '#fff',
        fontSize: '2rem',
        boxShadow: display ? 3 : 6,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
      elevation={4}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography fontSize={{ xs: 28, sm: 36, md: 40 }}>
          {display ? card.value : '❓'}
        </Typography>
      </CardContent>
    </MUICard>
  )
}

export default Card
