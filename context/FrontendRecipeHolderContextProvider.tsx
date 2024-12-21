import { Duration } from "@/data/misc/Duration";
import { QuantizedIngredient } from "@/types/IngredientTypes";
import { ContextProviderProps } from "@/types/MiscellaneousTypes";
import { Recipe, CreateRecipeBlueprint as CreateRecipeBlueprint, RecipeDifficulty } from "@/types/RecipeTypes";
import { isBlank } from "@/utils/StringUtils";
import { createContext, Dispatch, useContext, useState } from "react";
import { RecipeContext } from "./RecipeContextProvider";
import { isPositiveInteger } from "@/utils/MathUtils";
import { UpdateRecipeBlueprint } from "@/types/dao/RecipeDaoTypes";


type FrontendRecipeHolderContext = {
    states: {
        imageSrc: {
            value: string | undefined,
            set: Dispatch<React.SetStateAction<string | undefined>>,
            clear: () => void
        },
        title: {
            value: string,
            set: Dispatch<React.SetStateAction<string>>
        },
        difficulty: {
            value: RecipeDifficulty | undefined,
            set: Dispatch<React.SetStateAction<RecipeDifficulty | undefined>>
        },
        preparationTime: {
            hours: {
                value: string,
                set: Dispatch<React.SetStateAction<string>>
            },
            minutes: {
                value: string,
                set: Dispatch<React.SetStateAction<string>>
            }
        },
        tags: {
            value: string[],
            set: Dispatch<React.SetStateAction<string[]>>
        },
        ingredients: {
            value: QuantizedIngredient[],
            set: Dispatch<React.SetStateAction<QuantizedIngredient[]>>
        },
        description: {
            value: string,
            set: Dispatch<React.SetStateAction<string>>
        },
        amountOfPortions: {
            value: string,
            set: Dispatch<React.SetStateAction<string>>
        }
    },
    mount: (recipe: Recipe) => void,
    toRecipe: () => CreateRecipeBlueprint,
    toRecipeUpdate: (originalRecipe: Recipe) => UpdateRecipeBlueprint
    reset: () => void
}

const empty: FrontendRecipeHolderContext = {
    states: {
        imageSrc: {
            value: undefined,
            set: () => { },
            clear: () => { }
        },
        title: {
            value: '',
            set: () => { }
        },
        difficulty: {
            value: undefined,
            set: () => { }
        },
        preparationTime: {
            hours: {
                value: '',
                set: () => { }
            },
            minutes: {
                value: '',
                set: () => { }
            },
        },
        tags: {
            value: [],
            set: () => { }
        },
        ingredients: {
            value: [],
            set: () => { }
        },
        description: {
            value: '',
            set: () => { }
        },
        amountOfPortions: {
            value: '',
            set: () => { }
        }
    },
    mount: () => { },
    toRecipe: () => { throw Error() },
    reset: () => { },
    toRecipeUpdate: (originalRecipe: Recipe) => { throw Error() }
};

export const FrontendRecipeHolderContext = createContext<FrontendRecipeHolderContext>(empty);

