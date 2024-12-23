import { Ingredient, Unit } from "@/types/IngredientTypes";
import database from "../database/Database";
import { createIngredient } from "./IngredientDao";
import { Recipe, RecipeDifficulty } from "@/types/RecipeTypes";
import { createRecipe } from "./RecipeDao";
import { Duration } from "../misc/Duration";
import { Asset } from 'expo-asset';

export async function isInitial() {
    const count = (
        await database.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) AS count FROM Initial;`
        )
    )?.count ?? 0;

    return count == 0;
}

async function createTemporaryUriOfStaticFile(staticFile: any) {
    const asset = Asset.fromModule(staticFile);
    await asset.downloadAsync();
    return asset.localUri;
}

export async function setIsInitial(isInitial: boolean) {
    if (isInitial) {
        await database.execAsync('DELETE FROM Initial');
    } else {
        await database.execAsync('INSERT INTO Initial (initial) VALUES (1)');
    }
}

export async function createDefaultIngredientsAndRecipes(): Promise<{ ingredients: Ingredient[], recipes: Recipe[] }> {
    const water = await createIngredient({
        name: "Wasser",
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/water.jpg')) ?? undefined,
        unit: Unit.LITER,
        calorificValue: { kcal: 0, nUnits: 1 }
    });

    const flour = await createIngredient({
        name: "Mehl",
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/flour.jpg')) ?? undefined,
        unit: Unit.GRAMM,
        calorificValue: { kcal: 364, nUnits: 100 }
    });

    const salt = await createIngredient({
        name: "Salz",
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/salt.jpg')) ?? undefined,
        unit: Unit.GRAMM,
        calorificValue: { kcal: 0, nUnits: 100 }
    });

    const yeast = await createIngredient({
        name: "frische Hefe",
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/yeast.jpg')) ?? undefined,
        unit: Unit.GRAMM,
        calorificValue: { kcal: 127, nUnits: 100 }
    });

    const bread = await createRecipe({
        title: "Weizenbrot",
        cachedImageSrc: await createTemporaryUriOfStaticFile(require('../../assets/bread.jpg')) ?? undefined,
        ingredientsForOnePortion: [
            { amount: 500, ingredient: flour },
            { amount: 10, ingredient: salt },
            { amount: 21, ingredient: yeast },
            { amount: 0.3, ingredient: water }
        ],
        description: breadDescription,
        isFavorite: false,
        tags: ["Brot", "Vegan", "Vegetarisch"],
        preparationTime: Duration.ofHoursAndMinutes(2, 45),
        difficulty: RecipeDifficulty.EASY
    });


    const burgerBuns = await createIngredient({
        name: "Burgerbrötchen",
        unit: Unit.PIECE,
        calorificValue: { kcal: 300, nUnits: 1 },
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/burger-buns.jpg')) ?? undefined,
    });
    const burgerSauce = await createIngredient({
        name: "Burger Sauce",
        unit: Unit.GRAMM,
        calorificValue: { kcal: 407, nUnits: 100 },
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/burger-sauce.jpg')) ?? undefined,
    });
    const onion = await createIngredient({
        name: "Zwiebel",
        pluralName: "Zwiebeln",
        unit: Unit.PIECE,
        calorificValue: { kcal: 40, nUnits: 1 },
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/onion.jpg')) ?? undefined,
    });
    const lettuceLeaf = await createIngredient({
        name: "Salatblatt",
        pluralName: "Salatblätter",
        unit: Unit.PIECE,
        calorificValue: { kcal: 2, nUnits: 1 },
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/lettuce.jpg')) ?? undefined,
    });
    const cheese = await createIngredient({
        name: "Cheddarscheibe",
        pluralName: "Cheddarscheiben",
        unit: Unit.PIECE,
        calorificValue: { kcal: 113, nUnits: 1 },
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/cheese.jpg')) ?? undefined,
    });
    const meat = await createIngredient({
        name: "Hackfleisch",
        unit: Unit.GRAMM,
        calorificValue: { kcal: 241, nUnits: 100 },
        temporaryImageUri: await createTemporaryUriOfStaticFile(require('../../assets/minced-meat.jpg')) ?? undefined,
    });

    const burger = await createRecipe({
        title: "Cheeseburger",
        description: burgerDescription,
        ingredientsForOnePortion: [
            { amount: 1, ingredient: burgerBuns },
            { amount: 15, ingredient: burgerSauce },
            { amount: 0.5, ingredient: onion },
            { amount: 2, ingredient: lettuceLeaf },
            { amount: 2, ingredient: cheese },
            { amount: 100, ingredient: meat }
        ],
        isFavorite: true,
        tags: ["Burger", "American"],
        difficulty: RecipeDifficulty.MEDIUM,
        preparationTime: Duration.ofMinutes(45),
        cachedImageSrc: await createTemporaryUriOfStaticFile(require('../../assets/burger.jpg')) ?? undefined,
    });

    return {
        ingredients: [burgerBuns, burgerSauce, onion, lettuceLeaf, meat, cheese, water, flour, salt, yeast],
        recipes: [burger, bread]
    };
}

export function createInitTableIfNotExists() {
    database.execSync(
        `
        CREATE TABLE IF NOT EXISTS Initial(
            initial INTEGER PRIMARY KEY
        );
        `
    );
}


const burgerDescription = `Zwiebeln in Ringe oder Halbringe schneiden, nicht zu dünn.
Zwiebeln kochen Öl in eine Pfanne geben, Zwiebeln braten bis sie leicht braun sind, saftig halten. Warm stellen.
Salatblätter waschen und portionieren, passend zu den Brötchen.
Käsescheiben aus dem Kühlschrank nehmen und portionieren.
100g Hackfleisch pro Patty mit Salz und Pfeffer mischen, etwas größer als Brötchen formen, am Ende beide Seiten würzen.
Burgerbrötchen vorbereiten und Pfanne vorheizen. Brötchen und Soße bereitstellen. Pfanne mit Öl für Patties auf hoher Temperatur vorheizen, Brötchen toasten.

Patties in der heißen Pfanne braten, regelmäßig wenden (ca. 1 Minute pro Seite) bis Kruste entsteht. Hitze reduzieren, bis gewünschte Garstufe erreicht ist.
Butter auf beide Seiten des Patties geben und schmelzen lassen. Kurz vor dem Ende 2 Käsescheiben auf das Patty legen und schmelzen lassen.

Geröstete Brötchen leicht abkühlen lassen (ca. 30 Sekunden). Beide Brötchenhälften mit Burgersoße, gebratenen Zwiebeln und je 1 Salatblatt belegen.
Servieren Patty mit geschmolzenem Käse auf den Burger legen und servieren.`;

const breadDescription = `Löse die Hefe in lauwarmem Wasser auf. Das Mehl und Salz in einer großen Schüssel vermengen und die Hefe-Wasser-Mischung dazu geben. Die Zutaten zu einem glatten Teig kneten. Falls nötig, Konsistenz mit etwas mehr Mehl oder Wasser anpassen.

Den Teig auf einer bemehlten Arbeitsfläche etwa 10 Minuten kräftig kneten, bis er elastisch ist. Teig zu einer Kugel formen und diesen in einer abgedeckten Schüssel an einem warmen Ort eine Stunde gehen lassen, bis er sich verdoppelt hat.

Nach dem Aufgehen den Teig kurz durchkneten, zu einem Laib formen und auf ein mit Backpapier ausgelegtes Backblech legen. Nochmals 30 Minuten gehen lassen. Den Ofen auf 220 Grad Celsius vorheizen, den Laib oben einschneiden und 25-30 Minuten backen, bis das Brot goldbraun ist und beim Klopfen hohl klingt.

Das Brot aus dem Ofen nehmen und auf einem Gitter auskühlen lassen.`;