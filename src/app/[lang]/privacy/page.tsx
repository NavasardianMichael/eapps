import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { DEFAULT_LOCALE } from '@i18n/config'
import { pageMetadata } from '@i18n/metadata'
import { AUTHOR, CONTACT_EMAIL, PRIVACY_UPDATED_AT } from '@constants/app'
import { ROUTES } from '@constants/routes'

/**
 * The one privacy policy for eapps.site and every app on its subdomains: the AdSense account
 * and the apps' consent screens link to `/en/privacy`. English only, so the copy is written
 * here rather than in the catalogues; `next.config.ts` redirects `/ru/privacy` and `/hy/privacy`.
 */
export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    path: ROUTES.privacy,
    title: 'Privacy policy',
    description:
      'How eapps.site and the apps on its subdomains handle your data: what stays on your device, what we receive, Google ads and cookies, and your choices.',
    locales: [DEFAULT_LOCALE],
  })
}

const GOOGLE_ADS_SETTINGS_URL = 'https://www.google.com/settings/ads'
const ABOUT_ADS_CHOICES_URL = 'https://www.aboutads.info/choices'
const GOOGLE_PARTNER_SITES_URL = 'https://policies.google.com/technologies/partner-sites'

const linkClass = 'font-semibold text-brand-700 underline underline-offset-4'

const External = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target='_blank' rel='noopener noreferrer' className={linkClass}>
    {children}
  </a>
)

const Part = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className='flex flex-col gap-3'>
    <h2 className='text-h3 font-bold text-ink-900'>{title}</h2>
    {children}
  </section>
)

export default function PrivacyPage() {
  const updated = PRIVACY_UPDATED_AT.toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' })
  const email = (
    <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
      {CONTACT_EMAIL}
    </a>
  )

  return (
    <article className='container-page flex max-w-3xl flex-col gap-10 py-12 text-ink-700 sm:py-16'>
      <header className='flex flex-col gap-3'>
        <h1 className='text-h1 font-extrabold text-ink-900'>Privacy policy</h1>
        <p className='text-body-sm text-ink-500'>
          Last updated <time dateTime={PRIVACY_UPDATED_AT.toISOString().slice(0, 10)}>{updated}</time>
        </p>
        <p>
          This policy covers eapps.site and every app published on its subdomains, such as crossword.eapps.site. In
          short: you can use the apps without an account, your progress stays on your device, and the apps may show
          ads from Google.
        </p>
      </header>

      <Part title='Who we are'>
        <p>
          eapps is built and run by {AUTHOR.name}, an independent developer (“we”). This policy applies to eapps.site
          and to every app on a *.eapps.site subdomain that links to it. Where an app’s own privacy page describes
          something in more detail, that page applies to that app.
        </p>
      </Part>

      <Part title='What stays on your device'>
        <p>
          The apps save your settings, language, progress and scores in your browser (local storage and cookies), so
          they are there on your next visit. This data stays on your device; clearing the site’s data in your browser
          removes it.
        </p>
      </Part>

      <Part title='What we receive'>
        <ul className='flex list-disc flex-col gap-2 ps-5'>
          <li>
            <strong className='text-ink-900'>Server logs.</strong> Like any website, our servers see your IP address,
            browser type and the pages you request. We keep these logs only as long as needed to keep the apps secure
            and working.
          </li>
          <li>
            <strong className='text-ink-900'>Accounts.</strong> Signing in is optional and offered only by some apps,
            to keep your progress across devices or show your name on a leaderboard. If you sign in, we store your email
            address, display name, profile picture and results, and use your email only for messages about your
            account.
          </li>
          <li>
            <strong className='text-ink-900'>AI features.</strong> Some apps create content with AI. The choices you
            make, such as the language, topic and difficulty, are sent to an AI provider (Google Gemini) to do that.
            Nothing that identifies you is sent.
          </li>
          <li>
            <strong className='text-ink-900'>Analytics and error reports.</strong> Some apps use Google Analytics to
            count visits and Sentry to receive error reports, so we can see what is used and fix bugs. We do not use
            them to identify you.
          </li>
        </ul>
      </Part>

      <Part title='Advertising'>
        <p>
          The apps may show ads from Google AdSense. Third-party vendors, including Google, use cookies to serve ads
          based on your prior visits to this website or other websites. Google’s use of advertising cookies enables it
          and its partners to serve ads to you based on your visits to our sites and/or other sites on the Internet.
        </p>
        <p>
          You can opt out of personalized advertising in <External href={GOOGLE_ADS_SETTINGS_URL}>Ads Settings</External>
          , and out of other vendors’ cookies at <External href={ABOUT_ADS_CHOICES_URL}>www.aboutads.info</External>.
          Read more about{' '}
          <External href={GOOGLE_PARTNER_SITES_URL}>how Google uses information from sites that use its services</External>
          .
        </p>
      </Part>

      <Part title='Your consent'>
        <p>
          If you are in the European Economic Area, the United Kingdom or Switzerland, a Google-certified consent tool
          asks for your consent before cookies are used for ads. You can change your choice at any time from the app’s
          privacy and cookie settings link, or by clearing the site’s data. Elsewhere, you can turn personalized ads off
          with the settings above.
        </p>
      </Part>

      <Part title='Sharing'>
        <p>
          We never sell your personal information. We share it only with the services that run the apps (hosting;
          Google for ads, analytics, AI and sign-in; Sentry for error reports) or when the law requires it.
        </p>
      </Part>

      <Part title='Children'>
        <p>
          The apps are made for a general audience and are not directed at children under 13. We do not knowingly
          collect personal information from children; if you believe a child has given us some, write to us and we
          will delete it.
        </p>
      </Part>

      <Part title='Your rights'>
        <p>
          Depending on where you live, you may have the right to access, correct or delete your personal information,
          to object to how it is used, or to withdraw your consent. To use any of these rights, or to delete an
          account, email {email}. We reply within 30 days.
        </p>
      </Part>

      <Part title='Changes and contact'>
        <p>
          We may update this policy as the apps change; the date at the top shows the current version. Questions about
          privacy are welcome at {email}.
        </p>
      </Part>
    </article>
  )
}
