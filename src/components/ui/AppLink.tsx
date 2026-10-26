import type { ComponentProps } from 'react'
import { Link } from '@i18n/navigation'

/** The single internal-anchor primitive: locale-prefixed via `@i18n/navigation`. */
export type AppLinkProps = ComponentProps<typeof Link>

export const AppLink = (props: AppLinkProps) => <Link {...props} />
