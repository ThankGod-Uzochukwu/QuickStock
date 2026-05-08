import { selectLastOrder } from '@/features/orders/orders.selectors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSelector } from '@/store/hooks';
import { borderRadius, colors, spacing, typography } from '@/styles/design-tokens';
import { formatCurrency } from '@/utils/format';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderConfirmationScreen() {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];
    const order = useAppSelector(selectLastOrder);

    if (!order) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}
            >
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, { color: theme.text.primary }]}
                    >
                        No order found
                    </Text>
                    <Text style={[styles.emptyBody, { color: theme.text.secondary }]}
                    >
                        Return to the catalog to place an order.
                    </Text>
                    <Pressable
                        onPress={() => router.replace('/(tabs)/index')}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            { backgroundColor: theme.primary },
                            pressed && styles.primaryButtonPressed,
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>Back to products</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text.primary }]}
                    >
                        Order confirmed
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.text.secondary }]}
                    >
                        Your mock order is complete. We'll notify you when it ships.
                    </Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                    <Text style={[styles.cardTitle, { color: theme.text.primary }]}>Order details</Text>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Order ID</Text>
                        <Text style={[styles.detailValue, { color: theme.text.primary }]}
                        >
                            {order.id}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: theme.text.secondary }]}>Total</Text>
                        <Text style={[styles.detailValue, { color: theme.text.primary }]}
                        >
                            {formatCurrency(order.totals.total)}
                        </Text>
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                    <Text style={[styles.cardTitle, { color: theme.text.primary }]}>Items</Text>
                    <View style={styles.itemsList}>
                        {order.items.map((item) => (
                            <View key={item.productId} style={styles.itemRow}>
                                <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                                <View style={styles.itemDetails}>
                                    <Text style={[styles.itemName, { color: theme.text.primary }]} numberOfLines={2}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text style={[styles.itemMeta, { color: theme.text.secondary }]}
                                    >
                                        Qty {item.quantity} · {formatCurrency(item.price)}
                                    </Text>
                                </View>
                                <Text style={[styles.itemTotal, { color: theme.text.primary }]}
                                >
                                    {formatCurrency(item.lineTotal)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                    <Text style={[styles.cardTitle, { color: theme.text.primary }]}>Delivery</Text>
                    <Text style={[styles.address, { color: theme.text.secondary }]}
                    >
                        {order.customer.fullName}
                    </Text>
                    <Text style={[styles.address, { color: theme.text.secondary }]}
                    >
                        {order.customer.addressLine1}
                        {order.customer.addressLine2 ? `, ${order.customer.addressLine2}` : ''}
                    </Text>
                    <Text style={[styles.address, { color: theme.text.secondary }]}
                    >
                        {order.customer.city}, {order.customer.state} {order.customer.postalCode}
                    </Text>
                    <Text style={[styles.address, { color: theme.text.secondary }]}
                    >
                        {order.customer.country}
                    </Text>
                </View>

                <Pressable
                    onPress={() => router.replace('/(tabs)/index')}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        { backgroundColor: theme.primary },
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Continue shopping</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
        gap: spacing.lg,
    },
    header: {
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
    card: {
        borderRadius: borderRadius.md,
        borderWidth: 1,
        padding: spacing.lg,
        gap: spacing.sm,
    },
    cardTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: typography.sizes.sm,
    },
    detailValue: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    itemsList: {
        gap: spacing.md,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    itemImage: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.sm,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    itemMeta: {
        fontSize: typography.sizes.xs,
        marginTop: 2,
    },
    itemTotal: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    address: {
        fontSize: typography.sizes.sm,
    },
    primaryButton: {
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
