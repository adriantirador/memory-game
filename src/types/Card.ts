export type CardType = {
  id: number
  value: string
  matched: boolean
  flipped: boolean
}

export interface Props {
  card: CardType
  onClick: () => void
}