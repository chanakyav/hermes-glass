import { OsEventTypeList } from '@evenrealities/even_hub_sdk'
import { isDoubleClick, shouldDisposeOnLifecycle } from '../src/even/lifecycle.ts'
import { describe, expect, it } from 'vitest'

describe('lifecycle helpers', () => {
  it('detects double-click from sys or text envelope', () => {
    expect(isDoubleClick(OsEventTypeList.DOUBLE_CLICK_EVENT, null)).toBe(true)
    expect(isDoubleClick(null, OsEventTypeList.DOUBLE_CLICK_EVENT)).toBe(true)
    expect(isDoubleClick(OsEventTypeList.CLICK_EVENT, null)).toBe(false)
  })

  it('detects lifecycle exit events', () => {
    expect(shouldDisposeOnLifecycle(OsEventTypeList.SYSTEM_EXIT_EVENT)).toBe(true)
    expect(shouldDisposeOnLifecycle(OsEventTypeList.ABNORMAL_EXIT_EVENT)).toBe(true)
    expect(shouldDisposeOnLifecycle(OsEventTypeList.CLICK_EVENT)).toBe(false)
  })
})