export default function FrontendRecipeHolderContextProvider(props: ContextProviderProps) {
    const { recipes } = useContext(RecipeContext);

    const [imageSrc, setImageSrc] = useState<string>();
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState<RecipeDifficulty>();
    const [preparationTimeHours, setPreparationTimeHours] = useState<string>('');
    const [preparationTimeMinutes, setPreparationTimeMinutes] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<QuantizedIngredient[]>([]);
    const [description, setDescription] = useState('');
    const [amountOfPortions, setAmountOfPortions] = useState('1');

    function toRecipe(): CreateRecipeBlueprint {
        if (isBlank(title)) {
            throw Error("Du hast vergessen dem Rezept einen Namen zu geben.");
        }
        if (recipes.find(recipe => recipe.title == title.trim())) {
            throw Error(`Du hast bereits ein Rezept mit dem Namen '${title.trim()}' im Rezeptbuch.`);
        }
        if (ingredients.length == 0) {
            throw Error('Du hast vergessen dem Rezept Zutaten hinzuzufügen.');
        }
        const amountOfPortionsAsInteger = +amountOfPortions;
        if (!isPositiveInteger(amountOfPortionsAsInteger)) {
            throw Error(`Die Anzahl der Portionen muss eine positive Ganzzahl sein.`);
        }

        return {
            title,
            cachedImageSrc: imageSrc,
            description,
            ingredientsForOnePortion: normalizeIngredients(amountOfPortionsAsInteger, ingredients),
            isFavorite: false,
            tags,
            difficulty,
            preparationTime: calculatePreparationTime(preparationTimeHours, preparationTimeMinutes)
        }
    }

    function toRecipeUpdate(originalRecipe: Recipe): UpdateRecipeBlueprint {
        if (isBlank(title)) {
            throw Error("Du hast vergessen dem Rezept einen Namen zu geben.");
        }
        if (recipes.find(recipe => recipe.title == title.trim() && recipe.recipeId != originalRecipe.recipeId)) {
            throw Error(`Du hast bereits ein Rezept mit dem Namen '${title.trim()}' im Rezeptbuch.`);
        }
        if (ingredients.length == 0) {
            throw Error('Du hast vergessen dem Rezept Zutaten hinzuzufügen.');
        }
        const amountOfPortionsAsInteger = +amountOfPortions;
        if (!isPositiveInteger(amountOfPortionsAsInteger)) {
            throw Error(`Die Anzahl der Portionen muss eine positive Ganzzahl sein.`);
        }

        return {
            originalRecipe,
            updatedValues: {
                description,
                ingredientsForOnePortion: normalizeIngredients(amountOfPortionsAsInteger, ingredients),
                isFavorite: originalRecipe.isFavorite,
                tags,
                title,
                difficulty,
                imageSrc,
                preparationTime: calculatePreparationTime(preparationTimeHours, preparationTimeMinutes)
            }
        }
    }

    function normalizeIngredients(amountOfPortions: number, quantizedIngredients: QuantizedIngredient[]): QuantizedIngredient[] {
        return quantizedIngredients
            .map(qIng => ({
                amount: qIng.amount / amountOfPortions,
                ingredient: qIng.ingredient
            }));
    }

    function calculatePreparationTime(preparationTimeHours: string, preparationTimeMinutes: string): Duration | undefined {
        if (isBlank(preparationTimeHours) && isBlank(preparationTimeMinutes)) {
            return undefined;

        } else {
            const hours = +preparationTimeHours;
            const minutes = +preparationTimeMinutes;

            if (isNaN(hours) || isNaN(minutes)) {
                return undefined;
            }

            if (hours < 0 || minutes < 0) {
                return undefined
            }

            if (hours == 0 && minutes == 0) {
                return undefined;
            }

            return Duration.ofHoursAndMinutes(hours, minutes);
        }
    }

    function reset() {
        setImageSrc(undefined);
        setTitle('');
        setDifficulty(undefined);
        setPreparationTimeHours('');
        setPreparationTimeMinutes('');
        setTags([]);
        setIngredients([]);
        setDescription('');
        setAmountOfPortions('1');
    }

    function mount(recipe: Recipe) {
        setImageSrc(recipe.imageSrc);
        setTitle(recipe.title);
        setDifficulty(recipe.difficulty);
        setPreparationTimeHours(recipe.preparationTime ? recipe.preparationTime.asHoursAndMinutes().hours.toString() : '');
        setPreparationTimeMinutes(recipe.preparationTime ? recipe.preparationTime.asHoursAndMinutes().minutes.toString() : '');
        setTags([...recipe.tags]);
        setIngredients(recipe.ingredientsForOnePortion.map(recipeIngredient => ({ ...recipeIngredient })));
        setDescription(recipe.description);
        setAmountOfPortions('1');
    }

    return (
        <FrontendRecipeHolderContext.Provider
            value={{
                states: {
                    imageSrc: {
                        value: imageSrc,
                        set: setImageSrc,
                        clear: () => setImageSrc(undefined)
                    },
                    title: {
                        value: title,
                        set: setTitle
                    },
                    difficulty: {
                        value: difficulty,
                        set: setDifficulty
                    },
                    preparationTime: {
                        hours: {
                            value: preparationTimeHours,
                            set: setPreparationTimeHours
                        },
                        minutes: {
                            value: preparationTimeMinutes,
                            set: setPreparationTimeMinutes
                        }
                    },
                    tags: {
                        value: tags,
                        set: setTags
                    },
                    ingredients: {
                        value: ingredients,
                        set: setIngredients
                    },
                    description: {
                        value: description,
                        set: setDescription
                    },
                    amountOfPortions: {
                        value: amountOfPortions,
                        set: setAmountOfPortions
                    }
                },
                mount,
                toRecipe,
                reset,
                toRecipeUpdate
            }}
        >
            {props.children}
        </FrontendRecipeHolderContext.Provider>
    );
}