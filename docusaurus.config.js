// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
    // ...(process.env.ENABLE_DOCUSAURUS_EXPERIMENTAL === 'true' && {
    //     future: {
    //         v4: true,
    //         experimental_faster: true,
    //     },

    // }),
    future: {
        v4: {
            removeLegacyPostBuildHeadAttribute: true, // required
        },
        experimental_faster: {
            ssgWorkerThreads: true,
        },
    },
    title: '代码酷',
    tagline: '免费好用的编程语言框架教程网站，学习编程就上代码酷！',
    favicon: 'img/favicon.ico',
    themes: ['@docusaurus/theme-live-codeblock', '@docusaurus/theme-mermaid', 'docusaurus-theme-search-typesense'],
    // Set the production url of your site here
    url: 'https://www.echo.cool',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    plugins: [
        [
            '@docusaurus/plugin-ideal-image',
            {
                quality: 70,
                max: 1030, // max resized image's size.
                min: 640, // min resized image's size. if original is lower, use that size.
                steps: 2, // the max number of images generated between min and max (inclusive)
                disableInDev: false,
            },
        ],

        // [
        //     '@docusaurus/plugin-pwa',
        //     {
        //         debug: true,
        //         offlineModeActivationStrategies: [
        //             'appInstalled',
        //             'standalone',
        //             'queryString',
        //         ],
        //         pwaHead: [
        //             {
        //                 tagName: 'link',
        //                 rel: 'icon',
        //                 href: '/img/logo.png',
        //             },
        //             {
        //                 tagName: 'link',
        //                 rel: 'manifest',
        //                 href: '/manifest.json', // your PWA manifest
        //             },
        //             {
        //                 tagName: 'meta',
        //                 name: 'theme-color',
        //                 content: 'rgb(37, 194, 160)',
        //             },
        //         ],
        //     },
        // ],
    ],
    markdown: {
        mermaid: true,
    },
    headTags: [
        {
            tagName: 'link',
            attributes: {rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96'},
        },
        {
            tagName: 'link',
            attributes: {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
        },
        {
            tagName: 'link',
            attributes: {rel: 'shortcut icon', href: '/favicon.ico'},
        },
        {
            tagName: 'link',
            attributes: {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
        },
        {
            tagName: 'link',
            attributes: {rel: 'manifest', href: '/site.webmanifest'},
        },
    ],

    scripts: [
        // String format.
        // 'https://docusaurus.io/script.js',
        // Object format.
        {
            src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8558870819217345',
            async: true,
            crossorigin: 'anonymous',
        },
        {
            src: 'https://hm.baidu.com/hm.js?1b165f68ccbfbd01c804c65a81779d58',
            async: true,
            crossorigin: 'anonymous',
        },
    ],

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    // organizationName: 'echo.cool', // Usually your GitHub org/user name.
    // projectName: 'docusaurus', // Usually your repo name.

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'zh-Hans',
        locales: ['zh-Hans'],
    },
    stylesheets: [
        {
            href: '/katex/katex.min.css',
            type: 'text/css',
        },
    ],
    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                gtag: {
                    trackingID: 'G-YM3ZG479VT',
                    anonymizeIP: false,
                },
                docs: {
                    sidebarPath: './sidebars.js',
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                      'https://github.com/echo-cool-coding/cool-coding/tree/main/',
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        'https://github.com/echo-cool-coding/cool-coding/tree/main/',
                    // Useful options to enforce blogging best practices
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
                sitemap: {
                    lastmod: 'date',
                    changefreq: 'daily',
                    priority: 0.5,
                    ignorePatterns: ['/tags/**'],
                    filename: 'sitemap.xml',
                    createSitemapItems: async (params) => {
                        const {defaultCreateSitemapItems, ...rest} = params;
                        const items = await defaultCreateSitemapItems(rest);
                        return items.filter((item) => !item.url.includes('/page/'));
                    },
                },
            }),
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            // Replace with your project's social card
            image: 'img/logo.png',
            metadata: [
                {
                    name: 'keywords',
                    content: '学习编程, 编程, 代码酷, python, java, javascript, c, c++, sql, go'
                },
                {
                    name: 'google-adsense-account',
                    content: 'ca-pub-8558870819217345'
                },
            ],
            colorMode: {
                defaultMode: 'light',
                disableSwitch: false,
                respectPrefersColorScheme: true,
            },
            announcementBar: {
                id: "replay_announcement",
                content: '喜欢这个项目吗？到 <a href="https://github.com/echo-cool-coding/cool-coding">GitHub</a> 给我们点个 ⭐ 支持一下吧！',
                backgroundColor: "#312e81",
                textColor: "#ffffff",
                isCloseable: false,
            },
            navbar: {
                title: '代码酷',
                hideOnScroll: false,
                logo: {
                    alt: '代码酷Logo',
                    src: 'img/logo.png',
                },

                items: [
                    {
                        type: "dropdown",
                        label: "基础知识",
                        items: [
                            {
                                label: '八股面试宝典',
                                to: "/docs/fundamental/interview"
                            },
                            {
                                label: '数据结构与算法',
                                to: "/docs/fundamental/algorithm"
                            },
                            {
                                label: '计算机网络',
                                to: "/docs/fundamental/network"
                            },
                            {
                                label: '数据库与信息系统',
                                to: "/docs/fundamental/database"
                            },
                            {
                                label: '操作系统',
                                to: "/docs/fundamental/os"
                            },
                            {
                                label: '系统设计与验证 (Lean)',
                                to: "/docs/fundamental/lean"
                            },
                            {
                                label: 'PRISM概率模型检测器',
                                to: "/docs/fundamental/prism"
                            },

                        ],
                    },
                    {
                        type: "dropdown",
                        label: "语言",
                        items: [
                            {
                                label: 'Python',
                                to: "/docs/language/python"
                            },
                            {
                                label: 'Java',
                                to: "/docs/language/java"
                            },
                            {
                                label: 'C',
                                to: "/docs/language/c"
                            },
                            {
                                label: 'C++',
                                to: "/docs/language/cpp"
                            },
                            {
                                label: 'C#',
                                to: "/docs/language/csharp"
                            },
                            {
                                label: 'JavaScript',
                                to: "/docs/language/javascript"
                            },
                            {
                                label: 'TypeScript',
                                to: "/docs/language/typescript"
                            },
                            {
                                label: 'Go',
                                to: "/docs/language/go"
                            },
                            {
                                label: 'Swift',
                                to: "/docs/language/swift"
                            },
                            {
                                label: 'PHP',
                                to: "/docs/language/php"
                            },
                        ]
                    },
                    {
                        type: "dropdown",
                        label: "前端",
                        items: [
                            {
                                label: '微信小程序',
                                to: "/docs/framework/wechatminiprogram"
                            },
                            {
                                label: 'HTML',
                                to: "/docs/web/html"
                            },
                            {
                                label: 'CSS',
                                to: "/docs/web/css"
                            },
                            {
                                label: 'JavaScript',
                                to: "/docs/language/javascript"
                            },
                            {
                                label: 'TypeScript',
                                to: "/docs/language/typescript"
                            },
                            {
                                label: 'Next.js',
                                to: "/docs/framework/nextjs"
                            },
                            {
                                label: 'React',
                                to: "/docs/framework/react"
                            },
                            {
                                label: 'Vue.js',
                                to: "/docs/framework/vue"
                            },
                        ],
                    },
                    {
                        type: "dropdown",
                        label: "后端",
                        items: [
                            {
                                label: 'Spring',
                                to: "/docs/framework/spring"
                            },
                            {
                                label: 'Spring Cloud Alibaba',
                                to: "/docs/framework/springcloud_alibaba"
                            },
                            {
                                label: 'Django',
                                to: "/docs/framework/django"
                            },
                            {
                                label: 'Gin',
                                to: "/docs/framework/gin"
                            },

                        ],
                    },
                    {
                        type: "dropdown",
                        label: "可观测性",
                        items: [
                            {
                                label: 'Alloy',
                                to: "/docs/observability/alloy"
                            },
                            {
                                label: 'Prometheus',
                                to: "/docs/observability/prometheus"
                            },
                            {
                                label: 'Loki',
                                to: "/docs/observability/loki"
                            },
                            {
                                label: 'Grafana',
                                to: "/docs/observability/grafana"
                            },
                            {
                                label: 'Jaeger',
                                to: "/docs/observability/jaeger"
                            },
                            {
                                label: 'Zipkin',
                                to: "/docs/observability/zipkin"
                            },
                            {
                                label: 'SkyWalking',
                                to: "/docs/observability/skywalking"
                            },
                            {
                                label: 'OpenTelemetry',
                                to: "/docs/observability/opentelemetry"
                            },
                        ],
                    },
                    {
                        type: "dropdown",
                        label: "数据与AI",
                        items: [
                            {
                                label: 'Airflow',
                                to: "/docs/data/airflow"
                            },
                            {
                                label: 'Drill',
                                to: "/docs/data/drill"
                            },
                            {
                                label: 'Hadoop',
                                to: "/docs/data/hadoop"
                            },
                            {
                                label: 'Spark',
                                to: "/docs/data/spark"
                            },
                            {
                                label: 'Pandas',
                                to: "/docs/data/pandas"
                            },
                            {
                                label: 'PyTorch',
                                to: "/docs/ai/pytorch"
                            },
                            {
                                label: 'TensorFlow',
                                to: "/docs/ai/tensorflow"
                            },
                            {
                                label: 'R Language',
                                to: "/docs/data/r"
                            },
                        ]
                    },
                    {
                        type: "dropdown",
                        label: "移动开发",
                        items: [
                            {
                                label: 'Swift',
                                to: "/docs/language/swift"
                            },
                            {
                                label: 'Android (Java)',
                                to: "/docs/framework/android_java"
                            },
                            {
                                label: 'Android (Kotlin)',
                                to: "/docs/framework/android_kotlin"
                            }
                        ]
                    },
                    {
                        type: "dropdown",
                        label: "操作系统",
                        items: [
                            {
                                label: 'CentOS',
                                to: "/docs/os/centos"
                            },
                            {
                                label: 'Ubuntu',
                                to: "/docs/os/ubuntu"
                            },
                            {
                                label: 'Debian',
                                to: "/docs/os/debian"
                            },
                        ]
                    },
                    {
                        type: "dropdown",
                        label: "数据库",
                        items: [
                            {
                                label: 'SQL',
                                to: "/docs/database/sql"
                            },
                            {
                                label: 'MySQL',
                                to: "/docs/database/mysql"
                            },
                            {
                                label: 'PostgreSQL',
                                to: "/docs/database/postgresql"
                            },
                            {
                                label: 'Elasticsearch',
                                to: "/docs/database/elasticsearch"
                            },
                            {
                                label: 'Cassandra',
                                to: "/docs/database/cassandra"
                            },
                            {
                                label: 'HBase',
                                to: "/docs/database/hbase"
                            },
                            {
                                label: 'Hive',
                                to: "/docs/database/hive"
                            },
                        ]
                    },
                    {
                        type: "dropdown",
                        label: "集成部署",
                        items: [
                            {
                                label: 'Docker',
                                to: "/docs/devops/docker"
                            },
                            {
                                label: 'Kubernetes (k8s)',
                                to: "/docs/devops/kubernetes"
                            },
                            {
                                label: 'Git',
                                to: "/docs/devops/git"
                            },
                            {
                                label: 'Jenkins',
                                to: "/docs/devops/jenkins"
                            }
                        ]
                    },
                    {
                        type: "dropdown",
                        label: "中间件",
                        items: [
                            {
                                label: "Nginx",
                                to: "/docs/middleware/nginx"
                            },
                            {
                                label: 'Redis',
                                to: "/docs/middleware/redis"
                            },
                            {
                                label: 'Kafka',
                                to: "/docs/middleware/kafka"
                            },
                            {
                                label: 'RocketMQ',
                                to: "/docs/middleware/rocketmq"
                            },
                            {
                                label: 'RabbitMQ',
                                to: "/docs/middleware/rabbitmq"
                            },
                            {
                                label: 'Nacos',
                                to: "/docs/middleware/nacos"
                            },
                            {
                                label: 'Seata',
                                to: "/docs/middleware/seata"
                            },
                            {
                                label: 'Sentinel',
                                to: "/docs/middleware/sentinel"
                            },
                            {
                                label: "Eureka",
                                to: "/docs/middleware/eureka"
                            },
                            {
                                label: "Zookeeper",
                                to: "/docs/middleware/zookeeper"
                            },
                        ]
                    },
                    {
                        type: "dropdown",
                        label: "物联网",
                        items: [
                            {
                                label: 'Arduino',
                                to: "/docs/iot/arduino"
                            },
                            {
                                label: 'STM32',
                                to: "/docs/iot/stm32"
                            },
                            {
                                label: '51单片机',
                                to: "/docs/iot/51"
                            }
                        ]
                    },

                ],


            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: '代码酷',
                        items: [
                            {
                                label: 'Wiki',
                                to: 'https://wiki.echo.cool',
                            },
                            {
                                label: '首页',
                                to: '/',
                            },
                            {
                                label: '检索',
                                to: '/search',
                            },
                            {
                                label: '问题反馈',
                                to: 'mailto:feedback@echo.cool',
                            },
                        ],
                    },
                    {
                        title: 'Links',
                        items: [
                            {
                                label: '关于我',
                                to: 'https://www.yuyangwang.org/',
                            },
                            {
                                label: '英文站点',
                                to: 'https://www.compilenrun.com/',
                            },
                            {
                                label: '京ICP备17055752号-2',
                                href: "https://beian.miit.gov.cn/",
                            }
                        ],
                    },
                    {
                        title: 'Tools',
                        items: [
                            {
                                label: 'Emoji to PNG',
                                to: 'https://emoji.compilenrun.com/',
                            },
                            {
                                label: 'Image Resizer',
                                to: 'https://resizer.compilenrun.com/',
                            },
                            {
                                label: 'SVG Viewer',
                                to: 'https://svgviewer.compilenrun.com/',
                            },
                        ],
                    }
                ],
                // links: [
                //   {
                //     title: 'Docs',
                //     items: [
                //       {
                //         label: 'Tutorial',
                //         to: '/docs/intro',
                //       },
                //     ],
                //   },
                //   {
                //     title: 'Community',
                //     items: [
                //       {
                //         label: 'Stack Overflow',
                //         href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                //       },
                //       {
                //         label: 'Discord',
                //         href: 'https://discordapp.com/invite/docusaurus',
                //       },
                //       {
                //         label: 'X',
                //         href: 'https://x.com/docusaurus',
                //       },
                //     ],
                //   },
                //   {
                //     title: 'More',
                //     items: [
                //       {
                //         label: 'Blog',
                //         to: '/blog',
                //       },
                //       {
                //         label: 'GitHub',
                //         href: 'https://github.com/facebook/docusaurus',
                //       },
                //     ],
                //   },
                // ],
                copyright: `Copyright © ${new Date().getFullYear()} 代码酷.`,
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
                additionalLanguages: ['powershell', 'bash', 'java', "php", "csharp", "c", "cpp", "go", "kotlin", "swift", "rust", "sql", "json", "yaml", "groovy", "properties", "r"],
                magicComments: [
                    // Remember to extend the default highlight class name as well!
                    {
                        className: 'theme-code-block-highlighted-line',
                        line: 'highlight-next-line',
                        block: {start: 'highlight-start', end: 'highlight-end'},
                    },
                    {
                        className: 'code-block-error-line',
                        line: 'error-line',
                    },
                ],
            },

            typesense: {
                // Replace this with the name of your index/collection.
                // It should match the "index_name" entry in the scraper's "config.json" file.
                typesenseCollectionName: 'cool-coding-docusaurus',

                typesenseServerConfig: {
                    nodes: [
                        {
                            host: 'search.api.echo.cool',
                            port: 443,
                            protocol: 'https',
                        },
                    ],
                    apiKey: 'hjfkh314jh5hk1j3lh45k3jh254',
                },

                // Optional: Typesense search parameters: https://typesense.org/docs/0.24.0/api/search.html#search-parameters
                typesenseSearchParameters: {},

                // Optional
                contextualSearch: true,
            },

            //
            // algolia: {
            //     // The application ID provided by Algolia
            //     appId: '3Q65GZ0FDL',
            //
            //     // Public API key: it is safe to commit it
            //     apiKey: 'aea402bab96d0270a3e817bd3c42acf1',
            //
            //     indexName: 'echo',
            //
            //     // Optional: see doc section below
            //     contextualSearch: true,
            //
            //     // // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
            //     // externalUrlRegex: 'external\\.com|domain\\.com',
            //     //
            //     // // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
            //     // replaceSearchResultPathname: {
            //     //     from: '/docs/', // or as RegExp: /\/docs\//
            //     //     to: '/',
            //     // },
            //
            //     // // Optional: Algolia search parameters
            //     // searchParameters: {},
            //
            //     // Optional: path for search page that enabled by default (`false` to disable it)
            //     searchPagePath: 'search',
            //
            //     // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
            //     insights: true,
            //
            //     //... other Algolia params
            // },
        }),
};

export default config;
