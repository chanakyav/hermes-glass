import type { AppState } from '../even/types.ts'
import { formatGestureLabel, formatSourceLabel } from '../even/events.ts'

function formatEvent(event: AppState['lastG2Event']): string {
  if (!event) {
    return '—'
  }
  if (event.kind === 'input') {
    return `${formatGestureLabel(event.gesture)} (${formatSourceLabel(event.source)})`
  }
  if (event.kind === 'lifecycle') {
    return formatGestureLabel(event.gesture)
  }
  return '—'
}

function formatTimestamp(at: number | null): string {
  if (at === null) {
    return '—'
  }
  return new Date(at).toLocaleTimeString()
}

export function renderDebugPanel(root: HTMLElement, state: AppState): void {
  root.innerHTML = `
    <section>
      <h1>Hermes Glass — Dev</h1>
      <p>Companion UI for development. G2 display mirrors the starter message.</p>
    </section>
    <section>
      <h2>SDK</h2>
      <dl>
        <dt>Initialization</dt><dd>${state.sdkInit}</dd>
        <dt>Page create</dt><dd>${state.pageCreate}</dd>
        <dt>Connection</dt><dd>${state.connectType ?? '—'}</dd>
        <dt>Launch source</dt><dd>${state.launchSource ?? '—'}</dd>
      </dl>
    </section>
    <section>
      <h2>Events</h2>
      <dl>
        <dt>Last G2</dt><dd>${formatEvent(state.lastG2Event)}</dd>
        <dt>Last R1</dt><dd>${formatEvent(state.lastR1Event)}</dd>
        <dt>Last lifecycle</dt><dd>${formatEvent(state.lastLifecycleEvent)}</dd>
        <dt>Event count</dt><dd>${state.eventCount}</dd>
        <dt>Latest at</dt><dd>${formatTimestamp(state.lastEventAt)}</dd>
      </dl>
    </section>
    <section>
      <h2>Display</h2>
      <p><code>${escapeHtml(state.displayLine)}</code></p>
    </section>
    <section>
      <h2>Error</h2>
      <p>${state.lastError ? escapeHtml(state.lastError) : '—'}</p>
    </section>
  `
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
