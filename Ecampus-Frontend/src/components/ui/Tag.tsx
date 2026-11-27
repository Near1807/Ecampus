import type { ReactNode } from 'react'
import { MONO } from '../../theme/tokens'

interface TagProps {
  children: ReactNode
  fontSize: number
  padding: string
  border?: string
  color?: string
  alignSelf?: 'flex-start'
}

/** Petite étiquette de catégorie en capitales. */
export function Tag({ children, fontSize, padding, border, color, alignSelf }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        alignSelf,
        fontFamily: MONO,
        fontSize,
        fontWeight: 500,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        padding,
        border,
        color,
        borderRadius: 3,
      }}
    >
      {children}
    </span>
  )
}
