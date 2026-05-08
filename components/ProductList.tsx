/**
 * Product list component.
 * 
 * Renders a grid of products with empty state fallback.
 */

import { Product } from '@/features/products/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors, spacing, typography } from '@/styles/design-tokens';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from './ProductCard';

interface ProductListProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
    onSelectProduct: (product: Product) => void;
    columns?: number;
    cartQuantities?: Record<string, number>;
    emptyTitle?: string;
    emptyDescription?: string;
}

export function ProductList({
    products,
    onAddToCart,
    onSelectProduct,
    columns = 2,
    cartQuantities = {},
    emptyTitle,
    emptyDescription,
}: ProductListProps) {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <ProductCard
                    product={item}
                    onPress={onSelectProduct}
                    onAddToCart={onAddToCart}
                    quantityInCart={cartQuantities[item.id]}
                />
            )}
            numColumns={columns}
            key={columns}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={columns > 1 ? styles.row : undefined}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="inventory-2" size={96} color={theme.text.tertiary} />
                    <View>
                        <Text style={[styles.emptyTitle, { color: theme.text.primary }]}>
                            {emptyTitle ?? 'No products match'}
                        </Text>
                        <Text style={[styles.emptyDescription, { color: theme.text.secondary }]}>
                            {emptyDescription ?? 'Try adjusting your search or filters.'}
                        </Text>
                    </View>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        padding: spacing.md,
        gap: spacing.md,
        paddingBottom: spacing.xl,
        flexGrow: 1,
    },
    row: {
        gap: spacing.md,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.sm,
    },
    emptyTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
        fontFamily: typography.families.heading,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptyDescription: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
        opacity: 0.8,
        fontFamily: typography.families.body,
    },
});
