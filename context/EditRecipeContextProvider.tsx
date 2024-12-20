import { QuantizedIngredient } from "@/types/IngredientTypes";
import { ContextProviderProps } from "@/types/MiscellaneousTypes";
import { Recipe, RecipeDifficulty } from "@/types/RecipeTypes";
import { createContext, Dispatch, useState } from "react";

type EditRecipeContext = {
    states: {
        imageSrc: {
            value: string | undefined,
            set: Dispatch<React.SetStateAction<string | undefined>>,
            clear: () => void
        },
        recipeName: {
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
        quantizedIngredients: {
            value: QuantizedIngredient[],
            set: Dispatch<React.SetStateAction<QuantizedIngredient[]>>
        },
        description: {
            value: string,
            set: Dispatch<React.SetStateAction<string>>
        }
    },
    mount: (recipe: Recipe) => void,
    toRecipe: () => Recipe | undefined,
    reset: () => void
}

const empty: EditRecipeContext = {
    states: {
        imageSrc: {
            value: undefined,
            set: () => { },
            clear: () => { }
        },
        recipeName: {
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
        quantizedIngredients: {
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

export const EditRecipeContext = createContext<EditRecipeContext>(empty);

export default function EditRecipeContextProvider(props: ContextProviderProps) {
    const [imageSrc, setImageSrc] = useState<string>();
    const [recipeName, setRecipeName] = useState('');
    const [difficulty, setDifficulty] = useState<RecipeDifficulty>();
    const [preparationTimeHours, setPreparationTimeHours] = useState<string>('');
    const [preparationTimeMinutes, setPreparationTimeMinutes] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [quantizedIngredients, setQuantizedIngredients] = useState<QuantizedIngredient[]>([]);
    const [description, setDescription] = useState('');

    function toRecipe(): Recipe | undefined {
        // TODO
        return undefined;
    }

    function reset() {
        // TODO
    }

    function mount(recipe: Recipe) {
        // TODO
        setRecipeName(recipe.title);
    }

    return (
        <EditRecipeContext.Provider
            value={{
                states: {
                    imageSrc: {
                        value: imageSrc,
                        set: setImageSrc,
                        clear: () => setImageSrc(undefined)
                    },
                    recipeName: {
                        value: recipeName,
                        set: setRecipeName
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
                    quantizedIngredients: {
                        value: quantizedIngredients,
                        set: setQuantizedIngredients
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
        </EditRecipeContext.Provider>
    );
}