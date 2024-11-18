import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { useAppTheme } from '@/hooks/useAppTheme';


export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerTintColor: theme.text,
        headerStyle: {
          backgroundColor: theme.card,
        },
        tabBarStyle: {
          backgroundColor: theme.card,
          borderColor: theme.border
        },
        sceneStyle: {
          backgroundColor: theme.background
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.icon.secondary,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="shoppingList"
        options={{
          title: 'Einkaufsliste',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Rezepte',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: 'Zutaten',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'nutrition' : 'nutrition-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
