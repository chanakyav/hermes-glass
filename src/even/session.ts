import {
  StartUpPageCreateResult,
  waitForEvenAppBridge,
  type EvenAppBridge,
} from '@evenrealities/even_hub_sdk'
import { reduceAppState, buildGlassesContent } from '../app/state.ts'
import { mapEvenHubEvent } from './events.ts'
import { isDoubleClick, shouldDisposeOnLifecycle } from './lifecycle.ts'
import { createStartupPage, isPageCreateSuccess, rebuildMainText, shutdownApp } from './render.ts'
import type { AppState, DomainEvent, SdkInitState } from './types.ts'
import { INITIAL_APP_STATE } from './types.ts'

export type EvenSessionCallbacks = {
  onStateChange: (state: AppState) => void
}

export type EvenSession = {
  dispose: () => void
}

export async function startEvenSession(callbacks: EvenSessionCallbacks): Promise<EvenSession> {
  let state: AppState = { ...INITIAL_APP_STATE }
  let bridge: EvenAppBridge | null = null
  const unsubscribers: Array<() => void> = []

  const dispose = () => {
    for (const unsubscribe of unsubscribers) {
      unsubscribe()
    }
    unsubscribers.length = 0
  }

  const emit = (patch: Partial<AppState>) => {
    state = { ...state, ...patch }
    callbacks.onStateChange(state)
  }

  const applyDomainEvent = async (event: DomainEvent) => {
    state = reduceAppState(state, event)
    callbacks.onStateChange(state)

    if (event.kind === 'input' && bridge && state.pageCreate === 'success') {
      const ok = await rebuildMainText(bridge, buildGlassesContent(state))
      if (!ok) {
        state = reduceAppState(state, {
          kind: 'error',
          message: 'Failed to rebuild glasses display',
          at: Date.now(),
        })
        callbacks.onStateChange(state)
      }
    }
  }

  const recordError = (message: string) => {
    void applyDomainEvent({ kind: 'error', message, at: Date.now() })
  }

  try {
    bridge = await waitForEvenAppBridge()
    emit({ sdkInit: 'ready' satisfies SdkInitState })

    const result = await createStartupPage(bridge, buildGlassesContent(state))
    emit({
      pageCreate: isPageCreateSuccess(result) ? 'success' : 'failed',
    })

    if (!isPageCreateSuccess(result)) {
      recordError(`Page create failed (${StartUpPageCreateResult[result] ?? result})`)
    }

    unsubscribers.push(
      bridge.onEvenHubEvent((event) => {
        const sysType = event.sysEvent?.eventType ?? null
        const textType = event.textEvent?.eventType ?? null

        if (isDoubleClick(sysType, textType)) {
          void shutdownApp(bridge!)
          return
        }

        const domainEvents = mapEvenHubEvent(event, Date.now())
        for (const domainEvent of domainEvents) {
          void applyDomainEvent(domainEvent)
        }

        if (shouldDisposeOnLifecycle(sysType)) {
          dispose()
        }
      }),
    )

    unsubscribers.push(
      bridge.onDeviceStatusChanged((status) => {
        void applyDomainEvent({
          kind: 'device',
          connectType: status.connectType,
          batteryLevel: status.batteryLevel,
          isWearing: status.isWearing,
          at: Date.now(),
        })
      }),
    )

    unsubscribers.push(
      bridge.onLaunchSource((source) => {
        void applyDomainEvent({ kind: 'launch', source, at: Date.now() })
      }),
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    emit({ sdkInit: 'error' })
    recordError(message)
  }

  return { dispose }
}
