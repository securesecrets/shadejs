import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "ShadeJS",
  description: "A ShadeJS Site",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/queries/swap' }
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
        text: 'Queries',
        collapsed: false,
        items: [
          { text: 'Swap', link: '/queries/swap' },
          { text: 'Oracle', link: '/queries/oracle' },
          { text: 'stkd-SCRT', link: '/queries/derivativeScrt' },
          { text: 'Batch Query', link: '/queries/batch-query' },
          { text: 'Snip20', link: '/queries/snip20' },
        ]
      },
      {
        text: 'Transactions',
        collapsed: false,
        items: [
          { text: 'Swap', link: '/transactions/swap' },
        ]
      },
      {
        text: 'ShadeSwap Calculations',
        collapsed: false,
        items: [
          { text: 'Swap', link: '/calculations/swap' },
          { text: 'Routing', link: '/calculations/routing' },
        ]
      },
      {
         text: 'Contract Registry', link: '/contracts' ,
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/securesecrets/shadejs' },
      { icon: 'discord', link: 'https://discord.com/channels/905665558610051113/905670616391233566' }
    ]
  }
})
