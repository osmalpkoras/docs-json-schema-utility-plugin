import type { SiteConfig } from '@/types/sites';
import { getSiteUrl } from '@/lib/env';
import thumbnail from '@/assets/json-schema-launcher.png';

export default {
    name: 'Json Object & Schema Utility Plugin',
    url: getSiteUrl('json-schema'),
    thumbnail: thumbnail,
    description: 'Utility plugin for JSON objects and schemas. Provides tools for validation, transformation, and schema generation.',
    links: {
        github: 'https://github.com/osmalpkoras/docs-json-schema-utility-plugin',
        documentation: '/json-schema',
    },
    github: {
        baseUrl: 'https://github.com/osmalpkoras/docs-json-schema-utility-plugin',
        branch: 'main',
        owner: 'oakisnotree',
        repo: 'docs-json-schema-utility-plugin',
    },
    headerLinks: {
        github: {
            label: 'GitHub',
            href: 'https://github.com/osmalpkoras/docs-json-schema-utility-plugin',
            icon: 'Github',
            ariaLabel: 'View on GitHub'
        },
        discord: {
            label: 'Discord',
            href: 'https://discord.com/invite/VR6YMu8wb5',
            icon: 'MessageCircle',
            ariaLabel: 'Join Discord'
        },
        fab: {
            label: 'FAB',
            href: 'https://www.fab.com/listings/37f4c8e1-0f72-48ad-9659-2d9801149e16',
            icon: 'ShoppingCart',
            ariaLabel: 'View on FAB - Unreal Engine Marketplace'
        },
    },
} satisfies SiteConfig;
