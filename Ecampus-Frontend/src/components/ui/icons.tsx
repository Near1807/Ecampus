import type { ReactNode } from 'react'

interface IconProps {
  size?: number
  strokeWidth?: number
}

function Icon({ size = 18, strokeWidth = 1.8, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={p.strokeWidth ?? 2}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
)
export const PlusIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={p.strokeWidth ?? 2.2}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)
export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </Icon>
)
export const ChevronLeftIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={p.strokeWidth ?? 2.2}>
    <path d="m15 5-7 7 7 7" />
  </Icon>
)
export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={p.strokeWidth ?? 2.2}>
    <path d="m9 5 7 7-7 7" />
  </Icon>
)
export const BoardIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="3" width="10" height="10" />
    <rect x="15" y="3" width="6" height="6" />
    <rect x="15" y="11" width="6" height="10" />
    <rect x="3" y="15" width="10" height="6" />
  </Icon>
)
export const DocIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M9 12h7M9 16h5" />
  </Icon>
)
export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
)
export const BloodDropIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11Z" />
    <path d="M12 11v6M9 14h6" />
  </Icon>
)
