import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'
import ChatWidget from '../components/ChatWidget'
import { SUPPORT } from '../lib/support.config'

export default function App({ Component, pageProps }: AppProps) {
  return       <><Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI Fitness Planner" />
        <meta property="og:description" content="Generate personalized workout and nutrition guidance based on your goals, experience, and available time." />
        <meta property="og:url" content="https://ai-fitness-planner.lxsaihub.com/" />
        <meta property="og:image" content="https://ai-fitness-planner.lxsaihub.com/og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Fitness Planner" />
        <meta name="twitter:description" content="Generate personalized workout and nutrition guidance based on your goals, experience, and available time." />
        <meta name="twitter:image" content="https://ai-fitness-planner.lxsaihub.com/og.png" />
                                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: '{"@context":"https://schema.org","@type":"SoftwareApplication","name":"AI Fitness Planner","url":"https://ai-fitness-planner.lxsaihub.com/","description":"Generate personalized workout and nutrition guidance based on your goals, experience, and available time.","applicationCategory":"BusinessApplication","operatingSystem":"Web"}' }} />
      </Head>
      <Component {...pageProps} />
      <ChatWidget productName={SUPPORT.productName} brandColor={SUPPORT.brandColor} sessionKeyPrefix={SUPPORT.productSlug} /></>
}
