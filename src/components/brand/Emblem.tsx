import { emblemSvg } from '@helpers/brand'
import { cn } from '@helpers/cn'

/** The emblem inline, so the header mark costs no request. Decorative: the wordmark beside it names the site. */
export const Emblem = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn('inline-block [&>svg]:size-full', className)}
    dangerouslySetInnerHTML={{ __html: emblemSvg() }}
  />
)
