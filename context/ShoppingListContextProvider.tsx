import { ContextProviderProps } from "@/types/MiscellaneousTypes";
import { ShoppingList } from "@/types/ShoppingListTypes";
import { createContext, useContext, useEffect, useState } from "react";
import { getAllCustomItems } from "@/data/dao/ShoppingListDao";
import { RecipeContext } from "./RecipeContextProvider";
import { IngredientContext } from "./IngredientContextProvider";

type ShoppingListContext = {
  shoppingList: ShoppingList,
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingList>>
}

export const ShoppingListContext = createContext<ShoppingListContext>({
  shoppingList: { customItems: [], ingredientItems: [] },
  setShoppingList: () => { }
});

export default function ShoppingListContextProvider(props: ContextProviderProps) {

  //const { setRecipes } = useContext(RecipeContext);
  //const { setIngredients } = useContext(IngredientContext);

  const [shoppingList, setShoppingList] = useState<ShoppingList>({ 
    customItems: [],
    ingredientItems: [] 
  });

  useEffect(() => {
    getAllCustomItems()
      .then(items => setShoppingList(current => ({
        ingredientItems: current.ingredientItems,
        customItems: items
      })));
  }, []);

  return (
    <ShoppingListContext.Provider value={{ shoppingList, setShoppingList }}>
      {props.children}
    </ShoppingListContext.Provider>
  );
}