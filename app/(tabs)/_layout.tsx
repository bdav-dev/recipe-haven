import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="shoppingList"
        options={{
          title: 'Einkaufsliste',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="index"

        options={{
          title: 'Rezepte',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} size={26}/>
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
