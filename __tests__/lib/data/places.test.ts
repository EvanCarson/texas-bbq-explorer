import { getPlaces, getPlaceById } from '@/lib/data/places'

describe('getPlaces', () => {
  it('returns all 32 places when no filter', () => {
    expect(getPlaces()).toHaveLength(32)
  })

  it('filters by city', () => {
    const houston = getPlaces({ city: 'Houston' })
    expect(houston.length).toBeGreaterThan(0)
    houston.forEach(p => expect(p.city).toBe('Houston'))
  })

  it('filters by type', () => {
    const restaurants = getPlaces({ type: 'restaurant' })
    expect(restaurants.length).toBe(20)
    restaurants.forEach(p => expect(p.type).toBe('restaurant'))
  })

  it('filters by tag', () => {
    const txMonthly = getPlaces({ tag: 'tx-monthly' })
    expect(txMonthly.length).toBeGreaterThan(0)
    txMonthly.forEach(p => expect(p.tags).toContain('tx-monthly'))
  })

  it('each place has required fields', () => {
    getPlaces().forEach(p => {
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

describe('getPlaceById', () => {
  it('returns the place with matching id', () => {
    const all = getPlaces()
    const first = all[0]
    expect(getPlaceById(first.id)).toEqual(first)
  })

  it('returns undefined for unknown id', () => {
    expect(getPlaceById('does-not-exist')).toBeUndefined()
  })
})
