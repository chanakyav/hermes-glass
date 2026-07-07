# Capabilities matrix

Only capabilities verified from official docs and/or installed SDK types (`@evenrealities/even_hub_sdk`). "Implemented" refers to Phase A starter.

| Capability               | SDK supported | Device | Implemented | Official source                                           | Notes                                          |
| ------------------------ | ------------- | ------ | ----------- | --------------------------------------------------------- | ---------------------------------------------- |
| Text container render    | Yes           | G2     | Yes         | SDK `TextContainerProperty`, `createStartUpPageContainer` | 576×288, `isEventCapture: 1`                   |
| Rebuild page             | Yes           | G2     | Yes         | SDK `rebuildPageContainer`                                | Updates glasses text on input                  |
| G2 tap (click)           | Yes           | G2     | Yes         | SDK `OsEventTypeList.CLICK_EVENT`, `sysEvent`             | Coalesce `?? 0` for protobuf zero              |
| G2 double-tap            | Yes           | G2     | Yes         | SDK `DOUBLE_CLICK_EVENT`                                  | Exits via `shutDownPageContainer(1)`           |
| G2 scroll up/down        | Yes           | G2     | Yes         | SDK `SCROLL_*_EVENT`, `textEvent`                         |                                                |
| R1 tap/double-tap/scroll | Yes           | R1     | Yes (code)  | SDK `EventSourceType.TOUCH_EVENT_FROM_RING`               | Simulator does not emit R1; verify on hardware |
| Lifecycle events         | Yes           | G2     | Yes         | SDK `FOREGROUND_*`, `SYSTEM_EXIT`, `ABNORMAL_EXIT`        | Cleanup on exit events                         |
| Device connection status | Yes           | G2     | Yes (code)  | SDK `onDeviceStatusChanged`, `DeviceStatus`               | Not emitted by simulator                       |
| Launch source            | Yes           | Phone  | Yes         | SDK `onLaunchSource`                                      | `appMenu` \| `glassesMenu`                     |
| List container           | Yes           | G2     | No          | SDK `ListContainerProperty`                               | See `text-heavy` / `image` templates           |
| Image container          | Yes           | G2     | No          | SDK `ImageContainerProperty`                              | See `image` template                           |
| Text pagination upgrade  | Yes           | G2     | No          | SDK `textContainerUpgrade`                                | See `text-heavy` template                      |
| Audio / ASR              | Yes           | G2     | No          | SDK `audioControl`, `audioEvent`                          | See `asr` template                             |
| IMU data                 | Yes           | G2     | No          | SDK `imuControl`, `IMU_DATA_REPORT`                       |                                                |
| Phone camera/album       | Yes           | Phone  | No          | SDK `pickImageFromAlbum`, etc.                            |                                                |
| Hermes HTTP              | N/A           | —      | No          | Future `src/hermes/`                                      | Phase B                                        |

## Simulator limitations (verified)

From `@evenrealities/evenhub-simulator` README:

- Inputs: Up, Down, Click, Double Click only
- Status events: not emitted
- `eventSource` hardcoded to `FROM_GLASSES_R`
- `imuData` always null

## Hardware verification status

Phase A code paths for R1 and device status are implemented but require on-device verification with paired G2 + R1.
