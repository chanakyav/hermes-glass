import type { AppState, DomainEvent } from '../even/types.ts'
import { formatGestureLabel, formatSourceLabel, isG2Source, isR1Source } from '../even/events.ts'

export function reduceAppState(state: AppState, event: DomainEvent): AppState {
  const next: AppState = {
    ...state,
    lastEventAt: event.at,
    eventCount: state.eventCount + 1,
  }

  switch (event.kind) {
    case 'error':
      next.lastError = event.message
      return next
    case 'launch':
      next.launchSource = event.source
      return next
    case 'device':
      next.connectType = event.connectType
      return next
    case 'lifecycle':
      next.lastLifecycleEvent = event
      return next
    case 'input':
      if (isR1Source(event.source)) {
        next.lastR1Event = event
      } else if (isG2Source(event.source)) {
        next.lastG2Event = event
      } else {
        next.lastG2Event = event
      }
      next.displayLine = `Last: ${formatGestureLabel(event.gesture)} (${formatSourceLabel(event.source)})`
      return next
  }
}

export function buildGlassesContent(state: AppState): string {
  const lines = [
    'Hermes Glass starter',
    state.displayLine,
    `Events: ${state.eventCount}`,
    'Double-tap to exit.',
  ]
  return lines.join('\n')
}
