import { Storefront } from '@/components/Storefront';
import { selectProductsSortedByDate } from '@/features/products/products.selectors';
import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const products = useAppSelector(selectProductsSortedByDate);

  return (
    <View style={styles.container}>
      <Storefront products={products} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});