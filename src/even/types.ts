import type { DeviceConnectType, LaunchSource } from '@evenrealities/even_hub_sdk'

export type InputSource = 'g2_left' | 'g2_right' | 'r1' | 'unknown'

export type InputGesture =
  | 'click'
  | 'double_click'
  | 'scroll_up'
  | 'scroll_down'
  | 'foreground_enter'
  | 'foreground_exit'
  | 'system_exit'
  | 'abnormal_exit'

export type DomainEvent =
  | { kind: 'input'; gesture: InputGesture; source: InputSource; at: number }
  | { kind: 'lifecycle'; gesture: InputGesture; at: number }
  | { kind: 'launch'; source: LaunchSource; at: number }
  | {
      kind: 'device'
      connectType: DeviceConnectType
      batteryLevel?: number
      isWearing?: boolean
      at: number
    }
  | { kind: 'error'; message: string; at: number }

export type SdkInitState = 'pending' | 'ready' | 'error'

export type PageCreateState = 'pending' | 'success' | 'failed'

export type AppState = {
  sdkInit: SdkInitState
  pageCreate: PageCreateState
  connectType: DeviceConnectType | null
  launchSource: LaunchSource | null
  lastG2Event: DomainEvent | null
  lastR1Event: DomainEvent | null
  lastLifecycleEvent: DomainEvent | null
  lastError: string | null
  lastEventAt: number | null
  displayLine: string
  eventCount: number
}

export const INITIAL_APP_STATE: AppState = {
  sdkInit: 'pending',
  pageCreate: 'pending',
  connectType: null,
  launchSource: null,
  lastG2Event: null,
  lastR1Event: null,
  lastLifecycleEvent: null,
  lastError: null,
  lastEventAt: null,
  displayLine: 'Hermes Glass starter',
  eventCount: 0,
}
