import { defineConfig } from '../../dist/node';

export default defineConfig({
  lang: 'en-US',
  title: 'Island.js',
  icon: '/island.png',
  vite: {
    // custom config for vite
  },
  markdown: {
    rehypePlugins: [],
    remarkPlugins: []
  },
  route: {
    exclude: ['custom.tsx']
  },
  themeConfig: {
    outlineTitle: 'ON THIS PAGE',
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/sanyuan0704/island'
      }
    ],
    lastUpdatedText: 'Last Updated',
    editLink: {
      pattern:
        'https://github.com/sanyuan0704/island.js/tree/master/docs/:path',
      text: '📝 Edit this page on GitHub'
    },
    nav: [
      {
        text: 'Guide',
        link: '/guide/getting-started',
        activeMatch: '^/guide/'
      },
      {
        text: 'API',
        link: '/api/',
        activeMatch: '^/api'
      }
    ],

    sidebar: {
      '/': getTutorialSidebar(),
      '/api/': getApiSidebar()
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Xingyuan Yang'
    }
  }
});

function getTutorialSidebar() {
  return [
    {
      text: 'Introduction',
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Configure Your Site', link: '/guide/configure-site' }
      ]
    },
    {
      text: 'Architecture',
      items: [
        { text: 'SPA vs MPA', link: '/guide/spa-vs-mpa' },
        { text: 'Islands Architecture', link: '/guide/islands-arch' }
      ]
    },
    {
      text: 'Features',
      items: [
        { text: 'Conventional Routing', link: '/guide/conventional-route' },
        { text: 'Using MDX', link: '/guide/use-mdx' },
        { text: 'Custom Page', link: '/guide/custom-page' },
        { text: 'SPA Mode', link: '/guide/spa-mode' },
        { text: 'Static Assets', link: '/guide/static-assets' },
        { text: 'Extension', link: '/guide/extension' }
      ]
    }
  ];
}

function getApiSidebar() {
  return [
    {
      text: 'Config',
      items: [
        { text: 'Basic Config', link: '/api/config-basic' },
        { text: 'Theme Config', link: '/api/config-theme' },
        { text: 'Front Matter Config', link: '/api/config-front-matter' },
        { text: 'Extension Config', link: '/api/config-extension' }
      ]
    }
  ];
}
