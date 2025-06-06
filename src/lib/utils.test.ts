import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('concatenates class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('ignores falsey values', () => {
    expect(cn('a', undefined, '', 'b')).toBe('a b')
  })
})
