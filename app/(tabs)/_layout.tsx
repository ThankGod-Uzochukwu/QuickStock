import { Colors } from '@/constants/theme';
import { selectCartItemCount } from '@/features/cart/cart.selectors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSelector } from '@/store/hooks';
import { store } from '@/store/store';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Provider } from 'react-redux';

function TabsContent() {
  const colorScheme = useColorScheme();
  const cartCount = useAppSelector(selectCartItemCount);

  return (
    <Tabs
      initialRouteName="cart"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopColor: colorScheme === 'dark' ? '#1F262C' : '#E6E0D6',
          height: 64,
        },
        tabBarBadgeStyle: {
          backgroundColor: Colors[colorScheme].tint,
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
        // tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <AntDesign size={26} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarIcon: ({ color }) => <Ionicons size={26} name="bag-handle" color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <AntDesign size={28} name="paperplane" color={color} />,
        }}
      /> */}
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <Provider store={store}>
      <TabsContent />
    </Provider>
  );
}
