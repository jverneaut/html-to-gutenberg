// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";
import packageJSON from "../package.json";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const logo = "img/logo.svg";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "HTML To Gutenberg",
  tagline: packageJSON.description,
  favicon: logo,

  // Set the production url of your site here
  url: "https://html-to-gutenberg.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "jverneaut", // Usually your GitHub org/user name.
  projectName: packageJSON.name, // Usually your repo name.

  headTags: [
    {
      tagName: "script",
      attributes: {
        type: "application/ld+json",
      },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "HTML To Gutenberg",
        url: "https://html-to-gutenberg.com",
      }),
    },
  ],

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `${packageJSON.repository.url.split(".git")[0]}/tree/main/docs`,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },

      // Replace with your project's social card
      image: "img/social-card.jpg",
      navbar: {
        title: "HTML To Gutenberg",
        logo: {
          alt: "HTML To Gutenberg",
          src: logo,
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Documentation",
          },
          {
            href: "/live-editor",
            position: "left",
            label: "Live Editor",
          },
          {
            href: "https://github.com/jverneaut/html-to-gutenberg",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "light",
        copyright: `Copyright © ${new Date().getFullYear()} HTML To Gutenberg. Built in Strasbourg by <a href="https://www.julienverneaut.com" target="_blank">Julien Verneaut.</a>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["php"],
      },

      algolia: {
        appId: "6YBIB3D2UU",
        apiKey: "4446ea46a8ba6cda94109ba70c372825",
        indexName: "html-to-gutenberg",
      },
    }),

  scripts: [
    {
      src: "https://plausible.io/js/script.js",
      defer: true,
      "data-domain": "html-to-gutenberg.com",
    },
  ],

  plugins: ["html-loader"],
};

export default config;
