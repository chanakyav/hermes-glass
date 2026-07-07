import { INITIAL_APP_STATE } from './even/types.ts'
import { startEvenSession } from './even/session.ts'
import { renderDebugPanel } from './ui/debug-panel.ts'

const root = document.getElementById('app')
if (!root) {
  throw new Error('Missing #app root element')
}

let state = { ...INITIAL_APP_STATE }
renderDebugPanel(root, state)

const session = await startEvenSession({
  onStateChange: (next) => {
    state = next
    renderDebugPanel(root, state)
  },
})

window.addEventListener('beforeunload', () => {
  session.dispose()
})
