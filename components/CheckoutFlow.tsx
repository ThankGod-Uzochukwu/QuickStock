import { clearCart } from '@/features/cart/cart.actions';
import { selectCartDetailedItems, selectCartSubtotal } from '@/features/cart/cart.selectors';
import { confirmOrder } from '@/features/orders/orders.actions';
import { selectAllProducts } from '@/features/products/products.selectors';
import { OrderSummary } from '@/features/products/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { submitMockOrder } from '@/services/catalog/catalog.service';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { borderRadius, colors, shadows, spacing, typography } from '@/styles/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const initialForm = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
};

export function CheckoutFlow() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const products = useAppSelector(selectAllProducts);
    const cartItems = useAppSelector((state) => selectCartDetailedItems(state, products));
    const subtotal = useAppSelector((state) => selectCartSubtotal(state, products));
    const shipping = cartItems.length ? Math.max(6.99, subtotal * 0.06) : 0;
    const total = subtotal + shipping;
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const isValid = useMemo(
        () =>
            Boolean(
                form.fullName.trim() &&
                form.email.trim() &&
                form.phone.trim() &&
                form.address.trim() &&
                form.city.trim() &&
                form.region.trim() &&
                form.postalCode.trim()
            ),
        [form]
    );

    const updateField = (key: keyof typeof initialForm, value: string) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const validate = () => {
        if (!form.fullName.trim()) return 'Enter your full name.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return 'Enter a valid email address.';
        if (form.phone.trim().length < 7) return 'Enter a valid contact number.';
        if (!form.address.trim() || !form.city.trim() || !form.region.trim() || !form.postalCode.trim()) {
            return 'Complete your shipping address.';
        }
        return '';
    };

    const handleSubmit = async () => {
        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        setError('');

        const orderId = `order_${Date.now()}`;
        const confirmation = await submitMockOrder(orderId);

        const order: OrderSummary = {
            id: confirmation.orderId,
            createdAt: Date.now(),
            items: cartItems.map((item) => ({ product: item.product, quantity: item.quantity })),
            contact: form,
            subtotal,
            shipping,
            total,
            status: 'confirmed',
            confirmationCode: confirmation.confirmationCode,
        };

        await dispatch(confirmOrder(order));
        await dispatch(clearCart());
        setSubmitting(false);
        router.replace('/order-confirmation');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.headerCard}>
                    <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.surfaceElevated }]}>
                        <Ionicons name="chevron-back" size={20} color={theme.text.primary} />
                    </Pressable>
                    <Text style={[styles.title, { color: theme.text.primary }]}>Checkout</Text>
                    <Text style={[styles.subtitle, { color: theme.text.secondary }]}>Enter delivery details and complete a mock payment to place the order.</Text>
                </View>

                <View style={[styles.formCard, { backgroundColor: theme.surfaceElevated }, shadows.sm]}>
                    {([
                        ['fullName', 'Full name'],
                        ['email', 'Email'],
                        ['phone', 'Phone number'],
                        ['address', 'Street address'],
                        ['city', 'City'],
                        ['region', 'State / region'],
                        ['postalCode', 'Postal code'],
                    ] as Array<[keyof typeof initialForm, string]>).map(([key, label]) => (
                        <View key={key} style={styles.field}>
                            <Text style={[styles.label, { color: theme.text.primary }]}>{label}</Text>
                            <TextInput
                                value={form[key]}
                                onChangeText={(value) => updateField(key, value)}
                                placeholder={label}
                                placeholderTextColor={theme.text.tertiary}
                                style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text.primary }]}
                                autoCapitalize={key === 'email' ? 'none' : 'words'}
                                keyboardType={key === 'email' ? 'email-address' : key === 'phone' || key === 'postalCode' ? 'phone-pad' : 'default'}
                            />
                        </View>
                    ))}

                    {error ? <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text> : null}
                </View>

                <View style={[styles.summaryCard, { backgroundColor: theme.surfaceElevated }, shadows.md]}>
                    <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Subtotal</Text><Text style={[styles.summaryValue, { color: theme.text.primary }]}>${subtotal.toFixed(2)}</Text></View>
                    <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Shipping</Text><Text style={[styles.summaryValue, { color: theme.text.primary }]}>${shipping.toFixed(2)}</Text></View>
                    <View style={styles.summaryRow}><Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>Total</Text><Text style={[styles.summaryTotal, { color: theme.primary }]}>${total.toFixed(2)}</Text></View>
                </View>

                <Pressable
                    disabled={!isValid || submitting || !cartItems.length}
                    onPress={handleSubmit}
                    style={({ pressed }) => [styles.submitButton, { backgroundColor: theme.primary }, (!isValid || !cartItems.length) && styles.disabled, pressed && styles.pressed]}
                >
                    {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Complete order</Text>}
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        padding: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.lg,
    },
    headerCard: {
        gap: spacing.sm,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
    formCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        gap: spacing.md,
    },
    field: {
        gap: spacing.xs,
    },
    label: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    input: {
        minHeight: 52,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        paddingHorizontal: spacing.md,
        fontSize: typography.sizes.md,
    },
    errorText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
        textAlign: 'center',
    },
    summaryCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        gap: spacing.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryLabel: {
        fontSize: typography.sizes.md,
    },
    summaryValue: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    summaryTotal: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
    },
    submitButton: {
        height: 56,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        color: '#fff',
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
    },
    disabled: {
        opacity: 0.5,
    },
    pressed: {
        opacity: 0.85,
    },
});