import { createContext, useContext, useEffect, useState } from "react";
import { RecipeContext } from "./RecipeContextProvider";
import { ShoppingListContext } from "./ShoppingListContextProvider";
import { Ingredient } from "@/types/IngredientTypes";
import { ContextProviderProps } from "@/types/TechnicalTypes";

type IngredientContext = {
  ingredients: Ingredient[],
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>
}

export const IngredientContext = createContext<IngredientContext>({
  ingredients: [],
  setIngredients: () => { }
});

export default function IngredientContextProvider(props: ContextProviderProps) {
  const { recipes, setRecipes } = useContext(RecipeContext);
  const { shoppingList, setShoppingList } = useContext(ShoppingListContext);

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    setRecipes([]); // TODO: getAllRecipes() from DAO
    setShoppingList({ customItems: [], ingredientItems: [] }); // TODO: getShoppingList() from DAO
  }, [ingredients]);

  return (
    <IngredientContext.Provider value={{ ingredients, setIngredients }}>
      {props.children}
    </IngredientContext.Provider>
  );
}