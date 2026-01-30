import { Product } from '@/features/products/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { borderRadius, colors, shadows, spacing, typography } from '@/styles/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ProductCardProps {
    product: Product;
    onDelete: (productId: string) => void;
    onEdit: (product: Product) => void;
    onPress: (product: Product) => void;
}

export function ProductCard({ product, onDelete, onEdit, onPress }: ProductCardProps) {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme ?? 'light'];

    const handleDelete = () => {
        Alert.alert('Delete Product', `Are you sure you want to delete "${product.name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => onDelete(product.id),
            },
        ]);
    };

    return (
        <Pressable
            onPress={() => onPress(product)}
            style={[styles.container, { backgroundColor: theme.surface }, shadows.sm]}
        >
            <Image source={{ uri: product.imageUri }} style={styles.image} resizeMode="cover" />

            <View style={styles.content}>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.text.primary }]} numberOfLines={1}>
                        {product.name}
                    </Text>
                    <Text style={[styles.price, { color: theme.primary }]}>
                        ${product.price.toFixed(2)}
                    </Text>
                </View>

                <View style={styles.actions}>
                    <Pressable
                        onPress={handleDelete}
                        style={({ pressed }) => [
                            styles.iconButton,
                            { backgroundColor: theme.error + '15' },
                            pressed && styles.iconButtonPressed,
                        ]}
                    >
                        <Ionicons name="trash" size={16} color={theme.error} />
                    </Pressable>

                    <Pressable
                        onPress={() => onEdit(product)}
                        style={({ pressed }) => [
                            styles.iconButton,
                            { backgroundColor: theme.primary + '15' },
                            pressed && styles.iconButtonPressed,
                        ]}
                    >
                        <Ionicons name="create" size={16} color={theme.primary} />
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
        lineHeight: typography.sizes.md * 1.4,
    },
    price: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    iconButton: {
        height: 32,
        width: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButtonPressed: {
        opacity: 0.7,
    },
});
