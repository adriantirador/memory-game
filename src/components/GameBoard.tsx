"use client"
import React, { useEffect, useState, useRef } from 'react'
import Card from './Card'
import { CardType } from '../types/Card'
import { Box, Typography, Button, Grid } from '@mui/material'

const initialValues = ['🐶', '🐱', '🐰', '🐸', '🐵', '🐷', '🐻', '🦊']

const shuffleArray = (array: string[]): CardType[] => {
  const doubled = [...array, ...array]
  return doubled
    .map((value, index) => ({
      id: index,
      value,
      matched: false,
      flipped: false,
    }))
    .sort(() => Math.random() - 0.5)
}

const GameBoard = () => {
  const [cards, setCards] = useState<CardType[]>([])
  const [firstCard, setFirstCard] = useState<CardType | null>(null)
  const [secondCard, setSecondCard] = useState<CardType | null>(null)
  const [disabled, setDisabled] = useState(false)

  const [moves, setMoves] = useState(0)          // Move counter
  const [time, setTime] = useState(0)            // Timer seconds
  const [isRunning, setIsRunning] = useState(false) // Timer running state

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize game
  useEffect(() => {
    resetGame()
  }, [])

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning])

  // Check if all cards are matched => stop timer
  useEffect(() => {
    if (cards.length && cards.every(card => card.matched)) {
      setIsRunning(false)
    }
  }, [cards])

  const handleCardClick = (card: CardType) => {
    if (disabled || card.flipped || card.matched) return

    // Start timer on first flip
    if (!isRunning) {
      setIsRunning(true)
    }

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, flipped: true } : c
    )
    setCards(updatedCards)

    if (!firstCard) {
      setFirstCard(card)
    } else if (!secondCard) {
      setSecondCard(card)
      setDisabled(true)
      setMoves(moves + 1) // Increment move on every pair of flips

      setTimeout(() => {
        checkMatch(card)
      }, 1000)
    }
  }

  const checkMatch = (second: CardType) => {
    if (!firstCard) return

    if (firstCard.value === second.value) {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.value === firstCard.value
            ? { ...c, matched: true }
            : c
        )
      )
    } else {
      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === firstCard.id || c.id === second.id
            ? { ...c, flipped: false }
            : c
        )
      )
    }

    setFirstCard(null)
    setSecondCard(null)
    setDisabled(false)
  }

  const resetGame = () => {
    setCards(shuffleArray(initialValues))
    setFirstCard(null)
    setSecondCard(null)
    setDisabled(false)
    setMoves(0)
    setTime(0)
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  // Format timer as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🧠 Memory Game
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1">Moves: {moves}</Typography>
        <Typography variant="subtitle1">Time: {formatTime(time)}</Typography>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {cards.map((card) => (
          <Grid item xs={6} sm={4} md={3} key={card.id}>
            <Card card={card} onClick={() => handleCardClick(card)} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={resetGame}>
          Restart Game
        </Button>
      </Box>
    </Box>
  )
}

export default GameBoard
