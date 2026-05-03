import { clearCart, hydrateCart, removeFromCart, setCartQuantity } from '@/features/cart/cart.actions';
import { selectCartDetailedItems, selectCartSubtotal } from '@/features/cart/cart.selectors';
import { loadProducts } from '@/features/products/products.actions';
import { selectAllProducts, selectProductsLoading } from '@/features/products/products.selectors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { borderRadius, colors, shadows, spacing, typography } from '@/styles/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function CartView() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const products = useAppSelector(selectAllProducts);
    const loading = useAppSelector(selectProductsLoading);
    const cartItems = useAppSelector((state) => selectCartDetailedItems(state, products));
    const subtotal = useAppSelector((state) => selectCartSubtotal(state, products));

    useEffect(() => {
        dispatch(loadProducts());
        dispatch(hydrateCart());
    }, [dispatch]);

    const shipping = cartItems.length ? Math.max(6.99, subtotal * 0.06) : 0;
    const total = subtotal + shipping;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.backgroundOrbOne} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.headerCard}>
                    <Text style={[styles.kicker, { color: theme.text.secondary }]}>Ready to checkout</Text>
                    <Text style={[styles.title, { color: theme.text.primary }]}>Your cart</Text>
                    <Text style={[styles.subtitle, { color: theme.text.secondary }]}>Review quantities, remove items, then finish with a mock payment flow.</Text>
                </View>

                {loading && !cartItems.length ? (
                    <View style={styles.loadingState}>
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                ) : cartItems.length ? (
                    <View style={styles.list}>
                        {cartItems.map((item) => (
                            <View key={item.productId} style={[styles.cartCard, { backgroundColor: theme.surfaceElevated }, shadows.sm]}>
                                <Image source={{ uri: item.product.imageUri }} style={styles.thumb} />
                                <View style={styles.itemBody}>
                                    <View>
                                        <Text style={[styles.itemCategory, { color: theme.text.secondary }]}>{item.product.category}</Text>
                                        <Text style={[styles.itemName, { color: theme.text.primary }]} numberOfLines={2}>{item.product.name}</Text>
                                    </View>

                                    <View style={styles.priceRow}>
                                        <Text style={[styles.itemPrice, { color: theme.primary }]}>${item.product.price.toFixed(2)}</Text>
                                        <Pressable onPress={() => dispatch(removeFromCart(item.productId))} hitSlop={8}>
                                            <Ionicons name="trash-outline" size={18} color={theme.error} />
                                        </Pressable>
                                    </View>

                                    <View style={styles.quantityRow}>
                                        <Pressable
                                            onPress={() => dispatch(setCartQuantity(item.productId, item.quantity - 1))}
                                            style={[styles.quantityButton, { backgroundColor: theme.surfaceMuted }]}
                                        >
                                            <Text style={[styles.quantityButtonText, { color: theme.text.primary }]}>−</Text>
                                        </Pressable>
                                        <Text style={[styles.quantityValue, { color: theme.text.primary }]}>{item.quantity}</Text>
                                        <Pressable
                                            onPress={() => dispatch(setCartQuantity(item.productId, item.quantity + 1))}
                                            style={[styles.quantityButton, { backgroundColor: theme.surfaceMuted }]}
                                        >
                                            <Text style={[styles.quantityButtonText, { color: theme.text.primary }]}>+</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        ))}

                        <View style={[styles.summaryCard, { backgroundColor: theme.surfaceElevated }, shadows.md]}>
                            <View style={styles.summaryRow}>
                                <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Subtotal</Text>
                                <Text style={[styles.summaryValue, { color: theme.text.primary }]}>${subtotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Shipping</Text>
                                <Text style={[styles.summaryValue, { color: theme.text.primary }]}>${shipping.toFixed(2)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Total</Text>
                                <Text style={[styles.summaryTotal, { color: theme.primary }]}>${total.toFixed(2)}</Text>
                            </View>
                            <Pressable
                                onPress={() => router.push('/checkout')}
                                style={({ pressed }) => [styles.checkoutButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}
                            >
                                <Text style={styles.checkoutButtonText}>Proceed to checkout</Text>
                            </Pressable>
                            <Pressable onPress={() => dispatch(clearCart())} style={styles.clearButton}>
                                <Text style={[styles.clearButtonText, { color: theme.text.secondary }]}>Clear cart</Text>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <View style={[styles.emptyState, { backgroundColor: theme.surfaceElevated }]}>
                        <Ionicons name="bag-handle-outline" size={30} color={theme.primary} />
                        <Text style={[styles.title, { color: theme.text.primary }]}>Your cart is empty</Text>
                        <Text style={[styles.subtitle, { color: theme.text.secondary }]}>Add a few products from the shop and come back here to finish checkout.</Text>
                        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.checkoutButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
                            <Text style={styles.checkoutButtonText}>Browse products</Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        padding: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.lg,
    },
    backgroundOrbOne: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 220,
        backgroundColor: '#FFB38A',
        opacity: 0.18,
        top: -50,
        right: -70,
    },
    headerCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        gap: spacing.sm,
        backgroundColor: 'rgba(255,255,255,0.72)',
    },
    kicker: {
        fontSize: typography.sizes.xs,
        textTransform: 'uppercase',
        letterSpacing: 1.3,
        fontWeight: typography.weights.bold,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
    },
    subtitle: {
        fontSize: typography.sizes.md,
        lineHeight: 22,
    },
    loadingState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl,
    },
    list: {
        gap: spacing.md,
    },
    cartCard: {
        flexDirection: 'row',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    thumb: {
        width: 116,
        height: '100%',
        minHeight: 140,
    },
    itemBody: {
        flex: 1,
        padding: spacing.md,
        gap: spacing.sm,
    },
    itemCategory: {
        fontSize: typography.sizes.xs,
        textTransform: 'uppercase',
        fontWeight: typography.weights.bold,
        letterSpacing: 1,
    },
    itemName: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
        lineHeight: 20,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityButtonText: {
        fontSize: 20,
        fontWeight: typography.weights.bold,
    },
    quantityValue: {
        minWidth: 20,
        textAlign: 'center',
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
    },
    summaryCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        gap: spacing.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: typography.sizes.md,
    },
    summaryValue: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    summaryTotal: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
    },
    checkoutButton: {
        height: 54,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
    },
    clearButton: {
        alignItems: 'center',
        paddingVertical: 6,
    },
    clearButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    emptyState: {
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    pressed: {
        opacity: 0.85,
    },
});