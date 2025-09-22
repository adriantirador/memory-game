"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react'
import Card from './Card'
import { CardType } from '../types/Card'
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material'

const allEmojis = ['🐶', '🐱', '🐰', '🐸', '🐵', '🐷', '🐻', '🦊', '🐯', '🦁', '🐮', '🐔', '🐧', '🐢', '🐬', '🦄', '🐝', '🐴']

const levelSettings: Record<1 | 2 | 3, number> = {
  1: 2,
  2: 4,
  3: 6,
}

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
  const [level, setLevel] = useState<1 | 2 | 3>(1)
  const [cards, setCards] = useState<CardType[]>([])
  const [firstCard, setFirstCard] = useState<CardType | null>(null)
  const [secondCard, setSecondCard] = useState<CardType | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const resetGame = useCallback(() => {
    const gridSize = levelSettings[level]
    const numPairs = (gridSize * gridSize) / 2
    const selectedEmojis = allEmojis.slice(0, numPairs)
    setCards(shuffleArray(selectedEmojis))
    setFirstCard(null)
    setSecondCard(null)
    setDisabled(false)
    setMoves(0)
    setTime(0)
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [level])

  useEffect(() => {
    resetGame()
  }, [level, resetGame])

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

  useEffect(() => {
    if (cards.length && cards.every(card => card.matched)) {
      setIsRunning(false)
    }
  }, [cards])

  const handleCardClick = (card: CardType) => {
    if (disabled || card.flipped || card.matched) return
    if (!isRunning) setIsRunning(true)

    setCards(prev =>
      prev.map(c =>
        c.id === card.id ? { ...c, flipped: true } : c
      )
    )

    if (!firstCard) {
      setFirstCard(card)
    } else if (!secondCard) {
      setSecondCard(card)
      setDisabled(true)
      setMoves(moves + 1)

      setTimeout(() => {
        checkMatch(card)
      }, 1000)
    }
  }

  const checkMatch = (second: CardType) => {
    if (!firstCard) return

    if (firstCard.value === second.value) {
      setCards(prev =>
        prev.map(c =>
          c.value === firstCard.value
            ? { ...c, matched: true }
            : c
        )
      )
    } else {
      setCards(prev =>
        prev.map(c =>
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🧠 Memory Game
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="level-select-label">Level</InputLabel>
          <Select
            labelId="level-select-label"
            value={level}
            label="Level"
            onChange={(e) => setLevel(Number(e.target.value) as 1 | 2 | 3)}
          >
            <MenuItem value={1}>Level 1 (2x2)</MenuItem>
            <MenuItem value={2}>Level 2 (4x4)</MenuItem>
            <MenuItem value={3}>Level 3 (6x6)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1">Moves: {moves}</Typography>
        <Typography variant="subtitle1">Time: {formatTime(time)}</Typography>
      </Box>

      {/* Responsive grid layout */}
      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: {
            xs: `repeat(2, 1fr)`,  // Mobile: 2 columns
            sm: `repeat(${Math.min(levelSettings[level], 4)}, 1fr)`, // Small screens max 4 cols
            md: `repeat(${levelSettings[level]}, 1fr)`, // Medium+ screens full columns
          },
          maxWidth: 600,
          mx: 'auto',
        }}
      >
        {cards.map((card) => (
          <Box key={card.id} sx={{ aspectRatio: '1 / 1' }}>
            <Card card={card} onClick={() => handleCardClick(card)} />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={resetGame}>
          Restart Game
        </Button>
      </Box>
    </Box>
  )
}

export default GameBoard
