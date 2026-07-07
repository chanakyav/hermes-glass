import { EventSourceType, OsEventTypeList, type EvenHubEvent } from '@evenrealities/even_hub_sdk'
import type { DomainEvent, InputGesture, InputSource } from './types.ts'

function mapEventSource(raw: EventSourceType | undefined): InputSource {
  switch (raw) {
    case EventSourceType.TOUCH_EVENT_FROM_GLASSES_L:
      return 'g2_left'
    case EventSourceType.TOUCH_EVENT_FROM_GLASSES_R:
      return 'g2_right'
    case EventSourceType.TOUCH_EVENT_FROM_RING:
      return 'r1'
    default:
      return 'unknown'
  }
}

function mapOsEventType(raw: OsEventTypeList | undefined): InputGesture | null {
  const type = raw ?? OsEventTypeList.CLICK_EVENT
  switch (type) {
    case OsEventTypeList.CLICK_EVENT:
      return 'click'
    case OsEventTypeList.DOUBLE_CLICK_EVENT:
      return 'double_click'
    case OsEventTypeList.SCROLL_TOP_EVENT:
      return 'scroll_up'
    case OsEventTypeList.SCROLL_BOTTOM_EVENT:
      return 'scroll_down'
    case OsEventTypeList.FOREGROUND_ENTER_EVENT:
      return 'foreground_enter'
    case OsEventTypeList.FOREGROUND_EXIT_EVENT:
      return 'foreground_exit'
    case OsEventTypeList.SYSTEM_EXIT_EVENT:
      return 'system_exit'
    case OsEventTypeList.ABNORMAL_EXIT_EVENT:
      return 'abnormal_exit'
    default:
      return null
  }
}

const LIFECYCLE_GESTURES = new Set<InputGesture>([
  'foreground_enter',
  'foreground_exit',
  'system_exit',
  'abnormal_exit',
])

export function isLifecycleGesture(gesture: InputGesture): boolean {
  return LIFECYCLE_GESTURES.has(gesture)
}

export function isR1Source(source: InputSource): boolean {
  return source === 'r1'
}

export function isG2Source(source: InputSource): boolean {
  return source === 'g2_left' || source === 'g2_right'
}

export function mapEvenHubEvent(event: EvenHubEvent, at: number): DomainEvent[] {
  const mapped: DomainEvent[] = []

  const source = mapEventSource(event.sysEvent?.eventSource)

  if (event.sysEvent) {
    const gesture = mapOsEventType(event.sysEvent.eventType)
    if (gesture) {
      if (isLifecycleGesture(gesture)) {
        mapped.push({ kind: 'lifecycle', gesture, at })
      } else {
        mapped.push({ kind: 'input', gesture, source, at })
      }
    }
  }

  if (event.textEvent) {
    const gesture = mapOsEventType(event.textEvent.eventType)
    if (gesture) {
      if (gesture === 'double_click') {
        mapped.push({ kind: 'input', gesture, source, at })
      } else if (gesture === 'scroll_up' || gesture === 'scroll_down') {
        mapped.push({ kind: 'input', gesture, source: 'unknown', at })
      }
    }
  }

  return mapped
}

export function formatGestureLabel(gesture: InputGesture): string {
  switch (gesture) {
    case 'click':
      return 'tap'
    case 'double_click':
      return 'double-tap'
    case 'scroll_up':
      return 'scroll up'
    case 'scroll_down':
      return 'scroll down'
    case 'foreground_enter':
      return 'foreground enter'
    case 'foreground_exit':
      return 'foreground exit'
    case 'system_exit':
      return 'system exit'
    case 'abnormal_exit':
      return 'abnormal exit'
  }
}

export function formatSourceLabel(source: InputSource): string {
  switch (source) {
    case 'g2_left':
      return 'G2 left'
    case 'g2_right':
      return 'G2 right'
    case 'r1':
      return 'R1'
    case 'unknown':
      return 'unknown'
  }
}
