import { ImageResponse } from 'next/og'
import { emblemDataUri } from '@helpers/brand'

/** Rendered, not committed: one 512px source covers the favicon and the manifest. */
export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(<img src={emblemDataUri({ background: true })} width={512} height={512} alt='' />, size)
}
