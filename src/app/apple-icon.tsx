import { ImageResponse } from 'next/og'
import { emblemDataUri } from '@helpers/brand'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(<img src={emblemDataUri({ background: true })} width={180} height={180} alt='' />, size)
}
