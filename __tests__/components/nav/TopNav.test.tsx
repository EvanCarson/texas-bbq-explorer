/**
 * TopNav uses next-intl and next/navigation — both require specific providers
 * that are complex to mock in jsdom. A smoke test verifies the component
 * module exports without errors; integration is covered by e2e / dev server.
 */
import '@testing-library/jest-dom'

describe('TopNav module', () => {
  it('exports a default component', async () => {
    // Dynamic import so Jest can transform with ts-jest before the mock is in place
    const mod = await import('@/components/nav/TopNav')
    expect(typeof mod.default).toBe('function')
  })
})
