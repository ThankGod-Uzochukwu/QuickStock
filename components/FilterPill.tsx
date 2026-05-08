import { useColorScheme } from '@/hooks/use-color-scheme';
import { borderRadius, colors, spacing, typography } from '@/styles/design-tokens';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface FilterPillProps {
    label: string;
    selected?: boolean;
    onPress: () => void;
}

export function FilterPill({ label, selected, onPress }: FilterPillProps) {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme];

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.pill,
                {
                    backgroundColor: selected ? theme.primary : theme.surface,
                    borderColor: selected ? theme.primary : theme.border,
                },
                pressed && styles.pillPressed,
            ]}
        >
            <Text
                style={{
                    color: selected ? '#FFFFFF' : theme.text.primary,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.semibold,
                    fontFamily: typography.families.body,
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pill: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        borderWidth: 1,
    },
    pillPressed: {
        opacity: 0.85,
    },
});
