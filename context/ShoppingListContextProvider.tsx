import { ContextProviderProps } from "@/types/MiscellaneousTypes";
import { ShoppingList } from "@/types/ShoppingListTypes";
import { createContext, useContext, useEffect, useState } from "react";
import { getAllCustomItems } from "@/data/dao/ShoppingListDao";

type ShoppingListContext = {
  shoppingList: ShoppingList,
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingList>>
}

export const ShoppingListContext = createContext<ShoppingListContext>({
  shoppingList: { customItems: [], ingredientItems: [] },
  setShoppingList: () => { }
});

export default function ShoppingListContextProvider(props: ContextProviderProps) {

  // TODO: implement this l8r
  // const { setRecipes } = useContext(RecipeContext);
  // const { setIngredients } = useContext(IngredientContext);

  const [shoppingList, setShoppingList] = useState<ShoppingList>(getInitialState());

  const initializeCustomItems = async () => {
    try {
      const customItems = await getAllCustomItems();
      console.debug('Loaded custom items:', customItems);
      setShoppingList(current => ({
        ...current,
        customItems
      }));
    } catch (error) {
      console.error('Failed to load custom items:', error);
    }
  };

  useEffect(() => {
    initializeCustomItems();
  }, []);

  return (
    <ShoppingListContext.Provider value={{ shoppingList, setShoppingList }}>
      {props.children}
    </ShoppingListContext.Provider>
  );
}

function getInitialState(): ShoppingList {
  return {
    customItems: [],
    ingredientItems: []
  };
}
