import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Schema Cache',
    description: 'Understanding and managing the JSON Schema cache',
    order: 4,
    icon: 'Database',
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Callout, CodeExample, LanguageToggleProvider } from '@/components/doc-components';

export default function SchemaCachePage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <PageHeader />
                <div>
                    <LanguageToggleProvider>
                        <p>
                            The Schema Cache is a data asset that stores pre-generated JSON schemas for all your classes that implement IJsonSchema. Using a cache enables efficient runtime serialization and schema export without reflection overhead.
                        </p>

                        <h2>What is the Schema Cache?</h2>
                        <p>
                            The Schema Cache is a UJsonSchemaCache data asset that contains pre-computed JSON schemas for all your classes that implement IJsonSchema. The plugin uses these pre-built definitions for:
                        </p>
                        <ul className="space-y-2">
                            <li><strong>Serialization:</strong> Converting objects to JSON</li>
                            <li><strong>Deserialization:</strong> Converting JSON back to objects</li>
                            <li><strong>Schema Export:</strong> Providing schemas to external systems like OpenAI's structured output</li>
                        </ul>

                        <p className="mt-4">
                            By pre-computing schemas at compile-time rather than using reflection at runtime, the plugin achieves efficient, performant serialization suitable for gameplay and runtime use.
                        </p>

                        <h2>Creating a Schema Cache</h2>
                        <p>
                            Follow these steps to create a new Schema Cache data asset:
                        </p>

                        <ol className="space-y-4 list-decimal list-inside">
                            <li>
                                <strong>Open Content Browser</strong> and navigate to your project's content folder
                            </li>
                            <li>
                                <strong>Right-click in empty space</strong> and select <strong>Miscellaneous → Data Asset</strong>
                            </li>
                            <li>
                                <strong>Choose UJsonSchemaCache</strong> as the data asset class
                            </li>
                            <li>
                                <strong>Name it appropriately</strong> (e.g., "DefaultJsonSchemaCache" or "GameDataSchemaCache")
                            </li>
                            <li>
                                <strong>Double-click to open</strong> and verify it's created (it will be mostly empty at first)
                            </li>
                        </ol>

                        <h2>Configuring the Cache</h2>
                        <p>
                            Point your project to use the Schema Cache in project settings:
                        </p>

                        <ol className="space-y-4 list-decimal list-inside">
                            <li>
                                Go to <strong>Edit → Project Settings</strong>
                            </li>
                            <li>
                                Navigate to <strong>Plugins → JSON Object & Schema Utility</strong>
                            </li>
                            <li>
                                In the <strong>Default Schema Cache</strong> dropdown, select your cache asset
                            </li>
                            <li>
                                <strong>Save</strong> the project settings
                            </li>
                        </ol>

                        <h2>Automatic Cache Building</h2>
                        <p>
                            The cache is automatically built in these scenarios:
                        </p>
                        <ul className="space-y-2">
                            <li><strong>Editor Startup:</strong> When you open the Unreal Engine editor, the cache is built for all IJsonSchema classes in loaded modules</li>
                            <li><strong>Hot Reload:</strong> When you modify and recompile a class (e.g., in Visual Studio during the editor session), the cache is automatically updated</li>
                            <li><strong>Full Recompile:</strong> When you compile your project through the editor's compile button</li>
                        </ul>

                        <p className="mt-4">
                            You don't need to take any manual action for these automatic builds—they happen transparently in the background.
                        </p>

                        <Callout type="info" title="Automatic Generation">
                            <p>
                                The plugin's editor module automatically detects all compiled classes that implement IJsonSchema and generates their schemas, storing them in the configured cache.
                            </p>
                        </Callout>

                        <h2>Using the Cache at Runtime</h2>
                        <p>
                            The runtime automatically uses the configured cache during serialization and deserialization. You typically don't need to interact with it directly, but if needed, you can access it programmatically:
                        </p>

                        <CodeExample
                            title="Accessing the Schema Cache"
                            description="Get and use the schema cache at runtime"
                            cppCode={`// Get the effective schema cache
UJsonSchemaCache* Cache = UJsonSchemaUtilityRuntimeSettings::GetEffectiveSchemaCache();

// Find a schema for a specific class
const FJsonSchemaObject* Schema = Cache->FindSchemaForClass(UMyClass::StaticClass()->GetFName());

if (Schema)
{
    // Use the schema for validation or inspection
    UE_LOG(LogTemp, Warning, TEXT("Schema found for UMyClass"));
}`}
                        />

                        <h2>Serialization with Cache</h2>
                        <p>
                            When you serialize an object, the plugin uses the cache to efficiently convert it to JSON:
                        </p>

                        <ol className="space-y-2 list-decimal list-inside">
                            <li>Look up the schema for the object's class</li>
                            <li>Iterate through all properties defined in the schema</li>
                            <li>Convert each property value to a JSON representation</li>
                            <li>Build and return the final JSON object</li>
                        </ol>

                        <p>
                            Since the schema is pre-built, no expensive reflection is needed at runtime:
                        </p>

                        <CodeExample
                            title="Serialization with Cached Schema"
                            description="Efficient serialization without reflection overhead"
                            cppCode={`// Efficient serialization using cached schema
AMyCharacter* Character = GetWorld()->SpawnActor<AMyCharacter>();
Character->CharacterName = TEXT("Hero");
Character->Level = 5;

// This uses the cached schema - no reflection overhead
FString JsonString = Character->ToJsonString();
// Result: {"character_name":"Hero","level":5}`}
                        />

                        <h2>Deserialization with Cache</h2>
                        <p>
                            During deserialization, the cache enables the plugin to efficiently reconstruct objects from JSON:
                        </p>

                        <ol className="space-y-2 list-decimal list-inside">
                            <li>Look up the schema for the target class</li>
                            <li>Parse the incoming JSON</li>
                            <li>Map JSON fields to object properties based on the schema</li>
                            <li>Apply the values to the object</li>
                        </ol>

                        <CodeExample
                            title="Deserialization with Cached Schema"
                            description="Efficient deserialization from JSON using the cached schema"
                            cppCode={`// Efficient deserialization using cached schema
FString JsonInput = TEXT(R"({
  "character_name": "Hero",
  "level": 5
})");

AMyCharacter* Character = GetWorld()->SpawnActor<AMyCharacter>();
if (Character->FromJsonString(JsonInput))
{
    // Successfully reconstructed from JSON
    UE_LOG(LogTemp, Warning, TEXT("Character: %s (Level %d)"),
        *Character->CharacterName, Character->Level);
}`}
                        />

                        <h2>Manual Cache Rebuild</h2>
                        <p>
                            If you need to manually rebuild the cache (for example, after moving or renaming files), use the editor's Tools menu:
                        </p>

                        <ol className="space-y-4 list-decimal list-inside">
                            <li>
                                Go to <strong>Tools → Rebuild JSON Schema Cache</strong> in the main editor menu
                            </li>
                            <li>
                                The plugin will scan all loaded modules for classes implementing IJsonSchema
                            </li>
                            <li>
                                Generated schemas will be written to the configured cache asset
                            </li>
                            <li>
                                You'll see confirmation in the Output Log when the rebuild completes
                            </li>
                        </ol>

                        <Callout type="info" title="When to Manually Rebuild">
                            <p>
                                Manual rebuild is rarely needed since automatic builds handle editor startup and hot reloads. Use it if you suspect the cache is out of sync, or after significant project reorganization.
                            </p>
                        </Callout>

                        <h2>Best Practices</h2>

                        <h3>Create One Cache Per Project (Usually)</h3>
                        <p>
                            Most projects use a single Schema Cache. However, if you have multiple distinct sets of classes (e.g., in different plugins), you can use separate caches.
                        </p>

                        <h3>Place Cache in Appropriate Folder</h3>
                        <p>
                            Store your cache in a project-wide location like <code>Content/Config</code> or <code>Content/Data</code> so it's easily found and managed.
                        </p>

                        <h3>Don't Delete Classes Without Recompiling</h3>
                        <p>
                            If you remove a class that implements IJsonSchema, recompile your project to update the cache. The old schema will be automatically removed.
                        </p>

                        <h3>Use Named Caches for Organization</h3>
                        <p>
                            If using multiple caches, use descriptive names like "GameplaySchemaCache" or "NetworkingSchemaCache" to keep track of what each cache contains.
                        </p>

                        <Callout type="warning" title="Cache is Compile-Time Generated">
                            <p>
                                The cache is generated at editor compile time and baked into your packaged game. Changes to class definitions require recompilation to update the cache.
                            </p>
                        </Callout>

                        <h2>Troubleshooting</h2>

                        <h3>My Class Doesn't Appear in the Cache</h3>
                        <p>
                            Make sure:
                        </p>
                        <ul className="space-y-1">
                            <li>Your class implements IJsonSchema</li>
                            <li>Your project has been compiled</li>
                            <li>The cache asset is set in Project Settings → Plugins → JSON Object & Schema Utility</li>
                            <li>Your class is in a loaded module</li>
                        </ul>

                        <p className="mt-2">
                            If these are all correct, try manually rebuilding the cache via <strong>Tools → Rebuild JSON Schema Cache</strong>.
                        </p>

                        <h3>Schema is Out of Date After Code Changes</h3>
                        <p>
                            If you modify a class's properties and the schema hasn't updated:
                        </p>
                        <ol className="space-y-1 list-decimal list-inside">
                            <li>Save your class modifications</li>
                            <li>Recompile the project (the cache automatically updates)</li>
                            <li>If still out of date, use <strong>Tools → Rebuild JSON Schema Cache</strong></li>
                        </ol>

                        <h3>Getting Schema in C++ Code</h3>
                        <p>
                            If you need to access a schema at runtime for inspection or validation:
                        </p>

                        <CodeExample
                            title="Accessing Schema at Runtime"
                            description="Retrieve and inspect a schema in C++ code"
                            cppCode={`// Get the cache
UJsonSchemaCache* Cache = UJsonSchemaUtilityRuntimeSettings::GetEffectiveSchemaCache();
if (!Cache)
{
    UE_LOG(LogTemp, Error, TEXT("No schema cache configured"));
    return;
}

// Find schema for your class
const FJsonSchemaObject* Schema = Cache->FindSchemaForClass(AMyCharacter::StaticClass()->GetFName());
if (!Schema)
{
    UE_LOG(LogTemp, Error, TEXT("Schema not found for AMyCharacter"));
    return;
}

// Now you can use the schema for validation or inspection`}
                        />
                    </LanguageToggleProvider>
                </div>
                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
