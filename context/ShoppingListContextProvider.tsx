import { ContextProviderProps } from "@/types/MiscellaneousTypes";
import { ShoppingList } from "@/types/ShoppingListTypes";
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
  const [shoppingList, setShoppingList] = useState<ShoppingList>(getInitialState());

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
