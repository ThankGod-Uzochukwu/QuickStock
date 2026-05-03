// import { Storefront } from '@/components/Storefront';
// import { selectProductsSortedByDate } from '@/features/products/products.selectors';
// import { useAppSelector } from '@/store/hooks';
// import React from 'react';
// import { StyleSheet, View } from 'react-native';

// export default function HomeScreen() {
//   const products = useAppSelector(selectProductsSortedByDate);

//   return (
//     <View style={styles.container}>
//       <Storefront products={products} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });



import { Storefront } from '@/components/Storefront';
import { selectProductsSortedByDate } from '@/features/products/products.selectors';
import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

class HomeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  state = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>QuickStock</Text>
          <Text style={styles.fallbackBody}>
            The home screen failed to render. Tap retry to try mounting it again.
          </Text>
          {this.state.errorMessage ? <Text style={styles.fallbackError}>{this.state.errorMessage}</Text> : null}
          <Pressable
            onPress={() => this.setState({ hasError: false, errorMessage: '' })}
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function HomeScreen() {
  const products = useAppSelector(selectProductsSortedByDate);

  return (
    <View style={styles.container}>
      <HomeErrorBoundary>
        <Storefront products={products} />
      </HomeErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#F6F5F1',
  },
  fallbackTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#14120F',
  },
  fallbackBody: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: '#5F574D',
  },
  fallbackError: {
    fontSize: 13,
    color: '#D64545',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 9999,
    backgroundColor: '#E4572E',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});