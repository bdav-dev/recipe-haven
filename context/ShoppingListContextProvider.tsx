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
  const [shoppingList, setShoppingList] = useState<ShoppingList>({ 
    customItems: [],
    ingredientItems: [] 
  });

  // Custom items bei start der App laden
  useEffect(() => {
    getAllCustomItems()
      .then(customItems => {
        console.log('Loading custom items:', customItems);
        setShoppingList(current => ({
          ...current,
          customItems
        }));
      })
      .catch(error => {
        console.error('Failed to load custom items:', error);
      });
  }, []);

  return (
    <ShoppingListContext.Provider value={{ shoppingList, setShoppingList }}>
      {props.children}
    </ShoppingListContext.Provider>
  );
}
