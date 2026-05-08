import { CartItemRow } from '@/components/CartItemRow';
import { removeFromCart, updateCartQuantity } from '@/features/cart/cart.actions';
import { selectCartError, selectCartLines, selectCartTotals } from '@/features/cart/cart.selectors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { borderRadius, colors, spacing, typography } from '@/styles/design-tokens';
import { formatCurrency } from '@/utils/format';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];
    const dispatch = useAppDispatch();

    const lines = useAppSelector(selectCartLines);
    const totals = useAppSelector(selectCartTotals);
    const cartError = useAppSelector(selectCartError);

    const handleCheckout = () => {
        router.push('/checkout');
    };

    if (lines.length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>Your cart is empty</Text>
                    <Text style={[styles.emptyBody, { color: theme.text.secondary }]}
                    >
                        Add a few products to build your order.
                    </Text>
                    <Pressable
                        onPress={() => router.push('/(tabs)')}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            { backgroundColor: theme.primary },
                            pressed && styles.primaryButtonPressed,
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>Browse products</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text.primary }]}>Your Cart</Text>
                <Text style={[styles.subtitle, { color: theme.text.secondary }]}
                >
                    Review quantities and proceed when ready.
                </Text>
            </View>

            {cartError ? (
                <View
                    style={[
                        styles.errorBanner,
                        { backgroundColor: theme.error + '15', borderColor: theme.error + '35' },
                    ]}
                >
                    <Text style={[styles.errorText, { color: theme.error }]}>{cartError}</Text>
                </View>
            ) : null}

            <FlatList
                data={lines}
                keyExtractor={(item) => item.product.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <CartItemRow
                        line={item}
                        onDecrease={() =>
                            dispatch(updateCartQuantity(item.product.id, item.quantity - 1))
                        }
                        onIncrease={() =>
                            dispatch(updateCartQuantity(item.product.id, item.quantity + 1))
                        }
                        onRemove={() => dispatch(removeFromCart(item.product.id))}
                    />
                )}
                ListFooterComponent={
                    <View style={[styles.summaryCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    >
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Subtotal</Text>
                            <Text style={[styles.summaryValue, { color: theme.text.primary }]}
                            >
                                {formatCurrency(totals.subtotal)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Shipping</Text>
                            <Text style={[styles.summaryValue, { color: theme.text.primary }]}
                            >
                                {formatCurrency(totals.shipping)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Tax</Text>
                            <Text style={[styles.summaryValue, { color: theme.text.primary }]}
                            >
                                {formatCurrency(totals.tax)}
                            </Text>
                        </View>
                        <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryTotalLabel, { color: theme.text.primary }]}>Total</Text>
                            <Text style={[styles.summaryTotalValue, { color: theme.text.primary }]}
                            >
                                {formatCurrency(totals.total)}
                            </Text>
                        </View>

                        <Pressable
                            onPress={handleCheckout}
                            style={({ pressed }) => [
                                styles.primaryButton,
                                { backgroundColor: theme.primary },
                                pressed && styles.primaryButtonPressed,
                            ]}
                        >
                            <Text style={styles.primaryButtonText}>Proceed to checkout</Text>
                        </Pressable>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        gap: spacing.xs,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        fontFamily: typography.families.heading,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
    },
    listContent: {
        padding: spacing.lg,
        gap: spacing.md,
        paddingBottom: spacing.xl,
    },
    summaryCard: {
        marginTop: spacing.lg,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        gap: spacing.sm,
    },
    errorBanner: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    errorText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: typography.sizes.sm,
    },
    summaryValue: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    summaryDivider: {
        height: 1,
    },
    summaryTotalLabel: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    summaryTotalValue: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
    },
    primaryButton: {
        marginTop: spacing.lg,
        height: 52,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonPressed: {
        opacity: 0.85,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    emptyBody: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
    },
});
