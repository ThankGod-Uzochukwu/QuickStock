import { selectLatestOrder } from '@/features/orders/orders.selectors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppSelector } from '@/store/hooks';
import { borderRadius, colors, shadows, spacing, typography } from '@/styles/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function OrderConfirmationView() {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const latestOrder = useAppSelector(selectLatestOrder);

    if (!latestOrder) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={[styles.emptyCard, { backgroundColor: theme.surfaceElevated }]}>
                    <Ionicons name="receipt-outline" size={32} color={theme.primary} />
                    <Text style={[styles.title, { color: theme.text.primary }]}>No order found</Text>
                    <Text style={[styles.subtitle, { color: theme.text.secondary }]}>Place a checkout to see your confirmation here.</Text>
                    <Link href="/" asChild>
                        <Pressable style={[styles.primaryButton, { backgroundColor: theme.primary }]}>
                            <Text style={styles.primaryButtonText}>Back to shop</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.successOrb} />
                <View style={[styles.successCard, { backgroundColor: theme.surfaceElevated }, shadows.md]}>
                    <View style={[styles.successIcon, { backgroundColor: theme.accentSoft ?? theme.surfaceMuted }]}>
                        <Ionicons name="checkmark" size={28} color={theme.success} />
                    </View>
                    <Text style={[styles.title, { color: theme.text.primary }]}>Order confirmed</Text>
                    <Text style={[styles.subtitle, { color: theme.text.secondary }]}>Your mock order is complete. We’ve captured the details and stored the latest receipt in the app.</Text>
                    <View style={styles.codeRow}>
                        <Text style={[styles.codeLabel, { color: theme.text.secondary }]}>Confirmation code</Text>
                        <Text style={[styles.codeValue, { color: theme.primary }]}>{latestOrder.confirmationCode}</Text>
                    </View>
                </View>

                <View style={[styles.summaryCard, { backgroundColor: theme.surfaceElevated }, shadows.sm]}>
                    <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Order ID</Text><Text style={[styles.summaryValue, { color: theme.text.primary }]}>{latestOrder.id}</Text></View>
                    <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Total</Text><Text style={[styles.summaryValue, { color: theme.primary }]}>${latestOrder.total.toFixed(2)}</Text></View>
                    <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Ship to</Text><Text style={[styles.summaryValue, { color: theme.text.primary }]}>{latestOrder.contact.city}, {latestOrder.contact.region}</Text></View>
                </View>

                <View style={[styles.itemsCard, { backgroundColor: theme.surfaceElevated }, shadows.sm]}>
                    <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Items</Text>
                    {latestOrder.items.map((item) => (
                        <View key={item.product.id} style={styles.itemRow}>
                            <Image source={{ uri: item.product.imageUri }} style={styles.itemImage} />
                            <View style={styles.itemBody}>
                                <Text style={[styles.itemName, { color: theme.text.primary }]} numberOfLines={2}>{item.product.name}</Text>
                                <Text style={[styles.itemMeta, { color: theme.text.secondary }]}>Qty {item.quantity}</Text>
                            </View>
                            <Text style={[styles.itemPrice, { color: theme.text.primary }]}>${(item.product.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <Link href="/" asChild>
                    <Pressable style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}>
                        <Text style={styles.primaryButtonText}>Continue shopping</Text>
                    </Pressable>
                </Link>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        padding: spacing.md,
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
        gap: spacing.lg,
    },
    successOrb: {
        position: 'absolute',
        top: -60,
        right: -80,
        width: 220,
        height: 220,
        borderRadius: 220,
        backgroundColor: '#5ED3D0',
        opacity: 0.14,
    },
    successCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        gap: spacing.sm,
        alignItems: 'flex-start',
    },
    successIcon: {
        width: 58,
        height: 58,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
    },
    subtitle: {
        fontSize: typography.sizes.md,
        lineHeight: 22,
    },
    codeRow: {
        gap: 4,
        width: '100%',
        marginTop: spacing.xs,
    },
    codeLabel: {
        fontSize: typography.sizes.xs,
        textTransform: 'uppercase',
        fontWeight: typography.weights.bold,
        letterSpacing: 1.2,
    },
    codeValue: {
        fontSize: typography.sizes.lg,
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
    itemsCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        gap: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    itemImage: {
        width: 54,
        height: 54,
        borderRadius: 16,
    },
    itemBody: {
        flex: 1,
        gap: 4,
    },
    itemName: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    itemMeta: {
        fontSize: typography.sizes.sm,
    },
    itemPrice: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
    },
    primaryButton: {
        height: 54,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
    },
    emptyCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        gap: spacing.sm,
        margin: spacing.md,
    },
    pressed: {
        opacity: 0.85,
    },
});