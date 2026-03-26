import { getDays, getStays, getStayForDate, getCities, getActivities } from '@/lib/data/itinerary'

describe('getDays', () => {
  it('returns 8 days', () => {
    expect(getDays()).toHaveLength(8)
  })

  it('each day has required fields', () => {
    getDays().forEach(d => {
      expect(d.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(d.city).toBeTruthy()
      expect(d.title).toBeTruthy()
      expect(Array.isArray(d.activities)).toBe(true)
    })
  })
})

describe('getStays', () => {
  it('returns 5 stays', () => {
    expect(getStays()).toHaveLength(5)
  })

  it('each stay has required fields', () => {
    getStays().forEach(s => {
      expect(s.name).toBeTruthy()
      expect(s.type).toMatch(/^(hotel|home|camp|rental)$/)
      expect(s.city).toBeTruthy()
      expect(s.coordinates).toHaveLength(2)
      expect(s.checkIn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(s.checkOut).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})

describe('getStayForDate', () => {
  it('returns correct stay for a date within the trip', () => {
    const stay = getStayForDate('2026-03-29')
    expect(stay.city).toBe('Houston')
  })

  it('returns first stay for a date before the trip', () => {
    const first = getStays()[0]
    expect(getStayForDate('2020-01-01')).toEqual(first)
  })

  it('returns first stay for a date after the trip', () => {
    const first = getStays()[0]
    expect(getStayForDate('2099-12-31')).toEqual(first)
  })
})

describe('getCities', () => {
  it('returns unique city names from stays', () => {
    const cities = getCities()
    expect(cities.length).toBeGreaterThan(0)
    // no duplicates
    expect(new Set(cities).size).toBe(cities.length)
  })

  it('includes Houston and San Antonio', () => {
    const cities = getCities()
    expect(cities).toContain('Houston')
    expect(cities).toContain('San Antonio')
  })
})

describe('getActivities', () => {
  it('returns 7 activities', () => {
    expect(getActivities()).toHaveLength(7)
  })

  it('each activity has required fields', () => {
    getActivities().forEach(a => {
      expect(a.name).toBeTruthy()
      expect(a.city).toBeTruthy()
      expect(a.status).toMatch(/^(booked|walk-in|optional)$/)
    })
  })
})
