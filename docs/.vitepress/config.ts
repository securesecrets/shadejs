import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ShadeJS",
  description: "A ShadeJS Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/swap' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'What is ShadeJS?', link: 'what-is-shadejs' },
          { text: 'Getting Started', link: 'getting-started' },
        ]
      },
      {
        text: 'Examples',
        collapsed: false,
        items: [
          { text: 'Swap', link: '/swap' },
          { text: 'Oracle', link: '/oracle' },
          { text: 'Batch Query', link: '/batch-query' },
          { text: 'Snip20', link: '/snip20' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/securesecrets/shadejs' },
      { icon: 'discord', link: 'https://discord.com/channels/905665558610051113/905670616391233566' }
    ]
  }
})
