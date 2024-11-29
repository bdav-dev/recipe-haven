import { createContext, useContext, useEffect, useState } from "react";
import { RecipeContext } from "./RecipeContextProvider";
import { ShoppingListContext } from "./ShoppingListContextProvider";
import { Ingredient } from "@/types/IngredientTypes";
import { ContextProviderProps } from "@/types/MiscellaneousTypes";
import { getAllIngredients } from "@/data/dao/IngredientDao";
import { getAllRecipes } from "@/data/dao/RecipeDao";

type IngredientContext = {
  ingredients: Ingredient[],
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>
}

export const IngredientContext = createContext<IngredientContext>({
  ingredients: [],
  setIngredients: () => { }
});

export default function IngredientContextProvider(props: ContextProviderProps) {
  const { setRecipes } = useContext(RecipeContext);
  const { setShoppingList } = useContext(ShoppingListContext);

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    getAllIngredients()
      .then(setIngredients);
  }, []);

  useEffect(() => {
    getAllRecipes(ingredients)
      .then(setRecipes);

    setShoppingList({ customItems: [], ingredientItems: [] }); // TODO: getShoppingList() from DAO
  }, [ingredients]);

  return (
    <IngredientContext.Provider value={{ ingredients, setIngredients }}>
      {props.children}
    </IngredientContext.Provider>
  );
}