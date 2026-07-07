import { OsEventTypeList } from '@evenrealities/even_hub_sdk'

export function shouldDisposeOnLifecycle(eventType: OsEventTypeList | null): boolean {
  return (
    eventType === OsEventTypeList.SYSTEM_EXIT_EVENT ||
    eventType === OsEventTypeList.ABNORMAL_EXIT_EVENT
  )
}

export function isDoubleClick(
  sysType: OsEventTypeList | null | undefined,
  textType: OsEventTypeList | null | undefined,
): boolean {
  return (
    sysType === OsEventTypeList.DOUBLE_CLICK_EVENT ||
    textType === OsEventTypeList.DOUBLE_CLICK_EVENT
  )
}
