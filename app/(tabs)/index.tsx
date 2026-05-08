/**
 * Product listing screen.
 * 
 * Browse, search, filter, and add items to cart.
 */

import { AddProductForm } from '@/components/AddProductForm';
import { FilterPill } from '@/components/FilterPill';
import { ProductList } from '@/components/ProductList';
import { SearchBar } from '@/components/SearchBar';
import { addToCart } from '@/features/cart/cart.actions';
import { selectCartQuantityMap } from '@/features/cart/cart.selectors';
import { addProduct, loadProducts } from '@/features/products/products.actions';
import {
  selectIsProductLimitReached,
  selectProductsError,
  selectProductsLoading,
  selectProductsSortedByDate,
  selectRemainingProductSlots,
} from '@/features/products/products.selectors';
import { Product, PRODUCT_LIMITS } from '@/features/products/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { borderRadius, colors, spacing, touchTarget, typography } from '@/styles/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PriceFilter = 'all' | 'under-50' | '50-200' | 'over-200';
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';
type Theme = typeof colors.light;

const PRICE_FILTERS: Array<{ label: string; value: PriceFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Under $50', value: 'under-50' },
  { label: '$50-$200', value: '50-200' },
  { label: '$200+', value: 'over-200' },
];

const SORT_OPTIONS: Array<{ label: string; value: SortOption }> = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low', value: 'price-asc' },
  { label: 'Price: High', value: 'price-desc' },
  { label: 'Name', value: 'name' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme: Theme = colors[colorScheme || 'light'];
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const products = useAppSelector(selectProductsSortedByDate);
  const cartQuantities = useAppSelector(selectCartQuantityMap);
  const isLimitReached = useAppSelector(selectIsProductLimitReached);
  const remainingSlots = useAppSelector(selectRemainingProductSlots);
  const productsLoading = useAppSelector(selectProductsLoading);
  const productsError = useAppSelector(selectProductsError);

  const columns = width >= 900 ? 3 : width >= 560 ? 2 : 1;

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    let result = products;

    if (normalizedQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(normalizedQuery)
      );
    }

    switch (priceFilter) {
      case 'under-50':
        result = result.filter((product) => product.price < 50);
        break;
      case '50-200':
        result = result.filter((product) => product.price >= 50 && product.price <= 200);
        break;
      case 'over-200':
        result = result.filter((product) => product.price > 200);
        break;
      default:
        break;
    }

    const sorted = [...result];
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return sorted;
  }, [products, searchQuery, priceFilter, sortOption]);

  const handleAddProduct = async (name: string, price: number, imageUri: string) => {
    await dispatch(addProduct(name, price, imageUri));
    setShowAddModal(false);
  };

  const handleOpenAddModal = () => {
    if (isLimitReached) {
      Alert.alert(
        'Limit Reached',
        `You can only add up to ${PRODUCT_LIMITS.MAX_PRODUCTS} products.`,
        [{ text: 'OK' }]
      );
      return;
    }
    setShowAddModal(true);
  };

  const handleSelectProduct = (product: Product) => {
    router.push({ pathname: '/(tabs)/product/[id]', params: { id: product.id } });
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product.id, 1));
  };

  const handleRetryLoad = () => {
    dispatch(loadProducts());
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.hero}>
        <View style={[styles.heroGlow, { backgroundColor: theme.primary }]} />
        <View style={[styles.heroAccent, { backgroundColor: theme.accent ?? theme.primary }]} />

        <View style={styles.heroContent}>
          <View style={styles.heroTopRow}>
            <View>
              <Text style={[styles.title, { color: theme.text.primary }]}>QuickStock</Text>
              <Text style={[styles.subtitle, { color: theme.text.secondary }]}
              >
                Fast catalog control for modern teams.
              </Text>
            </View>
            <Pressable
              onPress={handleOpenAddModal}
              style={({ pressed }) => [
                styles.addButton,
                { backgroundColor: theme.primary },
                pressed && styles.addButtonPressed,
              ]}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.heroStats}>
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}
            >
              <Text style={[styles.statValue, { color: theme.text.primary }]}>
                {products.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
                Products live
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}
            >
              <Text style={[styles.statValue, { color: theme.text.primary }]}>
                {remainingSlots}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
                Slots left
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <View style={styles.filterRow}>
          {PRICE_FILTERS.map((filter) => (
            <FilterPill
              key={filter.value}
              label={filter.label}
              selected={filter.value === priceFilter}
              onPress={() => setPriceFilter(filter.value)}
            />
          ))}
        </View>

        <View style={styles.filterRow}>
          {SORT_OPTIONS.map((option) => (
            <FilterPill
              key={option.value}
              label={option.label}
              selected={option.value === sortOption}
              onPress={() => setSortOption(option.value)}
            />
          ))}
        </View>
      </View>

      {productsError && (
        <View
          style={[
            styles.errorBanner,
            { backgroundColor: theme.error + '15', borderColor: theme.error + '35' },
          ]}
        >
          <Text style={[styles.errorText, { color: theme.error }]}>{productsError}</Text>
          <Pressable onPress={handleRetryLoad} style={styles.retryButton}>
            <Text style={[styles.retryText, { color: theme.error }]}>Retry</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.listContent}>
        {productsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text.secondary }]}>
              Refreshing catalog...
            </Text>
          </View>
        ) : (
          <ProductList
            products={filteredProducts}
            columns={columns}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            cartQuantities={cartQuantities}
            emptyTitle="Nothing found"
            emptyDescription="Try a different filter or clear the search."
          />
        )}
      </View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <AddProductForm onSubmit={handleAddProduct} onCancel={() => setShowAddModal(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  heroGlow: {
    position: 'absolute',
    right: -60,
    top: -40,
    height: 180,
    width: 180,
    borderRadius: 90,
    opacity: 0.18,
  },
  heroAccent: {
    position: 'absolute',
    left: -30,
    top: 20,
    height: 120,
    width: 120,
    borderRadius: 60,
    opacity: 0.14,
  },
  heroContent: {
    gap: spacing.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    fontFamily: typography.families.heading,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.sizes.sm,
    maxWidth: 220,
  },
  heroStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
  },
  addButton: {
    height: touchTarget.minSize,
    width: touchTarget.minSize,
    borderRadius: touchTarget.minSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  controls: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  errorBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  retryButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  retryText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  listContent: {
    flex: 1,
    marginTop: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: typography.sizes.sm,
  },
});