import { ThemedText } from "@/components/themed/ThemedText";
import { IngredientContext } from "@/context/IngredientContextProvider";
import { Ingredient } from "@/types/MainAppTypes";
import { useContext } from "react";
import { Button, View } from "react-native";

export default function ShoppingListScreen() {

  const { ingredients, setIngredients } = useContext(IngredientContext);

  const ingredient: Ingredient = {
    name: "test",
    unit: 1
  }

  return (
    <View>
      <ThemedText>Shopping List</ThemedText>

      <Button title="Test" onPress={() => { setIngredients(() => [ ingredient ]) }} />
    </View>
  );
}