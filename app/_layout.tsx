import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';


import { setDatabaseJournalingToWal } from '@/data/database/Database';
import { createIngredientTableIfNotExists } from '@/data/dao/IngredientDao';
import IngredientContextProvider from '@/context/IngredientContextProvider';
import ShoppingListContextProvider from '@/context/ShoppingListContextProvider';
import RecipeContextProvider from '@/context/RecipeContextProvider';
import { useColorScheme } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initializeApplication();
    SplashScreen.hideAsync();
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

function initializeApplication() {
  createIngredientTableIfNotExists();
  setDatabaseJournalingToWal();
}

