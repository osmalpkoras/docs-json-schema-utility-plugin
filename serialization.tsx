import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'JSON Serialization',
    description: 'Convert between objects and JSON',
    order: 5,
    icon: 'ArrowLeftRight',
} satisfies ContentPage;

import { SiteDocumentation, PageContainer, PageHeader, PageFooter } from '@/components/layout';
import { Callout, CodeExample, LanguageToggleProvider } from '@/components/doc-components';

export default function SerializationPage() {
    return (
        <SiteDocumentation>
            <PageContainer>
                <PageHeader />

                <div>
                    <LanguageToggleProvider>
                        <p>
                            Serialization converts your UObject instances to JSON, and deserialization reconstructs them from JSON. Both operations use the cached schema for efficient, performant conversion. It is useful for saving player progress, network replication, API communication, and configuration management.
                        </p>

                        <h2>Serialization: Objects to JSON</h2>
                        <p>
                            Convert any object implementing IJsonSchema to JSON using one of two methods:
                        </p>

                        <h3>To JSON Object</h3>
                        <p>
                            Get a structured FJsonObject that you can manipulate before final serialization:
                        </p>

                        <CodeExample
                            title="Serialize to JSON Object"
                            description="Convert object to FJsonObject for manipulation"
                            cppCode={`AMyCharacter* Character = GetWorld()->SpawnActor<AMyCharacter>();
Character->CharacterName = TEXT("Aragorn");
Character->Level = 20;
Character->Health = 150;

// Serialize to FJsonObject
TSharedPtr<FJsonObject> JsonObject = Character->ToJson();

if (JsonObject.IsValid())
{
    // Access individual properties
    FString Name = JsonObject->GetStringField(TEXT("character_name"));
    int32 Level = (int32)JsonObject->GetNumberField(TEXT("level"));

    // Or manipulate the object before further processing
    JsonObject->SetNumberField(TEXT("level"), 25);
}`}
                        />

                        <h3>To JSON String</h3>
                        <p>
                            Directly serialize to a JSON string for transmission, storage, or logging:
                        </p>

                        <CodeExample
                            title="Serialize to JSON String"
                            description="Convert object directly to JSON string"
                            cppCode={`AMyCharacter* Character = GetWorld()->SpawnActor<AMyCharacter>();
Character->CharacterName = TEXT("Aragorn");
Character->Level = 20;

// Serialize directly to JSON string
FString JsonString = Character->ToJsonString();

// Result example:
// {"character_name":"Aragorn","level":20,"health":150}`}
                        />

                        <Callout type="tip" title="Schema-Generated Property Names">
                            <p>
                                Property names are automatically converted from PascalCase (CharacterName) to snake_case (character_name) in JSON. This follows common JSON naming conventions.
                            </p>
                        </Callout>

                        <h2>Deserialization: JSON to Objects</h2>
                        <p>
                            Reconstruct objects from JSON using the schema definition:
                        </p>

                        <h3>From JSON Object</h3>
                        <p>
                            Initialize an object from a structured FJsonObject:
                        </p>

                        <CodeExample
                            title="Deserialize from JSON Object"
                            description="Initialize object from FJsonObject structure"
                            cppCode={`// Create a new character instance
AMyCharacter* Character = GetWorld()->SpawnActor<AMyCharacter>();

// Create JSON data
TSharedPtr<FJsonObject> JsonObject = MakeShareable(new FJsonObject());
JsonObject->SetStringField(TEXT("character_name"), TEXT("Legolas"));
JsonObject->SetNumberField(TEXT("level"), 18);
JsonObject->SetNumberField(TEXT("health"), 120);

// Deserialize from JSON object
if (Character->FromJson(JsonObject))
{
    // Success - character is now populated
    UE_LOG(LogTemp, Warning, TEXT("Character loaded: %s (Level %d)"),
        *Character->CharacterName, Character->Level);
}
else
{
    // Failed - JSON didn't match schema constraints
    UE_LOG(LogTemp, Error, TEXT("Failed to deserialize character"));
}`}
                        />

                        <h3>From JSON String</h3>
                        <p>
                            Initialize an object directly from a JSON string:
                        </p>

                        <CodeExample
                            title="Deserialize from JSON String"
                            description="Initialize object directly from JSON string"
                            cppCode={`AMyCharacter* Character = GetWorld()->SpawnActor<AMyCharacter>();

FString JsonInput = TEXT(R"(
{
    "character_name": "Gimli",
    "level": 22,
    "health": 200
}
)");

// Deserialize from string
if (Character->FromJsonString(JsonInput))
{
    // Success
    UE_LOG(LogTemp, Warning, TEXT("Loaded: %s"), *Character->CharacterName);
}
else
{
    // Failed - invalid JSON or constraint violation
    UE_LOG(LogTemp, Error, TEXT("Deserialization failed"));
}`}
                        />

                        <h2>Round-Trip Serialization</h2>
                        <p>
                            A key feature is round-trip serialization: convert object → JSON → object and preserve all data:
                        </p>

                        <CodeExample
                            title="Round-Trip Serialization"
                            description="Serialize to JSON and back with full data integrity"
                            cppCode={`// Create original object
AMyCharacter* Original = GetWorld()->SpawnActor<AMyCharacter>();
Original->CharacterName = TEXT("Boromir");
Original->Level = 19;
Original->Health = 180;

// Convert to JSON and back
FString JsonString = Original->ToJsonString();

AMyCharacter* Reconstructed = GetWorld()->SpawnActor<AMyCharacter>();
Reconstructed->FromJsonString(JsonString);

// Data is identical
check(Reconstructed->CharacterName == Original->CharacterName);
check(Reconstructed->Level == Original->Level);
check(Reconstructed->Health == Original->Health);`}
                        />

                        <Callout type="info" title="Data Integrity">
                            <p>
                                Round-trip serialization is lossless for all supported property types. Complex objects and arrays are fully preserved.
                            </p>
                        </Callout>

                        <h2>Error Handling</h2>
                        <p>
                            Serialization returns a JSON object or string, and deserialization returns a boolean indicating success:
                        </p>

                        <CodeExample
                            title="Error Handling"
                            description="Check success status for serialization and deserialization"
                            cppCode={`// Serialization
TSharedPtr<FJsonObject> JsonObject = Character->ToJson();
if (JsonObject.IsValid())
{
    // Successfully serialized
    FString JsonString = Character->ToJsonString();
    UE_LOG(LogTemp, Warning, TEXT("Serialized: %s"), *JsonString);
}
else
{
    UE_LOG(LogTemp, Error, TEXT("Serialization failed"));
}

// Deserialization
FString JsonInput = GetJsonFromNetwork();
AMyCharacter* Character = GetWorld()->SpawnActor<AMyCharacter>();
if (Character->FromJsonString(JsonInput))
{
    // Successfully deserialized
    UE_LOG(LogTemp, Warning, TEXT("Loaded character: %s"), *Character->CharacterName);
}
else
{
    UE_LOG(LogTemp, Error, TEXT("Deserialization failed"));
    // Character remains in default state
}`}
                        />

                        <h2>Working with Complex Types</h2>

                        <h3>Arrays</h3>
                        <p>
                            Arrays are automatically serialized and deserialized:
                        </p>

                        <CodeExample
                            title="Array Serialization"
                            description="Automatically serialize and deserialize array properties"
                            cppCode={`UCLASS()
class AParty : public AActor, public IJsonSchema
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    TArray<FString> MemberNames;
};

AParty* Party = GetWorld()->SpawnActor<AParty>();
Party->MemberNames.Add(TEXT("Frodo"));
Party->MemberNames.Add(TEXT("Sam"));
Party->MemberNames.Add(TEXT("Merry"));

// Serializes to: {"member_names":["Frodo","Sam","Merry"]}
FString JsonString = Party->ToJsonString();

// Deserialize back
AParty* LoadedParty = GetWorld()->SpawnActor<AParty>();
LoadedParty->FromJsonString(JsonString);
// MemberNames now contains the three original names`}
                        />

                        <h3>Nested Objects</h3>
                        <p>
                            Nested objects are recursively serialized and deserialized:
                        </p>

                        <CodeExample
                            title="Nested Object Serialization"
                            description="Recursively serialize and deserialize nested IJsonSchema objects"
                            cppCode={`UCLASS()
class UWeapon : public UObject, public IJsonSchema
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Name;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Damage = 10;
};

UCLASS()
class AWarrior : public AActor, public IJsonSchema
{
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString Name;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    UWeapon* EquippedWeapon;
};

// Create warrior with weapon
AWarrior* Warrior = GetWorld()->SpawnActor<AWarrior>();
Warrior->Name = TEXT("Aragorn");
Warrior->EquippedWeapon = NewObject<UWeapon>();
Warrior->EquippedWeapon->Name = TEXT("Anduril");
Warrior->EquippedWeapon->Damage = 50;

// Serialize - includes nested weapon data
FString JsonString = Warrior->ToJsonString();
// Result: {"name":"Aragorn","equipped_weapon":{"name":"Anduril","damage":50}}`}
                        />
                    </LanguageToggleProvider>
                </div>

                <PageFooter />
            </PageContainer>
        </SiteDocumentation>
    );
}
