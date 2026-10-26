import { SITE_NAME } from '@constants/app'
import { ROUTES } from '@constants/routes'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/AppLink'
import { Emblem } from './Emblem'

export const Logo = ({ className }: { className?: string }) => (
  <AppLink href={ROUTES.home} className={cn('flex items-center gap-2.5 rounded-tile', className)}>
    <Emblem className='size-9' />
    <span className='text-h3 font-extrabold tracking-tight text-ink-900'>{SITE_NAME}</span>
  </AppLink>
)
