import { Product } from '@/features/products/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { borderRadius, colors, spacing, typography } from '@/styles/design-tokens';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ProductDetailsProps {
    product: Product;
    onBack: () => void;
    onAddToCart: (product: Product) => void;
    onGoToCart: () => void;
    quantityInCart?: number;
}

export function ProductDetails({
    product,
    onBack,
    onAddToCart,
    onGoToCart,
    quantityInCart,
}: ProductDetailsProps) {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Pressable onPress={onBack} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={22} color={theme.text.primary} />
                </Pressable>
                <Pressable onPress={onGoToCart} style={styles.headerButton}>
                    <Ionicons name="bag-handle" size={20} color={theme.text.primary} />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: product.imageUri }} style={styles.image} resizeMode="cover" />

                <View style={styles.summary}>
                    <Text style={[styles.name, { color: theme.text.primary }]}>{product.name}</Text>
                    <View style={styles.priceRow}>
                        <Text style={[styles.price, { color: theme.primary }]}>
                            {formatCurrency(product.price)}
                        </Text>
                        {quantityInCart ? (
                            <View style={[styles.cartPill, { backgroundColor: theme.primary }]}
                            >
                                <Text style={styles.cartPillText}>{quantityInCart} in cart</Text>
                            </View>
                        ) : null}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>About this product</Text>
                    <Text style={[styles.sectionBody, { color: theme.text.secondary }]}>
                        {product.name} brings a modern, minimal aesthetic to your daily routine. Built
                        for durability and ease of use, it is ready for fast-moving teams and bold
                        spaces.
                    </Text>
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}
            >
                <Pressable
                    onPress={() => onAddToCart(product)}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        { backgroundColor: theme.primary },
                        pressed && styles.primaryButtonPressed,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>
                        {quantityInCart ? 'Add another' : 'Add to cart'}
                    </Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        borderRadius: 18,
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
        fontFamily: typography.families.heading,
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
    cartPill: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
    },
    cartPillText: {
        color: '#FFFFFF',
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
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
        fontFamily: typography.families.body,
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
