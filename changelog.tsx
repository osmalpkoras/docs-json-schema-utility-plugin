import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Changelog',
    description: 'Release history and unreleased changes for the JSON Object & Schema Utility Plugin',
    order: 300,
    icon: 'History',
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Callout } from '@/components/doc-components';

export default function ChangelogPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <PageHeader />

                <p>
                    All notable changes to the JSON Object &amp; Schema Utility Plugin are documented here.
                    The latest section <strong>WIP</strong> tracks unreleased changes on the development branch
                    and gets pinned to a version number on each release.
                </p>

                <Callout type="info" title="Versioning">
                    <p>
                        Until <strong>WIP</strong> is shipped, anything listed under it is subject to change.
                        Once a release is cut, the <strong>WIP</strong> heading is replaced with the new version
                        number and date, and a fresh <strong>WIP</strong> section is started for the next cycle.
                    </p>
                </Callout>

                <h2>WIP</h2>

                <h3>Schema Generation</h3>
                <ul>
                    <li>
                        <strong>FVector support</strong>: <code>FVector</code> UPROPERTYs now serialize and
                        deserialize as a JSON object with required <code>x</code>, <code>y</code>,
                        <code>z</code> number fields. Previously skipped without a warning.
                    </li>
                    <li>
                        <strong>Soft object reference support</strong>: <code>FSoftObjectProperty</code> /
                        <code>TSoftObjectPtr&lt;T&gt;</code> properties are now schema-aware and serialize to/from
                        a string (the underlying <code>FSoftObjectPath</code>).
                    </li>
                </ul>

                <Callout type="info" title="Coming soon">
                    <p>
                        <code>FVector2D</code> (<code>{`{x, y}`}</code>) and <code>FRotator</code>
                        (<code>{`{pitch, yaw, roll}`}</code>) support is planned.
                    </p>
                </Callout>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
