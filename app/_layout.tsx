import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';


import { initializeDatabase } from '@/database/Database';
import { createIngredientTableIfNotExists, deleteAllIngredients } from '@/database/IngredientDao';
import IngredientContextProvider from '@/context/IngredientContextProvider';
import ShoppingListContextProvider from '@/context/ShoppingListContextProvider';
import RecipeContextProvider from '@/context/RecipeContextProvider';
import { useColorScheme } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initDb();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RecipeContextProvider>
        <ShoppingListContextProvider>
          <IngredientContextProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </IngredientContextProvider>
        </ShoppingListContextProvider>
      </RecipeContextProvider>
    </ThemeProvider>
  );
}

async function initDb() {
  initializeDatabase();
  createIngredientTableIfNotExists();
  // deleteAllIngredients();

  
}

