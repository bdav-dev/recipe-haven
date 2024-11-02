import { ShoppingList } from "@/types/ShoppingListTypes";
import { ContextProviderProps } from "@/types/TechnicalTypes";
import { createContext, useState } from "react";

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

  return (
    <ShoppingListContext.Provider value={{ shoppingList, setShoppingList }}>
      {props.children}
    </ShoppingListContext.Provider>
  );
}