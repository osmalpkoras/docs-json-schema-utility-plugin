'use client'

import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'JSON Object & Schema Utility Plugin',
    description: 'Transform UObject classes into JSON Schema-validated data with automatic serialization',
    order: 1,
} satisfies ContentPage;

import Image from 'next/image';
import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Callout, Step, StepList, LanguageToggleProvider } from '@/components/doc-components';
import { Button } from '@/components/ui/button';
import jsuLogo from '@/assets/json-schema-launcher.png';
import { useSite } from '@/components/layout';

export default function HomePage() {
    const { siteConfig } = useSite();

    return (
        <SiteDocumentation>
            <PageContainer>
                {/* Header Section */}
                <h1>JSON Object & Schema Utility Plugin</h1>
                <div className="flex flex-col lg:flex-row gap-4 items-start mb-4">
                    <Image
                        src={jsuLogo}
                        alt="JSON Object & Schema Utility Plugin Logo"
                        width={160}
                        height={160}
                        className="rounded-lg border shadow-sm m-0!"
                    />
                    <p className="flex-1 text-sm text-muted-foreground leading-relaxed m-0!">
                        The JSON Object & Schema Utility Plugin transforms your Unreal Engine UObject classes into fully validated JSON with automatic schema generation, seamless bidirectional serialization, and OpenAI integration support.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center justify-center">
                    <Button>
                        <a href={siteConfig.headerLinks["fab"].href} target="_blank" rel="noopener noreferrer">
                            Buy on FAB
                        </a>
                    </Button>
                    <Button variant="outline">
                        <a href={siteConfig.headerLinks["github"].href} target="_blank" rel="noopener noreferrer">
                            View on GitHub
                        </a>
                    </Button>
                    <Button variant="outline">
                        <a href={siteConfig.headerLinks["discord"].href} target="_blank" rel="noopener noreferrer">
                            Join Discord
                        </a>
                    </Button>
                </div>

                <div className="space-y-6">
                    <p>
                        The plugin is designed to make it easy to work with and integrate JSON Schema into your projects: define schemas using UPROPERTY metadata, serialize objects to JSON and deserialize back with full data integrity, export schemas for external APIs like OpenAI, and work seamlessly across your game logic and runtime code. Whether for in-editor tools or runtime gameplay, the plugin provides a solid foundation for data-driven systems with structured validation.
                    </p>

                    <div className="border-l-2 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-950/20 rounded-r p-4">
                        <p className="font-semibold">Core Idea</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Implement the IJsonSchema interface on your UClass to automatically get JSON serialization, deserialization, and JSON Schema generation with full support for OpenAI's structured output specification.
                        </p>
                    </div>

                    <h2>What It Does</h2>
                    <ul className="space-y-2">
                        <li><strong>Bidirectional Serialization:</strong> Convert objects to JSON and reconstruct them from JSON with full data integrity</li>
                        <li><strong>Automatic Schema Generation:</strong> Your class definition automatically generates complete JSON Schemas ready for API integration</li>
                        <li><strong>Reflection-Driven Constraints:</strong> Define schema constraints directly in UPROPERTY metadata—patterns, ranges, array limits, and more</li>
                        <li><strong>OpenAI Compatible:</strong> Generate schemas that conform to OpenAI's structured output specification</li>
                        <li><strong>Blueprint Ready:</strong> Serialize and deserialize objects directly from Blueprint</li>
                        <li><strong>Runtime Optimized:</strong> Pre-cached schemas eliminate reflection overhead with direct property access</li>
                    </ul>

                    <h2>Installation</h2>
                    <p>
                        Add the JSON Object & Schema Utility Plugin to your Unreal Engine 5 project. The plugin is part of the Generative AI Integration package and can be installed from the FAB Marketplace or by cloning the source from GitHub.
                    </p>

                    <Callout type="info" title="Engine Support">
                        <p>The plugin requires Unreal Engine 5.0 or later.</p>
                    </Callout>

                    <h2>Getting Started</h2>
                    <StepList>
                        <Step title="Enable the Plugin">
                            <p>
                                Ensure the JSON Object & Schema Utility Plugin is enabled in your project. Go to <strong>Edit → Plugins</strong> and search for "JSON Schema". Make sure it's enabled.
                            </p>
                        </Step>

                        <Step title="Implement IJsonSchema Interface">
                            <p>
                                Create or modify your UClass to inherit from <code>IJsonSchema</code>:
                            </p>
                        </Step>

                        <Step title="Configure the Schema Cache">
                            <p>
                                Go to <strong>Edit → Project Settings → Plugins → JSON Object & Schema Utility</strong> and select a Schema Cache data asset. You can create a new one if none exists. The cache is automatically populated when you compile your project.
                            </p>
                        </Step>
                    </StepList>

                    <h2>Your First Serialization</h2>
                    <p>
                        Once your class implements IJsonSchema, you can immediately serialize and deserialize objects:
                    </p>
                    <h2>Common Use Cases</h2>
                    <ul className="space-y-2">
                        <li><strong>OpenAI Integration:</strong> Generate schemas and deserialize AI responses directly into your game objects</li>
                        <li><strong>REST API Communication:</strong> Serialize game data for backend APIs with schema compatibility</li>
                        <li><strong>Data Persistence:</strong> Save and load game configurations with structured data</li>
                        <li><strong>Plugin Communication:</strong> Share structured data between plugins with consistent schemas</li>
                    </ul>

                    <div className="p-6 bg-muted rounded-lg">
                        <h3 className="mt-0 font-semibold">Next Steps</h3>
                        <p className="text-sm">Explore the documentation to learn how to:</p>
                        <ul className="text-sm">
                            <li>Define your own JSON schemas with comprehensive property options</li>
                            <li>Build and manage the schema cache</li>
                            <li>Convert between object instances and JSON bidirectionally</li>
                            <li>Export schemas for integration with OpenAI and other APIs</li>
                        </ul>
                    </div>
                </div>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation >
    );
}