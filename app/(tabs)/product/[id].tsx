import { ProductDetails } from '@/components/ProductDetails';
import { addToCart } from '@/features/cart/cart.actions';
import { selectCartQuantityMap } from '@/features/cart/cart.selectors';
import { selectProductById } from '@/features/products/products.selectors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { colors, spacing, typography } from '@/styles/design-tokens';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailScreen() {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];
    const dispatch = useAppDispatch();
    const params = useLocalSearchParams<{ id?: string }>();
    const productId = params.id ?? '';

    const product = useAppSelector((state) => selectProductById(state, productId));
    const cartQuantities = useAppSelector(selectCartQuantityMap);

    if (!product) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}
            >
                <View style={styles.missingState}>
                    <Text style={[styles.missingTitle, { color: theme.text.primary }]}
                    >
                        Product not found
                    </Text>
                    <Text style={[styles.missingBody, { color: theme.text.secondary }]}
                    >
                        It may have been removed or is no longer available.
                    </Text>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Text style={[styles.backButtonText, { color: theme.primary }]}>Go back</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    const quantityInCart = cartQuantities[product.id] ?? 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ProductDetails
                product={product}
                onBack={() => router.back()}
                onGoToCart={() => router.push('/(tabs)/cart')}
                onAddToCart={() => dispatch(addToCart(product.id, 1))}
                quantityInCart={quantityInCart}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    missingState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.sm,
    },
    missingTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    missingBody: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
    },
    backButton: {
        marginTop: spacing.sm,
    },
    backButtonText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
});
