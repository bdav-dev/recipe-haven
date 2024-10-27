import { ContextProviderProps } from "@/types/OtherTypes";
import { createContext, useEffect, useState } from "react";

type ShoppingListContext = {
  shoppingList: ShoppingList,
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingList>>
}

export const ShoppingListContext = createContext<ShoppingListContext>({
  shoppingList: { customItems: [], ingredientItems: [] },
  setShoppingList: () => { }
});

export default function ShoppingListContextProvider(props: ContextProviderProps) {
  const [shoppingList, setShoppingList] = useState<ShoppingList>({ customItems: [], ingredientItems: [] });

  useEffect(() => {
    console.log("ShoppingList geändert");
  }, [shoppingList]);

  return (
    <ShoppingListContext.Provider value={{ shoppingList, setShoppingList }}>
      {props.children}
    </ShoppingListContext.Provider>
  );
}