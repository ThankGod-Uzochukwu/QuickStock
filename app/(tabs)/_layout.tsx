import { selectCartItemCount } from '@/features/cart/cart.selectors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSelector } from '@/store/hooks';
import { colors } from '@/styles/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const cartCount = useAppSelector(selectCartItemCount);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surfaceElevated,
          borderTopColor: theme.border,
          height: 76,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="storefront-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrap}>
              <Ionicons size={24} name="bag-handle-outline" color={color} />
              {cartCount > 0 ? <Text style={[styles.badge, { backgroundColor: theme.primary }]}>{cartCount}</Text> : null}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -12,
    top: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    overflow: 'hidden',
  },
});
