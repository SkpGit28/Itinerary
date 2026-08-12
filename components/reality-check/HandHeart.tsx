import * as React from 'react'

/**
 * Haath se bana hua sa dil. Lucide ka Heart bilkul symmetrical hai, isliye
 * ye alag path use kiya hai: dono lobe thode alag hain aur end thoda sa
 * aage nikla hua hai, taaki pen se banaya hua lage.
 */
export function HandHeart({
  className,
  strokeWidth = 1.7,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12.1 20.4C5.2 15.9 2.9 11.9 3.5 8.9 4.1 5.9 7.6 4.4 10.1 6.2c.8.6 1.5 1.5 1.9 2.4.5-1 1.1-1.9 2-2.5 2.6-1.7 6-.2 6.5 2.9.5 3.1-2 7-8.4 11.4Z" />
      {/* Chhota sa extra stroke, jaise pen utha ke dobara laga diya ho. */}
      <path d="M13.7 20c1-.5 1.9-1.1 2.7-1.7" opacity="0.55" />
    </svg>
  )
}
