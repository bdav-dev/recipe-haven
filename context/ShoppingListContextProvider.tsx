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

// Ist wahrscheinlich aufgrund dieses contexts so... ich nutze nicht nur ein array, sondern habe auch noch custom items und ingredient items
export const ShoppingListContext = createContext<ShoppingListContext>({
  shoppingList: { customItems: [], ingredientItems: [] },
  setShoppingList: () => { }
});

export default function ShoppingListContextProvider(props: ContextProviderProps) {

  //const { setRecipes } = useContext(RecipeContext);
  //const { setIngredients } = useContext(IngredientContext);

  // Hier wird die shoppinglist geholt und dann in den state gesetzt, allerdings falsch!
  const [shoppingList, setShoppingList] = useState<ShoppingList>({ 
    customItems: [],
    ingredientItems: [] 
  });

  // HIER IST DAS DOCH DRIN! Aber, syntax komisch: current, current => ... ist comi
  // CURRENT: Objekt mit custom items mit leeren Array
  // ingredientItem ist genauso leer
  // key von customItems ist dann quasie 2x drin! 
  // Fix: 
  useEffect(() => {
    getAllCustomItems()
      .then(items => setShoppingList(current => ({
        ...current,
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
