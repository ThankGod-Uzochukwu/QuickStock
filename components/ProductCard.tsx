import { Product } from '@/features/products/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { borderRadius, colors, shadows, spacing, typography } from '@/styles/design-tokens';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ProductCardProps {
    product: Product;
    onPress: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    quantityInCart?: number;
}

export function ProductCard({ product, onPress, onAddToCart, quantityInCart }: ProductCardProps) {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];

    return (
        <Pressable
            onPress={() => onPress(product)}
            style={[styles.container, { backgroundColor: theme.surface }, shadows.sm]}
        >
            <View>
                <Image source={{ uri: product.imageUri }} style={styles.image} resizeMode="cover" />
                {quantityInCart ? (
                    <View style={[styles.cartBadge, { backgroundColor: theme.primary }]}
                    >
                        <Text style={styles.cartBadgeText}>{quantityInCart} in cart</Text>
                    </View>
                ) : null}
            </View>

            <View style={styles.content}>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.text.primary }]} numberOfLines={1}>
                        {product.name}
                    </Text>
                    <Text style={[styles.price, { color: theme.primary }]}>
                        {formatCurrency(product.price)}
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Pressable
                        onPress={() => onAddToCart(product)}
                        style={({ pressed }) => [
                            styles.addButton,
                            { backgroundColor: theme.primary },
                            pressed && styles.addButtonPressed,
                        ]}
                    >
                        <Ionicons name="bag-add" size={16} color="#FFFFFF" />
                        <Text style={styles.addButtonText}>
                            {quantityInCart ? 'Add more' : 'Add'}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        flex: 1,
    },
    image: {
        width: '100%',
        height: 120,
        backgroundColor: '#E0E0E0',
    },
    content: {
        padding: spacing.sm,
        gap: spacing.sm,
    },
    info: {
        gap: spacing.xs,
    },
    name: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        fontFamily: typography.families.heading,
        lineHeight: typography.sizes.md * 1.4,
    },
    price: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    cartBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    cartBadgeText: {
        color: '#FFFFFF',
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.semibold,
        fontFamily: typography.families.body,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
    },
    addButtonPressed: {
        opacity: 0.85,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        fontFamily: typography.families.body,
    },
});
