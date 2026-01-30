import { useColorScheme } from '@/hooks/use-color-scheme';
import { imageService } from '@/services/image/image.service';
import {
    borderRadius,
    colors,
    spacing,
    touchTarget,
    typography,
} from '@/styles/design-tokens';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface AddProductFormProps {
    onSubmit: (name: string, price: number, imageUri: string) => void;
    onCancel: () => void;
    initialValues?: {
        name: string;
        price: number;
        imageUri: string;
    };
    title?: string;
    submitLabel?: string;
}

export function AddProductForm({ onSubmit, onCancel, initialValues, title, submitLabel }: AddProductFormProps) {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme ?? 'light'];

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        if (initialValues) {
            setName(initialValues.name);
            setPrice(initialValues.price.toString());
            setImageUri(initialValues.imageUri);
            return;
        }

        setName('');
        setPrice('');
        setImageUri(null);
    }, [initialValues]);

    const handlePickImage = async () => {
        setLoading(true);
        setError(null);

        const result = await imageService.pickImage();

        if (result.success && result.uri) {
            setImageUri(result.uri);
        } else if (result.error) {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleSubmit = () => {
        setError(null);

        if (!name.trim()) {
            setError('Please enter a product name');
            return;
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            setError('Please enter a valid price');
            return;
        }

        if (!imageUri) {
            setError('Please select a product image');
            return;
        }

        onSubmit(name.trim(), parsedPrice, imageUri);
    };

    const isValid = name.trim() && price && imageUri;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.background }]}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text.primary }]}>
                        {title ?? 'Add New Product'}
                    </Text>
                </View>

                {/* Image Picker */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.text.primary }]}>Product Photo</Text>
                    <Pressable
                        onPress={handlePickImage}
                        disabled={loading}
                        style={[
                            styles.imagePicker,
                            { backgroundColor: theme.surface, borderColor: theme.border },
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator size="large" color={theme.primary} />
                        ) : imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                        ) : (
                            <View style={styles.imagePickerPlaceholder}>
                                <Text style={styles.imagePickerIcon}>📷</Text>
                                <Text style={[styles.imagePickerText, { color: theme.text.secondary }]}>
                                    Tap to select photo
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>

                {/* Name Input */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.text.primary }]}>Product Name</Text>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text.primary },
                        ]}
                        placeholder="Enter product name"
                        placeholderTextColor={theme.text.tertiary}
                        value={name}
                        onChangeText={setName}
                        maxLength={100}
                    />
                </View>

                {/* Price Input */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.text.primary }]}>Price</Text>
                    <TextInput
                        style={[
                            styles.input,
                            { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text.primary },
                        ]}
                        placeholder="0.00"
                        placeholderTextColor={theme.text.tertiary}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="decimal-pad"
                        maxLength={10}
                    />
                </View>

                {/* Error Message */}
                {error && (
                    <View style={[styles.errorContainer, { backgroundColor: theme.error + '20' }]}>
                        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
                    </View>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    <Pressable
                        onPress={onCancel}
                        style={({ pressed }) => [
                            styles.button,
                            styles.cancelButton,
                            { borderColor: theme.border },
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Text style={[styles.buttonText, { color: theme.text.primary }]}>Cancel</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleSubmit}
                        disabled={!isValid}
                        style={({ pressed }) => [
                            styles.button,
                            styles.submitButton,
                            { backgroundColor: theme.primary },
                            !isValid && styles.buttonDisabled,
                            pressed && isValid && styles.buttonPressed,
                        ]}
                    >
                        <Text style={[styles.submitButtonText]}>{submitLabel ?? 'Add Product'}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        gap: spacing.lg,
    },
    header: {
        paddingBottom: spacing.md,
    },
    title: {
        fontSize: typography.sizes.xxl,
        fontWeight: typography.weights.bold,
    },
    section: {
        gap: spacing.sm,
    },
    label: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    imagePicker: {
        height: 200,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    imagePickerPlaceholder: {
        alignItems: 'center',
        gap: spacing.sm,
    },
    imagePickerIcon: {
        fontSize: 48,
    },
    imagePickerText: {
        fontSize: typography.sizes.md,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    input: {
        height: touchTarget.minSize,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        paddingHorizontal: spacing.md,
        fontSize: typography.sizes.md,
    },
    errorContainer: {
        padding: spacing.md,
        borderRadius: borderRadius.sm,
    },
    errorText: {
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingTop: spacing.md,
    },
    button: {
        flex: 1,
        height: touchTarget.minSize,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
    },
    submitButton: {},
    buttonPressed: {
        opacity: 0.8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: typography.sizes.md,
        fontWeight: typography.weights.semibold,
    },
});
