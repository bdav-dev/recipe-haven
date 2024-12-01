import { createContext, useContext, useEffect, useState } from "react";
import { RecipeContext } from "./RecipeContextProvider";
import { ShoppingListContext } from "./ShoppingListContextProvider";
import { Ingredient } from "@/types/IngredientTypes";
import { ContextProviderProps } from "@/types/MiscellaneousTypes";
import { getAllIngredients } from "@/data/dao/IngredientDao";

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
      .then(ing => setIngredients(ing));
  }, []);

  // HIER: wird dann meine methode für die custom items und die shoppinglist sachen (nur eine methode für ingredient und custom item entries!)
  // geholt!
  useEffect(() => {
    // setRecipes([]); // TODO: getAllRecipes() from DAO
    // setShoppingList({ customItems: [], ingredientItems: [] }); // TODO: getShoppingList() from DAO
  }, [ingredients]);

  return (
    <IngredientContext.Provider value={{ ingredients, setIngredients }}>
      {props.children}
    </IngredientContext.Provider>
  );
}