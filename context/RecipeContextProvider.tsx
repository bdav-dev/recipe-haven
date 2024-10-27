import { ContextProviderProps } from "@/types/OtherTypes";
import { createContext, useEffect, useState } from "react";

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

  useEffect(() => {
    console.log("Recipes geändert");
  }, [recipes]);

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes }}>
      {props.children}
    </RecipeContext.Provider>
  );
}