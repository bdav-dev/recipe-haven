import { Recipe } from "@/types/RecipeTypes";
import { ContextProviderProps } from "@/types/TechnicalTypes";
import { createContext, useState } from "react";

type RecipeContext = {
  recipes: Recipe[],
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>
}

export const RecipeContext = createContext<RecipeContext>({
  recipes: [],
  setRecipes: () => { }
});

export default function RecipeContextProvider(props: ContextProviderProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes }}>
      {props.children}
    </RecipeContext.Provider>
  );
}