import { haversine } from '@/lib/distance'

describe('haversine', () => {
  it('returns 0 for the same point', () => {
    expect(haversine([0, 0], [0, 0])).toBe(0)
  })

  it('returns approximate distance in miles between Houston and San Antonio', () => {
    // Houston center: 29.7604, -95.3698
    // San Antonio center: 29.4241, -98.4936
    // Real distance: ~188 miles
    const dist = haversine([29.7604, -95.3698], [29.4241, -98.4936])
    expect(dist).toBeGreaterThan(180)
    expect(dist).toBeLessThan(200)
  })

  it('returns a positive number for distinct points', () => {
    const dist = haversine([29.7361, -95.4677], [29.4243, -98.4934])
    expect(dist).toBeGreaterThan(0)
  })
})
