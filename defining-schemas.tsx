import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'Defining Schemas',
    description: 'Learn how to define JSON schemas using UPROPERTY metadata',
    order: 3,
    icon: 'Zap',
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import {
    Callout,
    LanguageToggleProvider,
    Example,
    ExampleTitle,
    ExampleContent,
    ExampleCpp,
} from '@/components/doc-components';

export default function DefiningSchemaPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <PageHeader />
                <div>
                    <LanguageToggleProvider>
                        <p>
                            Define your JSON schema directly in your Unreal Engine class using UPROPERTY metadata. The plugin leverages Unreal's reflection system to generate schemas at compile-time. Your class definition becomes your schema definition, and all UPROPERTY metadata is automatically translated to JSON Schema properties. The schema includes type information, constraints, and documentation. It can be exported for use with external APIs that follow the JSON Schema specification.
                        </p>

                        <Example>
                            <ExampleTitle>Excluding Properties from Schema</ExampleTitle>
                            <ExampleContent>
                                By default, all UPROPERTY-decorated properties are included in the JSON schema. To exclude a property from serialization and schema generation, use the <code>JsonSchema_ExcludeFromSchema</code> metadata flag:
                            </ExampleContent>
                            <ExampleCpp>
                                {`UCLASS()
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
                            </ExampleCpp>
                        </Example>

                        <Example>
                            <ExampleTitle>Defining Property Descriptions</ExampleTitle>
                            <ExampleContent>
                                Property descriptions are automatically included in the generated JSON schema. The plugin sources descriptions from either ToolTips or line comments, with ToolTip metadata taking precedenc:
                            </ExampleContent>
                            <ExampleCpp>
                                {`// Using ToolTip metadata (takes precedence)
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (ToolTip = "The character's current health points"))
int32 Health = 100;

// Using line comment (fallback, only used if ToolTip is not present)
// Maximum mana this character can have
UPROPERTY(EditAnywhere, BlueprintReadWrite)
int32 MaxMana = 50;

// ToolTip takes precedence over line comment
// This comment will be ignored
UPROPERTY(EditAnywhere, BlueprintReadWrite,
    Meta = (ToolTip = "This is the actual description"))
float AttackSpeed = 1.0f;`}
                            </ExampleCpp>
                        </Example>

                        <Callout type="tip" title="Best Practice for Documentation">
                            <p>
                                When both ToolTip metadata and a line comment are present, the ToolTip value is used. Use <code>ToolTip</code> metadata to explicitly control the JSON schema descriptions per property, if you need more extensive code comments, which should not go into the schema.
                            </p>
                        </Callout>
                        <Example>
                            <ExampleTitle>Marking Properties as Optional</ExampleTitle>
                            <ExampleContent>
                                Mark properties as optional using the <code>JsonSchema_Optional</code> metadata flag. Optional properties can be absent from JSON during deserialization without causing errors. When optional properties are not present in JSON, they retain their default values.
                            </ExampleContent>
                            <ExampleCpp>
                                {`// Optional string property
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
                            </ExampleCpp>
                        </Example>

                        <Example>
                            <ExampleTitle>Runtime Optional Property Overrides</ExampleTitle>
                            <ExampleContent>
                                For advanced use cases, you can override which properties are optional at runtime by implementing <code>GetOptionalPropertyOverrides()</code> in your class:
                            </ExampleContent>
                            <ExampleCpp>
                                {`UCLASS()
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
                            </ExampleCpp>
                        </Example>

                        <Example>
                            <ExampleTitle>String Properties with Patterns and Formats</ExampleTitle>
                            <ExampleContent>
                                String properties can include regex patterns and format specifications. These metadata values are translated directly into JSON Schema properties:
                            </ExampleContent>
                            <ExampleCpp>
                                {`// String with regex pattern
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
                            </ExampleCpp>
                        </Example>

                        <Callout type="info" title="Format Support">
                            <p>Supported formats include: uuid, email, uri, date, time, date-time, and more as per the JSON Schema specification.</p>
                        </Callout>

                        <Example>
                            <ExampleTitle>Numeric Properties with Constraints</ExampleTitle>
                            <ExampleContent>
                                Define ranges and divisibility rules for integer and floating-point properties. These metadata values are translated into JSON Schema numeric constraints:
                            </ExampleContent>
                            <ExampleCpp>
                                {`// Integer with inclusive min/max bounds
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
                            </ExampleCpp>
                        </Example>

                        <Example>
                            <ExampleTitle>Array Properties with Item Constraints</ExampleTitle>
                            <ExampleContent>
                                Array properties support constraints on the number of items. These metadata values are translated into JSON Schema array constraints:
                            </ExampleContent>
                            <ExampleCpp>
                                {`// Array with item count constraints
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
                            </ExampleCpp>
                        </Example>

                        <Example>
                            <ExampleTitle>Enumeration Properties</ExampleTitle>
                            <ExampleContent>
                                Enumerations are automatically serialized as human-readable strings and included in the JSON schema as enum constraints:
                            </ExampleContent>
                            <ExampleCpp>
                                {`UENUM(BlueprintType)
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
                            </ExampleCpp>
                        </Example>

                        <Example>
                            <ExampleTitle>Nested Objects with IJsonSchema</ExampleTitle>
                            <ExampleContent>
                                Include other UObjects that implement IJsonSchema as nested properties. The schema recursively includes the nested object's schema definition:
                            </ExampleContent>
                            <ExampleCpp>
                                {`UCLASS()
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
                            </ExampleCpp>
                        </Example>

                        <Callout type="warning" title="Nested Object Requirements">
                            <p>Nested objects must also implement IJsonSchema. The schema for nested objects is recursively generated and included in the parent schema, creating a complete hierarchical schema definition.</p>
                        </Callout>

                        <h2>Complete Example</h2>
                        <p>
                            Here's a comprehensive example combining all schema definition techniques:
                        </p>

                        <Example>
                            <ExampleTitle>Comprehensive Schema Definition Example</ExampleTitle>
                            <ExampleContent>
                                Complete example demonstrating all available schema definition options.
                            </ExampleContent>
                            <ExampleCpp>
                                {`UENUM(BlueprintType)
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
                            </ExampleCpp>
                        </Example>

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
                    </LanguageToggleProvider>
                </div>
                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
