import { addToCart, hydrateCart } from '@/features/cart/cart.actions';
import { selectCartItemCount } from '@/features/cart/cart.selectors';
import { loadProducts } from '@/features/products/products.actions';
import { selectProductsError, selectProductsLoading } from '@/features/products/products.selectors';
import { Product } from '@/features/products/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { borderRadius, colors, shadows, spacing, typography } from '@/styles/design-tokens';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';

import { catalogCategories } from '@/services/catalog/catalog.service';

interface StorefrontProps {
    products: Product[];
}

export function Storefront({ products }: StorefrontProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? colors.dark : colors.light;
    const loading = useAppSelector(selectProductsLoading);
    const error = useAppSelector(selectProductsError);
    const cartCount = useAppSelector(selectCartItemCount);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { width } = useWindowDimensions();

    const numColumns = width >= 900 ? 3 : width >= 640 ? 2 : 2;

    useEffect(() => {
        dispatch(loadProducts());
        dispatch(hydrateCart());
    }, [dispatch]);

    const filteredProducts = useMemo(() => {
        const needle = query.trim().toLowerCase();

        return products.filter((product) => {
            const matchesQuery =
                !needle ||
                product.name.toLowerCase().includes(needle) ||
                product.description.toLowerCase().includes(needle) ||
                product.tags.some((tag) => tag.toLowerCase().includes(needle));

            const matchesCategory = category === 'All' || product.category === category;

            return matchesQuery && matchesCategory;
        });
    }, [category, products, query]);

    const featuredProduct = filteredProducts.find((item) => item.featured) ?? filteredProducts[0];

    const handleAdd = async (productId: string) => {
        await dispatch(addToCart(productId));
        Alert.alert('Added to cart', 'The item is ready for checkout.');
    };

    const openDetail = (product: Product) => setSelectedProduct(product);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.backgroundOrbOne} />
            <View style={styles.backgroundOrbTwo} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.heroCard}>
                    <View style={styles.heroTopRow}>
                        <View style={styles.brandRow}>
                            <View style={[styles.brandBadge, { backgroundColor: theme.primary }]}>
                                <MaterialCommunityIcons name="shopping-outline" size={18} color="#fff" />
                            </View>
                            <View>
                                <Text style={[styles.kicker, { color: theme.text.secondary }]}>Modern commerce</Text>
                                <Text style={[styles.heroTitle, { color: theme.text.primary }]}>QuickStock Market</Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => router.push('/cart')}
                            style={({ pressed }) => [styles.cartButton, { backgroundColor: theme.surfaceElevated }, pressed && styles.pressed]}
                        >
                            <Ionicons name="bag-handle-outline" size={18} color={theme.primary} />
                            <Text style={[styles.cartButtonText, { color: theme.text.primary }]}>{cartCount}</Text>
                        </Pressable>
                    </View>

                    <Text style={[styles.heroCopy, { color: theme.text.secondary }]}>
                        Browse hand-picked gear, keep your cart synced, and complete a smooth mock checkout flow.
                    </Text>

                    <View style={styles.heroStatsRow}>
                        <View style={[styles.statPill, { backgroundColor: theme.accentSoft }]}>
                            <Text style={[styles.statValue, { color: theme.text.primary }]}>{products.length}</Text>
                            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Products</Text>
                        </View>
                        <View style={[styles.statPill, { backgroundColor: theme.accentSoft }]}>
                            <Text style={[styles.statValue, { color: theme.text.primary }]}>
                                {products.filter((item) => item.featured).length}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Featured</Text>
                        </View>
                        <View style={[styles.statPill, { backgroundColor: theme.accentSoft }]}>
                            <Text style={[styles.statValue, { color: theme.text.primary }]}>{cartCount}</Text>
                            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>In cart</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.searchCard, { backgroundColor: theme.surfaceElevated }, shadows.sm]}>
                    <Ionicons name="search" size={18} color={theme.text.tertiary} />
                    <TextInput
                        placeholder="Search products, tags, or categories"
                        placeholderTextColor={theme.text.tertiary}
                        value={query}
                        onChangeText={setQuery}
                        style={[styles.searchInput, { color: theme.text.primary }]}
                    />
                    {query ? (
                        <Pressable onPress={() => setQuery('')} hitSlop={10}>
                            <Ionicons name="close-circle" size={18} color={theme.text.secondary} />
                        </Pressable>
                    ) : null}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {catalogCategories.map((item) => {
                        const active = item === category;

                        return (
                            <Pressable
                                key={item}
                                onPress={() => setCategory(item)}
                                style={({ pressed }) => [
                                    styles.categoryChip,
                                    { backgroundColor: active ? theme.primary : theme.surfaceElevated, borderColor: active ? theme.primary : theme.border },
                                    pressed && styles.pressed,
                                ]}
                            >
                                <Text style={[styles.categoryChipText, { color: active ? '#fff' : theme.text.secondary }]}>{item}</Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {loading ? (
                    <View style={styles.loadingState}>
                        <ActivityIndicator size="large" color={theme.primary} />
                        <Text style={[styles.loadingText, { color: theme.text.secondary }]}>Loading the catalog...</Text>
                    </View>
                ) : error ? (
                    <View style={[styles.errorState, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                        <Ionicons name="cloud-offline-outline" size={28} color={theme.error} />
                        <Text style={[styles.errorTitle, { color: theme.text.primary }]}>Unable to load catalog</Text>
                        <Text style={[styles.errorCopy, { color: theme.text.secondary }]}>{error}</Text>
                        <Pressable onPress={() => dispatch(loadProducts())} style={[styles.primaryButton, { backgroundColor: theme.primary }]}>
                            <Text style={styles.primaryButtonText}>Try again</Text>
                        </Pressable>
                    </View>
                ) : (
                    <>
                        {featuredProduct ? (
                            <Pressable
                                onPress={() => openDetail(featuredProduct)}
                                style={({ pressed }) => [styles.featuredCard, { backgroundColor: theme.surfaceElevated }, shadows.md, pressed && styles.pressed]}
                            >
                                <Image source={{ uri: featuredProduct.imageUri }} style={styles.featuredImage} />
                                <View style={styles.featuredContent}>
                                    <View style={styles.featuredTopRow}>
                                        <Text style={[styles.featuredTag, { color: theme.accent }]}>Featured drop</Text>
                                        {featuredProduct.badge ? (
                                            <View style={[styles.badge, { backgroundColor: theme.accentSoft }]}>
                                                <Text style={[styles.badgeText, { color: theme.text.primary }]}>{featuredProduct.badge}</Text>
                                            </View>
                                        ) : null}
                                    </View>
                                    <Text style={[styles.featuredTitle, { color: theme.text.primary }]}>{featuredProduct.name}</Text>
                                    <Text style={[styles.featuredCopy, { color: theme.text.secondary }]} numberOfLines={2}>
                                        {featuredProduct.description}
                                    </Text>
                                    <View style={styles.featuredBottomRow}>
                                        <Text style={[styles.featuredPrice, { color: theme.primary }]}>${featuredProduct.price.toFixed(2)}</Text>
                                        <Pressable
                                            onPress={() => handleAdd(featuredProduct.id)}
                                            style={({ pressed }) => [styles.smallPrimaryButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}
                                        >
                                            <Text style={styles.smallPrimaryButtonText}>Add now</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Pressable>
                        ) : null}

                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Browse products</Text>
                            <Text style={[styles.sectionSubtitle, { color: theme.text.secondary }]}>
                                {filteredProducts.length} result{filteredProducts.length === 1 ? '' : 's'}
                            </Text>
                        </View>

                        <FlatList
                            data={filteredProducts}
                            key={numColumns}
                            numColumns={numColumns}
                            scrollEnabled={false}
                            contentContainerStyle={styles.grid}
                            columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
                            keyExtractor={(item) => item.id}
                            ListEmptyComponent={
                                <View style={[styles.emptyState, { backgroundColor: theme.surfaceElevated }]}>
                                    <Ionicons name="sparkles-outline" size={28} color={theme.primary} />
                                    <Text style={[styles.errorTitle, { color: theme.text.primary }]}>No matching products</Text>
                                    <Text style={[styles.errorCopy, { color: theme.text.secondary }]}>Try another search term or switch categories.</Text>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => openDetail(item)}
                                    style={({ pressed }) => [styles.productCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }, shadows.sm, pressed && styles.pressed]}
                                >
                                    <Image source={{ uri: item.imageUri }} style={styles.productImage} />
                                    <View style={styles.productBody}>
                                        <View style={styles.productTopRow}>
                                            <Text style={[styles.productCategory, { color: theme.text.secondary }]}>{item.category}</Text>
                                            {item.badge ? (
                                                <View style={[styles.badge, { backgroundColor: theme.accentSoft }]}>
                                                    <Text style={[styles.badgeText, { color: theme.text.primary }]}>{item.badge}</Text>
                                                </View>
                                            ) : null}
                                        </View>

                                        <Text style={[styles.productName, { color: theme.text.primary }]} numberOfLines={2}>
                                            {item.name}
                                        </Text>
                                        <Text style={[styles.productCopy, { color: theme.text.secondary }]} numberOfLines={2}>
                                            {item.description}
                                        </Text>

                                        <View style={styles.ratingRow}>
                                            <Ionicons name="star" size={14} color={theme.accentAlt} />
                                            <Text style={[styles.ratingText, { color: theme.text.secondary }]}>
                                                {item.rating.toFixed(1)} · {item.reviewCount} reviews
                                            </Text>
                                        </View>

                                        <View style={styles.cardFooter}>
                                            <Text style={[styles.productPrice, { color: theme.primary }]}>${item.price.toFixed(2)}</Text>
                                            <Pressable
                                                onPress={() => handleAdd(item.id)}
                                                style={({ pressed }) => [styles.cardButton, { backgroundColor: theme.accent }, pressed && styles.pressed]}
                                            >
                                                <Text style={styles.cardButtonText}>Add</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Pressable>
                            )}
                        />
                    </>
                )}
            </ScrollView>

            <Pressable onPress={() => router.push('/cart')} style={({ pressed }) => [styles.fab, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
                <Ionicons name="bag-handle" size={20} color="#fff" />
                <Text style={styles.fabText}>{cartCount}</Text>
            </Pressable>

            <Modal visible={Boolean(selectedProduct)} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedProduct(null)}>
                {selectedProduct ? (
                    <View style={[styles.modal, { backgroundColor: theme.background }]}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>
                            <Image source={{ uri: selectedProduct.imageUri }} style={styles.modalImage} />
                            <View style={styles.modalHeader}>
                                <View>
                                    <Text style={[styles.featuredTag, { color: theme.accent }]}>{selectedProduct.category}</Text>
                                    <Text style={[styles.modalTitle, { color: theme.text.primary }]}>{selectedProduct.name}</Text>
                                </View>
                                <Pressable onPress={() => setSelectedProduct(null)} style={[styles.closeButton, { backgroundColor: theme.surfaceElevated }]}>
                                    <Ionicons name="close" size={20} color={theme.text.primary} />
                                </Pressable>
                            </View>

                            <Text style={[styles.modalCopy, { color: theme.text.secondary }]}>{selectedProduct.description}</Text>

                            <View style={[styles.detailStrip, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                                <View>
                                    <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Price</Text>
                                    <Text style={[styles.detailValue, { color: theme.primary }]}>${selectedProduct.price.toFixed(2)}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Rating</Text>
                                    <Text style={[styles.detailValue, { color: theme.text.primary }]}>{selectedProduct.rating.toFixed(1)}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Stock</Text>
                                    <Text style={[styles.detailValue, { color: theme.text.primary }]}>{selectedProduct.inStock}</Text>
                                </View>
                            </View>

                            <View style={styles.tagRow}>
                                {selectedProduct.tags.map((tag) => (
                                    <View key={tag} style={[styles.tag, { backgroundColor: theme.accentSoft }]}>
                                        <Text style={[styles.tagText, { color: theme.text.primary }]}>{tag}</Text>
                                    </View>
                                ))}
                            </View>

                            <Pressable
                                onPress={() => handleAdd(selectedProduct.id)}
                                style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}
                            >
                                <Text style={styles.primaryButtonText}>Add to cart</Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                ) : null}
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: {
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.md,
        paddingBottom: 120,
        gap: spacing.lg,
    },
    backgroundOrbOne: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 180,
        backgroundColor: '#FFB38A',
        opacity: 0.2,
        top: -50,
        right: -30,
    },
    backgroundOrbTwo: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 220,
        backgroundColor: '#5ED3D0',
        opacity: 0.12,
        top: 200,
        left: -90,
    },
    heroCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        gap: spacing.md,
        backgroundColor: 'rgba(255,255,255,0.72)',
    },
    heroTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    brandBadge: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    kicker: {
        fontSize: typography.sizes.xs,
        textTransform: 'uppercase',
        letterSpacing: 1.4,
        fontWeight: typography.weights.bold,
    },
    heroTitle: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
        marginTop: 2,
    },
    heroCopy: {
        fontSize: typography.sizes.md,
        lineHeight: 23,
    },
    cartButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: borderRadius.full,
    },
    cartButtonText: {
        fontWeight: typography.weights.bold,
    },
    heroStatsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    statPill: {
        flex: 1,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    statValue: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    statLabel: {
        fontSize: typography.sizes.xs,
        marginTop: 2,
    },
    searchCard: {
        borderRadius: borderRadius.full,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: 56,
    },
    searchInput: {
        flex: 1,
        fontSize: typography.sizes.md,
    },
    chipRow: {
        gap: spacing.sm,
        paddingRight: spacing.md,
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: borderRadius.full,
        borderWidth: 1,
    },
    categoryChipText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    featuredCard: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    featuredImage: {
        width: '100%',
        height: 220,
    },
    featuredContent: {
        padding: spacing.lg,
        gap: spacing.sm,
    },
    featuredTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredTag: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.bold,
        textTransform: 'uppercase',
        letterSpacing: 1.1,
    },
    badge: {
        borderRadius: borderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    badgeText: {
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.bold,
    },
    featuredTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        lineHeight: 30,
    },
    featuredCopy: {
        fontSize: typography.sizes.md,
        lineHeight: 22,
    },
    featuredBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.md,
    },
    featuredPrice: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
    },
    smallPrimaryButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: borderRadius.full,
    },
    smallPrimaryButtonText: {
        color: '#fff',
        fontWeight: typography.weights.bold,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: spacing.xs,
    },
    sectionTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
    },
    sectionSubtitle: {
        fontSize: typography.sizes.sm,
    },
    grid: {
        gap: spacing.md,
        paddingBottom: spacing.xl,
    },
    gridRow: {
        gap: spacing.md,
    },
    productCard: {
        flex: 1,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
    },
    productImage: {
        width: '100%',
        height: 150,
    },
    productBody: {
        padding: spacing.md,
        gap: spacing.sm,
    },
    productTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productCategory: {
        fontSize: typography.sizes.xs,
        textTransform: 'uppercase',
        fontWeight: typography.weights.bold,
        letterSpacing: 1,
    },
    productName: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
        lineHeight: 21,
    },
    productCopy: {
        fontSize: typography.sizes.sm,
        lineHeight: 18,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    ratingText: {
        fontSize: typography.sizes.xs,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    productPrice: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    cardButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: borderRadius.full,
    },
    cardButtonText: {
        color: '#fff',
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.bold,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 22,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: borderRadius.full,
        ...shadows.lg,
    },
    fabText: {
        color: '#fff',
        fontWeight: typography.weights.bold,
    },
    modal: {
        flex: 1,
    },
    modalContent: {
        padding: spacing.lg,
        gap: spacing.md,
        paddingBottom: spacing.xl,
    },
    modalImage: {
        width: '100%',
        height: 280,
        borderRadius: borderRadius.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    closeButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        marginTop: 4,
    },
    modalCopy: {
        fontSize: typography.sizes.md,
        lineHeight: 23,
    },
    detailStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        padding: spacing.md,
    },
    detailLabel: {
        fontSize: typography.sizes.xs,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    tag: {
        borderRadius: borderRadius.full,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    tagText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    primaryButton: {
        height: 54,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: typography.weights.bold,
        fontSize: typography.sizes.md,
    },
    loadingState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl,
        gap: spacing.md,
    },
    loadingText: {
        fontSize: typography.sizes.md,
    },
    errorState: {
        borderWidth: 1,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
        gap: spacing.sm,
    },
    errorTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    errorCopy: {
        textAlign: 'center',
        lineHeight: 21,
    },
    emptyState: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
        gap: spacing.sm,
    },
    pressed: {
        opacity: 0.8,
    },
});