import type { ReactNode } from 'react'
import { cn } from '@helpers/cn'

export type SectionProps = {
  id: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'start' | 'center'
  className?: string
  children?: ReactNode
}

/** A titled block of the page, on the shared container width. Its h2 names the region for assistive tech. */
export const Section = ({ id, title, subtitle, align = 'start', className, children }: SectionProps) => (
  <section id={id} aria-labelledby={`${id}-title`} className={cn('container-page py-14 sm:py-20', className)}>
    <header className={cn('mb-8 flex flex-col gap-3 sm:mb-10', align === 'center' && 'items-center text-center')}>
      <h2 id={`${id}-title`} className='text-h2 font-extrabold text-ink-900'>
        {title}
      </h2>
      {subtitle && <p className={cn('max-w-2xl text-ink-700', align === 'center' && 'mx-auto')}>{subtitle}</p>}
    </header>
    {children}
  </section>
)
