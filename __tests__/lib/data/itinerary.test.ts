import { getDays, getStays, getStayForDate, getCities, getActivities, getTransports } from '@/lib/data/itinerary'

describe('getDays — houston', () => {
  it('returns 8 days', () => {
    expect(getDays('houston')).toHaveLength(8)
  })

  it('each day has required fields', () => {
    getDays('houston').forEach(d => {
      expect(d.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(d.city).toBeTruthy()
      expect(d.title).toBeTruthy()
      expect(Array.isArray(d.activities)).toBe(true)
    })
  })
})

describe('getDays — miami', () => {
  it('returns days for miami trip', () => {
    expect(getDays('miami').length).toBeGreaterThan(0)
  })

  it('first day is Dec 15 2026', () => {
    expect(getDays('miami')[0].date).toBe('2026-12-15')
  })
})

describe('getStays — houston', () => {
  it('returns 5 stays', () => {
    expect(getStays('houston')).toHaveLength(5)
  })

  it('each stay has required fields', () => {
    getStays('houston').forEach(s => {
      expect(s.name).toBeTruthy()
      expect(s.type).toMatch(/^(hotel|home|camp|rental)$/)
      expect(s.city).toBeTruthy()
      expect(s.coordinates).toHaveLength(2)
      expect(s.checkIn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(s.checkOut).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})

describe('getStays — miami', () => {
  it('returns stays for miami trip', () => {
    expect(getStays('miami').length).toBeGreaterThan(0)
  })
})

describe('getStayForDate', () => {
  it('returns correct stay for a houston date within the trip', () => {
    const stay = getStayForDate('houston', '2026-03-29')
    expect(stay.city).toBe('Houston')
  })

  it('returns first stay for a date before the trip', () => {
    const first = getStays('houston')[0]
    expect(getStayForDate('houston', '2020-01-01')).toEqual(first)
  })

  it('returns first stay for a date after the trip', () => {
    const first = getStays('houston')[0]
    expect(getStayForDate('houston', '2099-12-31')).toEqual(first)
  })
})

describe('getCities', () => {
  it('returns unique city names from houston stays', () => {
    const cities = getCities('houston')
    expect(cities.length).toBeGreaterThan(0)
    expect(new Set(cities).size).toBe(cities.length)
  })

  it('includes Houston and San Antonio', () => {
    const cities = getCities('houston')
    expect(cities).toContain('Houston')
    expect(cities).toContain('San Antonio')
  })

  it('returns unique cities for miami', () => {
    const cities = getCities('miami')
    expect(cities.length).toBeGreaterThan(0)
    expect(new Set(cities).size).toBe(cities.length)
  })
})

describe('getActivities', () => {
  it('returns 7 activities for houston', () => {
    expect(getActivities('houston')).toHaveLength(7)
  })

  it('each activity has required fields', () => {
    getActivities('houston').forEach(a => {
      expect(a.name).toBeTruthy()
      expect(a.city).toBeTruthy()
      expect(a.status).toMatch(/^(booked|walk-in|optional)$/)
    })
  })
})

describe('getTransports', () => {
  it('returns transports for houston', () => {
    expect(getTransports('houston').length).toBeGreaterThan(0)
  })

  it('returns transports for miami', () => {
    expect(getTransports('miami').length).toBeGreaterThan(0)
  })

  it('each transport has required fields', () => {
    getTransports('houston').forEach(t => {
      expect(t.icon).toBeTruthy()
      expect(t.label).toBeTruthy()
      expect(t.route).toBeTruthy()
    })
  })
})
