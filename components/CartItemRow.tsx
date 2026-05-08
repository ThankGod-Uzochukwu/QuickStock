import { CartLine } from '@/features/cart/cart.selectors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { borderRadius, colors, spacing, typography } from '@/styles/design-tokens';
import { formatCurrency } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface CartItemRowProps {
    line: CartLine;
    onDecrease: () => void;
    onIncrease: () => void;
    onRemove: () => void;
}

export function CartItemRow({ line, onDecrease, onIncrease, onRemove }: CartItemRowProps) {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
            <Image source={{ uri: line.product.imageUri }} style={styles.image} />

            <View style={styles.details}>
                <View>
                    <Text style={[styles.name, { color: theme.text.primary }]} numberOfLines={2}>
                        {line.product.name}
                    </Text>
                    <Text style={[styles.price, { color: theme.text.secondary }]}>
                        {formatCurrency(line.product.price)}
                    </Text>
                </View>

                <View style={styles.controlsRow}>
                    <View style={[styles.quantityControls, { borderColor: theme.border }]}>
                        <Pressable onPress={onDecrease} style={styles.controlButton}>
                            <Ionicons name="remove" size={16} color={theme.text.primary} />
                        </Pressable>
                        <Text style={[styles.quantityText, { color: theme.text.primary }]}>
                            {line.quantity}
                        </Text>
                        <Pressable onPress={onIncrease} style={styles.controlButton}>
                            <Ionicons name="add" size={16} color={theme.text.primary} />
                        </Pressable>
                    </View>

                    <Pressable onPress={onRemove} style={styles.removeButton}>
                        <Text style={[styles.removeText, { color: theme.error }]}>Remove</Text>
                    </Pressable>
                </View>
            </View>

            <Text style={[styles.total, { color: theme.text.primary }]}>
                {formatCurrency(line.lineTotal)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        alignItems: 'center',
    },
    image: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.sm,
    },
    details: {
        flex: 1,
        gap: spacing.sm,
    },
    name: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
        fontFamily: typography.families.heading,
    },
    price: {
        fontSize: typography.sizes.sm,
        marginTop: spacing.xs,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        borderWidth: 1,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    controlButton: {
        padding: 4,
    },
    quantityText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    removeButton: {
        paddingHorizontal: spacing.xs,
    },
    removeText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    total: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
});
