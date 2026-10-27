import { ImageResponse } from 'next/og'
import { OG_IMAGE_SIZE, SITE_NAME } from '@constants/app'
import { CATALOG } from '@constants/catalog'
import { emblemDataUri } from '@helpers/brand'
import { BRAND, CORAL, INK, PAPER, SKY, SUN, TEAL, VIOLET, WHITE } from '@styles/tokens'

/**
 * The link preview every page carries (`pageMetadata` points at it). Latin text only —
 * satori's bundled font has no Armenian — so the copy is English; the `alt` text is
 * translated per page. App names are the catalogue's, in English.
 */
export const alt = `${SITE_NAME} — free web apps and games`
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'

const APP_NAMES: Record<(typeof CATALOG)[number]['id'], string> = {
  crossword: 'Crossword AI',
  millionaire: 'Millionaire AI',
  hangman: 'Armenian Hangman',
}

const ACCENT_FILLS = { coral: CORAL[200], violet: VIOLET[200], sun: SUN[200], teal: TEAL[200], sky: SKY[200] }

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 40,
        padding: '0 88px',
        background: `radial-gradient(circle at 15% 10%, ${BRAND[100]}, ${PAPER[100]} 60%)`,
        color: INK[900],
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <img src={emblemDataUri()} width={120} height={120} alt='' />
        <div style={{ display: 'flex', fontSize: 120, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>
          {SITE_NAME}
        </div>
      </div>
      <div style={{ display: 'flex', fontSize: 50, lineHeight: 1.2, color: INK[700], maxWidth: 960 }}>
        Free web apps and games that speak your language.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        {CATALOG.map(({ id, accent }) => (
          <div
            key={id}
            style={{
              display: 'flex',
              padding: '10px 24px',
              fontSize: 30,
              fontWeight: 700,
              borderRadius: 999,
              background: ACCENT_FILLS[accent],
              border: `2px solid ${WHITE}`,
            }}
          >
            {APP_NAMES[id]}
          </div>
        ))}
      </div>
    </div>,
    size
  )
}
