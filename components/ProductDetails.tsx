import { Product } from '@/features/products/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { borderRadius, colors, spacing, typography } from '@/styles/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ProductDetailsProps {
    product: Product;
    onClose: () => void;
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
}

export function ProductDetails({ product, onClose, onEdit, onDelete }: ProductDetailsProps) {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme ?? 'light'];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Pressable onPress={onClose} style={styles.headerButton}>
                    <Ionicons name="chevron-down" size={24} color={theme.text.primary} />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: product.imageUri }} style={styles.image} resizeMode="cover" />

                <View style={styles.summary}>
                    <Text style={[styles.name, { color: theme.text.primary }]}>{product.name}</Text>
                    <View style={styles.priceRow}>
                        <Text style={[styles.price, { color: theme.primary }]}>${product.price.toFixed(2)}</Text>
                        <View style={styles.actions}>
                            <Pressable
                                onPress={() => onDelete(product.id)}
                                style={({ pressed }) => [
                                    styles.actionButton,
                                    { backgroundColor: theme.error + '15' },
                                    pressed && styles.actionButtonPressed,
                                ]}
                            >
                                <Ionicons name="trash" size={18} color={theme.error} />
                            </Pressable>
                            <Pressable
                                onPress={() => onEdit(product)}
                                style={({ pressed }) => [
                                    styles.actionButton,
                                    { backgroundColor: theme.primary + '15' },
                                    pressed && styles.actionButtonPressed,
                                ]}
                            >
                                <Ionicons name="create" size={18} color={theme.primary} />
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>About this product</Text>
                    <Text style={[styles.sectionBody, { color: theme.text.secondary }]}
                    >
                        {product.name} is stored with QuickStock for fast lookup and reliable inventory
                        tracking. Add notes, update pricing, or swap the image anytime to keep your
                        catalog current.
                    </Text>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}
            >
                <Pressable
                    onPress={() => onEdit(product)}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        { backgroundColor: theme.primary },
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>Edit Product</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.lg,
        alignItems: 'flex-start',
    },
    headerButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: spacing.lg,
        gap: spacing.lg,
        paddingBottom: spacing.xl,
    },

    image: {
        width: '100%',
        height: 200,
        borderRadius: 18
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 18,
    },
    summary: {
        gap: spacing.sm,
    },
    name: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionButton: {
        height: 36,
        width: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonPressed: {
        opacity: 0.7,
    },
    metaCard: {
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaItem: {
        alignItems: 'flex-start',
        gap: spacing.xs,
        flex: 1,
    },
    metaLabel: {
        fontSize: typography.sizes.sm,
    },
    metaValue: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    metaDivider: {
        width: 1,
        marginHorizontal: spacing.md,
    },
    section: {
        gap: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    sectionBody: {
        fontSize: typography.sizes.sm,
        lineHeight: typography.sizes.sm * 1.5,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
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
});
