import { Duration } from "@/data/misc/Duration";
import { QuantizedIngredient } from "@/types/IngredientTypes";
import { ContextProviderProps } from "@/types/MiscellaneousTypes";
import { Recipe, RecipeDifficulty } from "@/types/RecipeTypes";
import { isBlank } from "@/utils/StringUtils";
import { createContext, Dispatch, useState } from "react";

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
        }
    },
    mount: (recipe: Recipe) => void,
    toRecipe: () => (Omit<Recipe, 'recipeId' | 'imageSrc'> & { cachedImageSrc?: string }) | undefined,
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
        }
    },
    mount: () => { },
    toRecipe: () => undefined,
    reset: () => { }
};

export const FrontendRecipeHolderContext = createContext<FrontendRecipeHolderContext>(empty);

export default function FrontendRecipeHolderContextProvider(props: ContextProviderProps) {
    const [imageSrc, setImageSrc] = useState<string>();
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState<RecipeDifficulty>();
    const [preparationTimeHours, setPreparationTimeHours] = useState<string>('');
    const [preparationTimeMinutes, setPreparationTimeMinutes] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<QuantizedIngredient[]>([]);
    const [description, setDescription] = useState('');

    function toRecipe(): (Omit<Recipe, 'recipeId' | 'imageSrc'> & { cachedImageSrc?: string }) | undefined {

        if (isBlank(title)) {
            return undefined;
        }

        const preparationTime = calculatePreparationTime();

        return {
            title: title,
            cachedImageSrc: imageSrc,
            description: description,
            ingredientsForOnePortion: ingredients,
            isFavorite: false,
            tags: tags,
            difficulty: difficulty,
            preparationTime
        }
    }

    function calculatePreparationTime() {
        if (isBlank(preparationTimeHours) && isBlank(preparationTimeMinutes)) {
            return undefined;

        } else {
            const hours = +preparationTimeHours;
            const minutes = +preparationTimeMinutes;

            if (isNaN(hours) || isNaN(minutes)) {
                return undefined;
            }

            return Duration.ofHoursAndMinutes(hours, minutes);
        }
    }

    function reset() {
        // TODO
    }

    function mount(recipe: Recipe) {
        // TODO
        setTitle(recipe.title);
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
                    }
                },
                mount,
                toRecipe,
                reset
            }}
        >
            {props.children}
        </FrontendRecipeHolderContext.Provider>
    );
}