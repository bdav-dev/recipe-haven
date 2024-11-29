import { ThemedText } from '@/components/themed/ThemedText';
import { RecipeContext } from '@/context/RecipeContextProvider';
import { useContext } from 'react';
import { View } from 'react-native';


export default function RecipesScreen() {

  const { recipes } = useContext(RecipeContext);

  return (
    <View>

      <ThemedText>
        Recipes
      </ThemedText>

      <ThemedText>
        {JSON.stringify(recipes)}
      </ThemedText>

    </View>
  );
}
