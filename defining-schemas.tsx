import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Defining Schemas',
    description: 'Learn how to define JSON schemas using UPROPERTY metadata',
    order: 3,
    icon: 'Zap',
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Callout, CodeExample, LanguageToggleProvider } from '@/components/doc-components';

export default function DefiningSchemaPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <PageHeader />

                <LanguageToggleProvider>
                    <div className="space-y-6">
                        <p className="text-lg text-muted-foreground">
                            Define your JSON schema directly in your Unreal Engine class using UPROPERTY metadata. The plugin leverages Unreal's reflection system to generate schemas at compile-time. Your class definition becomes your schema definition, and all UPROPERTY metadata is automatically translated to JSON Schema properties.
                        </p>

                        <h2>Schema Generation from Reflection</h2>
                        <p>
                            Every UPROPERTY-decorated property in your class is automatically included in the generated JSON schema. The schema includes type information, constraints, and documentation based on your metadata. This schema can be exported for use with external APIs that follow the JSON Schema specification.
                        </p>

                        <h2>Excluding Properties</h2>
                        <p>
                            By default, all UPROPERTY-decorated properties are included in the JSON schema. To exclude a property from serialization and schema generation, use the <code>JsonSchema_ExcludeFromSchema</code> metadata flag:
                        </p>

                        <CodeExample
                            title="Excluding Properties from Schema"
                            description="Control which properties are included in the generated JSON schema"
                            cppCode={`UCLASS()
class ACharacter : public AActor, public IJsonSchema
{
    GENERATED_BODY()
public:
    // This property IS included in the schema
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString CharacterName;

    // This property is NOT included (excluded from schema)
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_ExcludeFromSchema))
    int32 InternalCounter;
};`}
                        />

                        <h2>Optional Properties</h2>
                        <p>
                            Mark properties as optional using the <code>JsonSchema_Optional</code> metadata flag. Optional properties can be absent from JSON during deserialization without causing errors. When optional properties are not present in JSON, they retain their default values.
                        </p>

                        <CodeExample
                            title="Marking Properties as Optional"
                            description="Define properties that don't need to be present in JSON"
                            cppCode={`// Optional string property
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Optional,
            ToolTip = "Optional character biography"))
FString Biography;

// Optional nested object
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Optional,
            ToolTip = "Optional special equipment"))
UEquipment* SpecialEquipment;

// Optional enumeration
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Optional))
ECharacterClass SecondaryClass;`}
                        />

                        <h3>Runtime Optional Overrides</h3>
                        <p>
                            For advanced use cases, you can override which properties are optional at runtime by implementing <code>GetOptionalPropertyOverrides()</code> in your class:
                        </p>

                        <CodeExample
                            title="Runtime Optional Property Overrides"
                            description="Dynamically control which properties are optional during deserialization"
                            cppCode={`UCLASS()
class AGameCharacter : public ACharacter, public IJsonSchema
{
    GENERATED_BODY()
public:
    virtual TArray<FName> GetOptionalPropertyOverrides() const override
    {
        // These properties will be treated as optional during deserialization
        // regardless of their JsonSchema_Optional metadata
        return {
            GET_MEMBER_NAME_CHECKED(AGameCharacter, Biography),
            GET_MEMBER_NAME_CHECKED(AGameCharacter, SpecialEquipment)
        };
    }

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString CharacterName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Biography;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    UEquipment* SpecialEquipment;
};`}
                        />

                        <h2>String Properties</h2>
                        <p>
                            String properties can include pattern validation and format specifications. These metadata values are translated directly into JSON Schema properties:
                        </p>

                        <CodeExample
                            title="String Properties with Patterns and Formats"
                            description="Define string properties with regex patterns and format specifications"
                            cppCode={`// String with regex pattern
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Pattern = "^[a-zA-Z0-9_]+$",
            ToolTip = "Username must be alphanumeric with underscores"))
FString Username;

// String with UUID format
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Format = "uuid",
            ToolTip = "Unique identifier"))
FString UniqueID;

// String with email format
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Format = "email",
            ToolTip = "Contact email address"))
FString ContactEmail;

// String with URI format
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Format = "uri",
            ToolTip = "Web address"))
FString WebsiteUrl;`}
                        />

                        <Callout type="info" title="Format Support">
                            <p>Supported formats include: uuid, email, uri, date, time, date-time, and more as per the JSON Schema specification.</p>
                        </Callout>

                        <h2>Numeric Properties</h2>
                        <p>
                            Define ranges and divisibility rules for integer and floating-point properties. These metadata values are translated into JSON Schema numeric constraints:
                        </p>

                        <CodeExample
                            title="Numeric Properties with Constraints"
                            description="Define numeric properties with min/max bounds and divisibility rules"
                            cppCode={`// Integer with inclusive min/max bounds
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Minimum = "1", JsonSchema_Maximum = "100",
            ToolTip = "Health points (1-100)"))
int32 Health = 100;

// Float with exclusive minimum (value must be greater than 0)
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Minimum = "0", JsonSchema_ExclusiveMinimum,
            ToolTip = "Damage multiplier (must be > 0)"))
float DamageMultiplier = 1.0f;

// Numeric value that must be a multiple of a specific number
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_MultipleOf = "0.5",
            ToolTip = "Attack speed (must be multiple of 0.5)"))
float AttackSpeed = 1.0f;

// Using exclusive maximum
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_Maximum = "1.0", JsonSchema_ExclusiveMaximum,
            ToolTip = "Damage reduction (must be < 1.0)"))
float DamageReduction = 0.5f;`}
                        />

                        <h2>Array Properties</h2>
                        <p>
                            Array properties support constraints on the number of items. These metadata values are translated into JSON Schema array constraints:
                        </p>

                        <CodeExample
                            title="Array Properties with Item Constraints"
                            description="Define array properties with min and max item count constraints"
                            cppCode={`// Array with item count constraints
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_MinItems = "1", JsonSchema_MaxItems = "5",
            ToolTip = "Special abilities (1-5 abilities)"))
TArray<FString> Abilities;

// Array with minimum items required
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (JsonSchema_MinItems = "3",
            ToolTip = "RGB color components (at least 3 items)"))
TArray<int32> ColorValues;

// Array with no constraints
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (ToolTip = "List of inventory items"))
TArray<FString> InventoryItems;`}
                        />

                        <h2>Enumeration Properties</h2>
                        <p>
                            Enumerations are automatically serialized as human-readable strings and included in the JSON schema as enum constraints:
                        </p>

                        <CodeExample
                            title="Enumeration Properties"
                            description="Define enum properties that are serialized as strings in JSON"
                            cppCode={`UENUM(BlueprintType)
enum class ECharacterClass : uint8
{
    Warrior UMETA(DisplayName = "Warrior"),
    Mage UMETA(DisplayName = "Mage"),
    Rogue UMETA(DisplayName = "Rogue"),
};

UCLASS()
class ACharacter : public AActor, public IJsonSchema
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    ECharacterClass CharacterClass = ECharacterClass::Warrior;

    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_Optional,
                ToolTip = "Secondary character class"))
    ECharacterClass SecondaryClass;
};

// Serialized as: {"character_class":"Warrior","secondary_class":"Mage"}
// Schema includes enum as: "enum": ["Warrior", "Mage", "Rogue"]`}
                        />

                        <h2>Nested Objects</h2>
                        <p>
                            Include other UObjects that implement IJsonSchema as nested properties. The schema recursively includes the nested object's schema definition:
                        </p>

                        <CodeExample
                            title="Nested Objects with IJsonSchema"
                            description="Define properties that reference other IJsonSchema-implementing classes"
                            cppCode={`UCLASS()
class UEquipment : public UObject, public IJsonSchema
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString EquipmentName;

    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_Minimum = "1", JsonSchema_Maximum = "50",
                ToolTip = "Defense bonus provided"))
    int32 DefenseBonus = 0;
};

UCLASS()
class ACharacter : public AActor, public IJsonSchema
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_Optional,
                ToolTip = "Optional equipped armor"))
    UEquipment* Armor;

    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_Optional,
                ToolTip = "Optional weapon"))
    UEquipment* Weapon;
};`}
                        />

                        <Callout type="warning" title="Nested Object Requirements">
                            <p>Nested objects must also implement IJsonSchema. The schema for nested objects is recursively generated and included in the parent schema, creating a complete hierarchical schema definition.</p>
                        </Callout>

                        <h2>Complete Example</h2>
                        <p>
                            Here's a comprehensive example combining all schema definition techniques:
                        </p>

                        <CodeExample
                            title="Comprehensive Schema Definition Example"
                            description="Complete example demonstrating all available schema definition options"
                            cppCode={`UENUM(BlueprintType)
enum class ECharacterRarity : uint8
{
    Common, Uncommon, Rare, Epic, Legendary
};

UCLASS()
class AGameCharacter : public ACharacter, public IJsonSchema
{
    GENERATED_BODY()

public:
    // String with pattern
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_Pattern = "^[a-zA-Z ]+$",
                ToolTip = "Character name (letters and spaces only)"))
    FString CharacterName;

    // Numeric range
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_Minimum = "1", JsonSchema_Maximum = "100",
                ToolTip = "Character level"))
    int32 Level = 1;

    // Array with constraints
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_MinItems = "1", JsonSchema_MaxItems = "5",
                ToolTip = "Special abilities (1-5)"))
    TArray<FString> SpecialAbilities;

    // Optional enumeration
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_Optional,
                ToolTip = "Character rarity"))
    ECharacterRarity Rarity = ECharacterRarity::Common;

    // Optional description
    UPROPERTY(EditAnywhere, BlueprintReadWrite,
        Meta = (JsonSchema_Optional,
                ToolTip = "Optional character description"))
    FString Description;
};`}
                        />

                        <h2>Metadata Reference</h2>
                        <p>
                            All metadata options are translated directly into the JSON Schema specification:
                        </p>
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">Metadata Key</th>
                                    <th className="text-left p-2">Value Type</th>
                                    <th className="text-left p-2">JSON Schema Equivalent</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                <tr>
                                    <td className="p-2"><code>JsonSchema_Pattern</code></td>
                                    <td className="p-2">Regex string</td>
                                    <td className="p-2">pattern property</td>
                                </tr>
                                <tr>
                                    <td className="p-2"><code>JsonSchema_Format</code></td>
                                    <td className="p-2">Format string</td>
                                    <td className="p-2">format property (uuid, email, uri, date, etc.)</td>
                                </tr>
                                <tr>
                                    <td className="p-2"><code>JsonSchema_Minimum</code></td>
                                    <td className="p-2">Number</td>
                                    <td className="p-2">minimum property (inclusive bound)</td>
                                </tr>
                                <tr>
                                    <td className="p-2"><code>JsonSchema_Maximum</code></td>
                                    <td className="p-2">Number</td>
                                    <td className="p-2">maximum property (inclusive bound)</td>
                                </tr>
                                <tr>
                                    <td className="p-2"><code>JsonSchema_ExclusiveMinimum</code></td>
                                    <td className="p-2">Flag</td>
                                    <td className="p-2">exclusiveMinimum property</td>
                                </tr>
                                <tr>
                                    <td className="p-2"><code>JsonSchema_ExclusiveMaximum</code></td>
                                    <td className="p-2">Flag</td>
                                    <td className="p-2">exclusiveMaximum property</td>
                                </tr>
                                <tr>
                                    <td className="p-2"><code>JsonSchema_MultipleOf</code></td>
                                    <td className="p-2">Number</td>
                                    <td className="p-2">multipleOf property</td>
                                </tr>
                                <tr>
                                    <td className="p-2"><code>JsonSchema_MinItems</code></td>
                                    <td className="p-2">Number</td>
                                    <td className="p-2">minItems property</td>
                                </tr>
                                <tr>
                                    <td className="p-2"><code>JsonSchema_MaxItems</code></td>
                                    <td className="p-2">Number</td>
                                    <td className="p-2">maxItems property</td>
                                </tr>
                                <tr>
                                    <td className="p-2"><code>JsonSchema_Optional</code></td>
                                    <td className="p-2">Flag</td>
                                    <td className="p-2">Required/optional field</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2>Property Descriptions</h2>
                        <p>
                            Property descriptions are automatically included in the generated JSON schema. The plugin sources descriptions from two places, with ToolTip metadata taking precedence:
                        </p>

                        <CodeExample
                            title="Defining Property Descriptions"
                            description="Use ToolTip metadata or line comments to document properties in your schema"
                            cppCode={`// Using ToolTip metadata (takes precedence)
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (ToolTip = \"The character's current health points\"))\nint32 Health = 100;\n\n// Using line comment (fallback, only used if ToolTip is not present)\n// Maximum mana this character can have\nUPROPERTY(EditAnywhere, BlueprintReadWrite)\nint32 MaxMana = 50;\n\n// ToolTip takes precedence over line comment\n// This comment will be ignored\nUPROPERTY(EditAnywhere, BlueprintReadWrite,\n    Meta = (ToolTip = \"This is the actual description\"))\nfloat AttackSpeed = 1.0f;`}
                            />
                            <p className="mt-4">
                                When both ToolTip metadata and a line comment are present, the ToolTip value is used. Line comments are useful for quick documentation during development, while ToolTip metadata provides an explicit, formal description that will definitely appear in the schema.
                            </p>

                        <Callout type="tip" title="Best Practice for Documentation">
                            <p>
                                Use <code>ToolTip</code> metadata for important public properties and when you need guaranteed documentation. Line comments work well for internal properties or when ToolTip isn't available.
                            </p>
                        </Callout>
                    </div>
                </LanguageToggleProvider>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
