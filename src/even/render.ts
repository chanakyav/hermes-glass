import {
  CreateStartUpPageContainer,
  RebuildPageContainer,
  StartUpPageCreateResult,
  TextContainerProperty,
  type EvenAppBridge,
} from '@evenrealities/even_hub_sdk'

export const MAIN_CONTAINER_ID = 1
export const MAIN_CONTAINER_NAME = 'main'
export const DISPLAY_WIDTH = 576
export const DISPLAY_HEIGHT = 288

function buildMainText(content: string): TextContainerProperty {
  return new TextContainerProperty({
    xPosition: 0,
    yPosition: 0,
    width: DISPLAY_WIDTH,
    height: DISPLAY_HEIGHT,
    borderWidth: 0,
    borderColor: 0,
    paddingLength: 4,
    containerID: MAIN_CONTAINER_ID,
    containerName: MAIN_CONTAINER_NAME,
    content,
    isEventCapture: 1,
  })
}

export async function createStartupPage(
  bridge: EvenAppBridge,
  content: string,
): Promise<StartUpPageCreateResult> {
  return bridge.createStartUpPageContainer(
    new CreateStartUpPageContainer({
      containerTotalNum: 1,
      textObject: [buildMainText(content)],
    }),
  )
}

export async function rebuildMainText(bridge: EvenAppBridge, content: string): Promise<boolean> {
  return bridge.rebuildPageContainer(
    new RebuildPageContainer({
      containerTotalNum: 1,
      textObject: [buildMainText(content)],
    }),
  )
}

export function isPageCreateSuccess(result: StartUpPageCreateResult): boolean {
  return result === StartUpPageCreateResult.success
}

export async function shutdownApp(bridge: EvenAppBridge): Promise<boolean> {
  return bridge.shutDownPageContainer(1)
}
