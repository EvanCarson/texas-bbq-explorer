import { getPlaces, getPlaceById } from '@/lib/data/places'

describe('getPlaces — houston', () => {
  it('returns all 32 places when no filter', () => {
    expect(getPlaces('houston')).toHaveLength(32)
  })

  it('filters by city', () => {
    const houston = getPlaces('houston', { city: 'Houston' })
    expect(houston.length).toBeGreaterThan(0)
    houston.forEach(p => expect(p.city).toBe('Houston'))
  })

  it('filters by type', () => {
    const restaurants = getPlaces('houston', { type: 'restaurant' })
    expect(restaurants.length).toBe(20)
    restaurants.forEach(p => expect(p.type).toBe('restaurant'))
  })

  it('filters by tag', () => {
    const txMonthly = getPlaces('houston', { tag: 'tx-monthly' })
    expect(txMonthly.length).toBeGreaterThan(0)
    txMonthly.forEach(p => expect(p.tags).toContain('tx-monthly'))
  })

  it('each place has required fields', () => {
    getPlaces('houston').forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.type).toMatch(/^(restaurant|activity|attraction|hotel)$/)
      expect(p.city).toBeTruthy()
      expect(p.coordinates).toHaveLength(2)
      expect(p.description).toBeTruthy()
      expect(Array.isArray(p.tags)).toBe(true)
    })
  })
})

describe('getPlaces — miami', () => {
  it('returns places for miami', () => {
    expect(getPlaces('miami').length).toBeGreaterThan(0)
  })

  it('each miami place has required fields', () => {
    getPlaces('miami').forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.coordinates).toHaveLength(2)
    })
  })
})

describe('getPlaceById', () => {
  it('returns the place with matching id for houston', () => {
    const all = getPlaces('houston')
    const first = all[0]
    expect(getPlaceById('houston', first.id)).toEqual(first)
  })

  it('returns undefined for unknown id', () => {
    expect(getPlaceById('houston', 'does-not-exist')).toBeUndefined()
  })
})
