import { EventSourceType, OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk'
import { mapEvenHubEvent, isLifecycleGesture } from '../src/even/events.ts'
import { reduceAppState, buildGlassesContent } from '../src/app/state.ts'
import { INITIAL_APP_STATE } from '../src/even/types.ts'
import { describe, expect, it } from 'vitest'

function hubEvent(partial: EvenHubEvent): EvenHubEvent {
  return partial
}

describe('mapEvenHubEvent', () => {
  it('maps G2 right tap from sysEvent', () => {
    const event = hubEvent({
      sysEvent: {
        eventType: OsEventTypeList.CLICK_EVENT,
        eventSource: EventSourceType.TOUCH_EVENT_FROM_GLASSES_R,
      } as EvenHubEvent['sysEvent'],
    })
    const mapped = mapEvenHubEvent(event, 1000)
    expect(mapped).toHaveLength(1)
    expect(mapped[0]).toMatchObject({
      kind: 'input',
      gesture: 'click',
      source: 'g2_right',
      at: 1000,
    })
  })

  it('maps R1 tap from sysEvent', () => {
    const event = hubEvent({
      sysEvent: {
        eventType: OsEventTypeList.CLICK_EVENT,
        eventSource: EventSourceType.TOUCH_EVENT_FROM_RING,
      } as EvenHubEvent['sysEvent'],
    })
    const mapped = mapEvenHubEvent(event, 2000)
    expect(mapped[0]).toMatchObject({
      kind: 'input',
      gesture: 'click',
      source: 'r1',
    })
  })

  it('maps scroll from textEvent', () => {
    const event = hubEvent({
      textEvent: {
        eventType: OsEventTypeList.SCROLL_BOTTOM_EVENT,
      } as EvenHubEvent['textEvent'],
    })
    const mapped = mapEvenHubEvent(event, 3000)
    expect(mapped[0]).toMatchObject({
      kind: 'input',
      gesture: 'scroll_down',
      source: 'unknown',
    })
  })

  it('treats omitted click event type as click', () => {
    const event = hubEvent({
      sysEvent: {
        eventSource: EventSourceType.TOUCH_EVENT_FROM_GLASSES_L,
      } as EvenHubEvent['sysEvent'],
    })
    const mapped = mapEvenHubEvent(event, 4000)
    expect(mapped[0]).toMatchObject({
      kind: 'input',
      gesture: 'click',
      source: 'g2_left',
    })
  })

  it('maps lifecycle events', () => {
    const event = hubEvent({
      sysEvent: {
        eventType: OsEventTypeList.FOREGROUND_ENTER_EVENT,
      } as EvenHubEvent['sysEvent'],
    })
    const mapped = mapEvenHubEvent(event, 5000)
    expect(mapped[0]).toMatchObject({
      kind: 'lifecycle',
      gesture: 'foreground_enter',
    })
    expect(isLifecycleGesture('foreground_enter')).toBe(true)
  })
})

describe('reduceAppState', () => {
  it('updates G2 and R1 last-event fields separately', () => {
    const g2 = reduceAppState(INITIAL_APP_STATE, {
      kind: 'input',
      gesture: 'click',
      source: 'g2_right',
      at: 1,
    })
    expect(g2.lastG2Event?.kind).toBe('input')
    expect(g2.lastR1Event).toBeNull()

    const r1 = reduceAppState(g2, {
      kind: 'input',
      gesture: 'click',
      source: 'r1',
      at: 2,
    })
    expect(r1.lastR1Event?.kind).toBe('input')
    if (r1.lastR1Event?.kind === 'input') {
      expect(r1.lastR1Event.source).toBe('r1')
    }
    expect(r1.eventCount).toBe(2)
  })

  it('records errors and lifecycle events', () => {
    const withError = reduceAppState(INITIAL_APP_STATE, {
      kind: 'error',
      message: 'boom',
      at: 10,
    })
    expect(withError.lastError).toBe('boom')

    const withLifecycle = reduceAppState(withError, {
      kind: 'lifecycle',
      gesture: 'system_exit',
      at: 11,
    })
    expect(withLifecycle.lastLifecycleEvent?.kind).toBe('lifecycle')
    if (withLifecycle.lastLifecycleEvent?.kind === 'lifecycle') {
      expect(withLifecycle.lastLifecycleEvent.gesture).toBe('system_exit')
    }
  })
})

describe('buildGlassesContent', () => {
  it('includes display line and event count', () => {
    const state = reduceAppState(INITIAL_APP_STATE, {
      kind: 'input',
      gesture: 'scroll_up',
      source: 'r1',
      at: 1,
    })
    const content = buildGlassesContent(state)
    expect(content).toContain('Hermes Glass starter')
    expect(content).toContain('scroll up')
    expect(content).toContain('Events: 1')
    expect(content).toContain('Double-tap to exit.')
  })
})
