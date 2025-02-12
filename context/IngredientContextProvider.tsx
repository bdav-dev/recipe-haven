import { createContext, useContext, useEffect, useState } from "react";
import { RecipeContext } from "./RecipeContextProvider";
import { ShoppingListContext } from "./ShoppingListContextProvider";
import { Ingredient } from "@/types/IngredientTypes";
import { ContextProviderProps } from "@/types/MiscellaneousTypes";
import { getAllIngredients } from "@/data/dao/IngredientDao";
import { getAllRecipes } from "@/data/dao/RecipeDao";
import { getAllShoppingListItems } from "@/data/dao/ShoppingListDao"; // Update import

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

  // HIER: wird dann meine methode für die custom items und die shoppinglist sachen (nur eine methode für ingredient und custom item entries!)
  // geholt!
  useEffect(() => {
    getAllRecipes(ingredients)
      .then(setRecipes)
      .catch(_e => setRecipes([]));

    getAllShoppingListItems()
      .then(setShoppingList)
      .catch(_e => setShoppingList({ customItems: [], ingredientItems: [] }));
  }, [ingredients]);

  return (
    <IngredientContext.Provider value={{ ingredients, setIngredients }}>
      {props.children}
    </IngredientContext.Provider>
  );
}