import { selectCartLines, selectCartTotals } from '@/features/cart/cart.selectors';
import { resetOrderStatus, submitMockOrder } from '@/features/orders/orders.actions';
import { selectOrderError, selectOrderStatus } from '@/features/orders/orders.selectors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { borderRadius, colors, spacing, typography } from '@/styles/design-tokens';
import { formatCurrency } from '@/utils/format';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CheckoutFormState {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

type CheckoutErrors = Partial<Record<keyof CheckoutFormState, string>>;

const INITIAL_FORM: CheckoutFormState = {
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
};

const validateCheckoutForm = (form: CheckoutFormState): CheckoutErrors => {
    const errors: CheckoutErrors = {};

    if (!form.fullName.trim()) {
        errors.fullName = 'Full name is required.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Enter a valid email address.';
    }

    if (!/^[0-9+()\-\s]{7,}$/.test(form.phone)) {
        errors.phone = 'Enter a valid phone number.';
    }

    if (!form.addressLine1.trim()) {
        errors.addressLine1 = 'Street address is required.';
    }

    if (!form.city.trim()) {
        errors.city = 'City is required.';
    }

    if (!form.state.trim()) {
        errors.state = 'State or region is required.';
    }

    if (!form.postalCode.trim()) {
        errors.postalCode = 'Postal code is required.';
    }

    if (!form.country.trim()) {
        errors.country = 'Country is required.';
    }

    return errors;
};

export default function CheckoutScreen() {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];
    const dispatch = useAppDispatch();
    const { width } = useWindowDimensions();

    const lines = useAppSelector(selectCartLines);
    const totals = useAppSelector(selectCartTotals);
    const orderStatus = useAppSelector(selectOrderStatus);
    const orderError = useAppSelector(selectOrderError);

    const [form, setForm] = useState<CheckoutFormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<CheckoutErrors>({});

    const isSubmitting = orderStatus === 'submitting';
    const isNarrow = width < 640;

    useEffect(() => {
        if (orderStatus === 'succeeded') {
            router.replace('/(tabs)/checkout/confirmation');
            dispatch(resetOrderStatus());
        }
    }, [orderStatus, dispatch]);

    const summaryRows = useMemo(
        () => [
            { label: 'Subtotal', value: totals.subtotal },
            { label: 'Shipping', value: totals.shipping },
            { label: 'Tax', value: totals.tax },
        ],
        [totals]
    );

    const handleSubmit = () => {
        const validation = validateCheckoutForm(form);
        setErrors(validation);

        if (Object.keys(validation).length > 0) {
            return;
        }

        dispatch(
            submitMockOrder({
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                addressLine1: form.addressLine1.trim(),
                addressLine2: form.addressLine2.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
                postalCode: form.postalCode.trim(),
                country: form.country.trim(),
            })
        );
    };

    if (lines.length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}
            >
                <View style={styles.emptyState}>
                    <Text style={[styles.emptyTitle, { color: theme.text.primary }]}
                    >
                        Your cart is empty
                    </Text>
                    <Text style={[styles.emptyBody, { color: theme.text.secondary }]}
                    >
                        Add products before checking out.
                    </Text>
                    <Pressable
                        onPress={() => router.replace('/(tabs)/index')}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            { backgroundColor: theme.primary },
                            pressed && styles.primaryButtonPressed,
                        ]}
                    >
                        <Text style={styles.primaryButtonText}>Back to products</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}
        >
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text.primary }]}>Checkout</Text>
                    <Text style={[styles.subtitle, { color: theme.text.secondary }]}
                    >
                        Confirm delivery details and complete your order.
                    </Text>
                </View>

                {orderError ? (
                    <View
                        style={[
                            styles.errorBanner,
                            { backgroundColor: theme.error + '15', borderColor: theme.error + '35' },
                        ]}
                    >
                        <Text style={[styles.errorText, { color: theme.error }]}>{orderError}</Text>
                    </View>
                ) : null}

                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                    <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Delivery details</Text>

                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: theme.text.secondary }]}>Full name</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { borderColor: theme.border, color: theme.text.primary },
                            ]}
                            value={form.fullName}
                            onChangeText={(value) => setForm((prev) => ({ ...prev, fullName: value }))}
                            placeholder="Jordan Smith"
                            placeholderTextColor={theme.text.tertiary}
                        />
                        {errors.fullName ? (
                            <Text style={[styles.errorField, { color: theme.error }]}>{errors.fullName}</Text>
                        ) : null}
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: theme.text.secondary }]}>Email</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { borderColor: theme.border, color: theme.text.primary },
                            ]}
                            value={form.email}
                            onChangeText={(value) => setForm((prev) => ({ ...prev, email: value }))}
                            placeholder="jordan@studio.com"
                            placeholderTextColor={theme.text.tertiary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {errors.email ? (
                            <Text style={[styles.errorField, { color: theme.error }]}>{errors.email}</Text>
                        ) : null}
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: theme.text.secondary }]}>Phone</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { borderColor: theme.border, color: theme.text.primary },
                            ]}
                            value={form.phone}
                            onChangeText={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                            placeholder="+1 555 010 203"
                            placeholderTextColor={theme.text.tertiary}
                            keyboardType="phone-pad"
                        />
                        {errors.phone ? (
                            <Text style={[styles.errorField, { color: theme.error }]}>{errors.phone}</Text>
                        ) : null}
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: theme.text.secondary }]}>Address line 1</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { borderColor: theme.border, color: theme.text.primary },
                            ]}
                            value={form.addressLine1}
                            onChangeText={(value) => setForm((prev) => ({ ...prev, addressLine1: value }))}
                            placeholder="123 Market Street"
                            placeholderTextColor={theme.text.tertiary}
                        />
                        {errors.addressLine1 ? (
                            <Text style={[styles.errorField, { color: theme.error }]}>{errors.addressLine1}</Text>
                        ) : null}
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={[styles.label, { color: theme.text.secondary }]}>Address line 2</Text>
                        <TextInput
                            style={[
                                styles.input,
                                { borderColor: theme.border, color: theme.text.primary },
                            ]}
                            value={form.addressLine2}
                            onChangeText={(value) => setForm((prev) => ({ ...prev, addressLine2: value }))}
                            placeholder="Suite 204"
                            placeholderTextColor={theme.text.tertiary}
                        />
                    </View>

                    <View style={[styles.row, isNarrow && styles.rowStack]}>
                        <View style={styles.halfField}>
                            <Text style={[styles.label, { color: theme.text.secondary }]}>City</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { borderColor: theme.border, color: theme.text.primary },
                                ]}
                                value={form.city}
                                onChangeText={(value) => setForm((prev) => ({ ...prev, city: value }))}
                                placeholder="New York"
                                placeholderTextColor={theme.text.tertiary}
                            />
                            {errors.city ? (
                                <Text style={[styles.errorField, { color: theme.error }]}>{errors.city}</Text>
                            ) : null}
                        </View>
                        <View style={styles.halfField}>
                            <Text style={[styles.label, { color: theme.text.secondary }]}>State</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { borderColor: theme.border, color: theme.text.primary },
                                ]}
                                value={form.state}
                                onChangeText={(value) => setForm((prev) => ({ ...prev, state: value }))}
                                placeholder="NY"
                                placeholderTextColor={theme.text.tertiary}
                            />
                            {errors.state ? (
                                <Text style={[styles.errorField, { color: theme.error }]}>{errors.state}</Text>
                            ) : null}
                        </View>
                    </View>

                    <View style={[styles.row, isNarrow && styles.rowStack]}>
                        <View style={styles.halfField}>
                            <Text style={[styles.label, { color: theme.text.secondary }]}>Postal code</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { borderColor: theme.border, color: theme.text.primary },
                                ]}
                                value={form.postalCode}
                                onChangeText={(value) => setForm((prev) => ({ ...prev, postalCode: value }))}
                                placeholder="10001"
                                placeholderTextColor={theme.text.tertiary}
                                keyboardType="number-pad"
                            />
                            {errors.postalCode ? (
                                <Text style={[styles.errorField, { color: theme.error }]}>{errors.postalCode}</Text>
                            ) : null}
                        </View>
                        <View style={styles.halfField}>
                            <Text style={[styles.label, { color: theme.text.secondary }]}>Country</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { borderColor: theme.border, color: theme.text.primary },
                                ]}
                                value={form.country}
                                onChangeText={(value) => setForm((prev) => ({ ...prev, country: value }))}
                                placeholder="United States"
                                placeholderTextColor={theme.text.tertiary}
                            />
                            {errors.country ? (
                                <Text style={[styles.errorField, { color: theme.error }]}>{errors.country}</Text>
                            ) : null}
                        </View>
                    </View>
                </View>

                <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                    <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>Order summary</Text>

                    {summaryRows.map((row) => (
                        <View key={row.label} style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { color: theme.text.secondary }]}>
                                {row.label}
                            </Text>
                            <Text style={[styles.summaryValue, { color: theme.text.primary }]}
                            >
                                {formatCurrency(row.value)}
                            </Text>
                        </View>
                    ))}

                    <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryTotalLabel, { color: theme.text.primary }]}
                        >
                            Total
                        </Text>
                        <Text style={[styles.summaryTotalValue, { color: theme.text.primary }]}
                        >
                            {formatCurrency(totals.total)}
                        </Text>
                    </View>
                </View>

                <Pressable
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        { backgroundColor: theme.primary },
                        isSubmitting && styles.primaryButtonDisabled,
                        pressed && !isSubmitting && styles.primaryButtonPressed,
                    ]}
                >
                    {isSubmitting ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color="#FFFFFF" />
                            <Text style={styles.primaryButtonText}>Processing...</Text>
                        </View>
                    ) : (
                        <Text style={styles.primaryButtonText}>Complete mock order</Text>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
        gap: spacing.lg,
    },
    header: {
        gap: spacing.xs,
    },
    title: {
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        fontFamily: typography.families.heading,
    },
    subtitle: {
        fontSize: typography.sizes.sm,
    },
    section: {
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        gap: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    fieldGroup: {
        gap: spacing.xs,
    },
    label: {
        fontSize: typography.sizes.sm,
    },
    input: {
        borderWidth: 1,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: typography.sizes.md,
        fontFamily: typography.families.body,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    rowStack: {
        flexDirection: 'column',
    },
    halfField: {
        flex: 1,
        gap: spacing.xs,
    },
    errorField: {
        fontSize: typography.sizes.xs,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: typography.sizes.sm,
    },
    summaryValue: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
    summaryDivider: {
        height: 1,
    },
    summaryTotalLabel: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    summaryTotalValue: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.bold,
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
    primaryButtonDisabled: {
        opacity: 0.6,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        gap: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.bold,
    },
    emptyBody: {
        fontSize: typography.sizes.sm,
        textAlign: 'center',
    },
    errorBanner: {
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    errorText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.semibold,
    },
});
