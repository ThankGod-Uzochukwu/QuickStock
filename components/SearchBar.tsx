import { useColorScheme } from '@/hooks/use-color-scheme';
import { borderRadius, colors, spacing, typography } from '@/styles/design-tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    onClear?: () => void;
}

export function SearchBar({ value, onChangeText, placeholder, onClear }: SearchBarProps) {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
            <Ionicons name="search" size={18} color={theme.text.tertiary} />
            <TextInput
                style={[styles.input, { color: theme.text.primary, fontFamily: typography.families.body }]}
                placeholder={placeholder ?? 'Search products'}
                placeholderTextColor={theme.text.tertiary}
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
            />
            {value.length > 0 && onClear && (
                <Pressable onPress={onClear} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={18} color={theme.text.tertiary} />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        fontSize: typography.sizes.md,
    },
    clearButton: {
        padding: 2,
    },
});
