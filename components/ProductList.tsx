/**
 * Product list component.
 * 
 * Renders a grid of products with empty state fallback.
 */

import { Product } from '@/features/products/types';
import { spacing } from '@/styles/design-tokens';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from './ProductCard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ProductListProps {
    products: Product[];
    onDeleteProduct: (productId: string) => void;
    onEditProduct: (product: Product) => void;
    onSelectProduct: (product: Product) => void;
}

export function ProductList({ products, onDeleteProduct, onEditProduct, onSelectProduct }: ProductListProps) {
    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <ProductCard
                    product={item}
                    onDelete={onDeleteProduct}
                    onEdit={onEditProduct}
                    onPress={onSelectProduct}
                />
            )}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="not-interested" size={124} color="white" />
                    <View>
                        <Text style={styles.emptyTitle}>No Products Yet</Text>
                        <Text style={styles.emptyDescription}>
                            Tap the '+' button below to add your first product
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
        fontSize: 20,
        fontWeight: '700',
        marginBottom: spacing.sm,
        textAlign: 'center',
        color: "white"
    },
    emptyDescription: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.8,
        color: "white"
    },
});
