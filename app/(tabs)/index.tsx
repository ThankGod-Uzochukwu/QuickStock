/**
 * Main products screen.
 * 
 * Entry point for the app - displays products and allows adding new ones.
 */

import { AddProductForm } from '@/components/AddProductForm';
import { ProductDetails } from '@/components/ProductDetails';
import { ProductList } from '@/components/ProductList';
import {
  addProduct,
  initializeNotifications,
  loadProducts,
  removeProduct,
  updateProduct,
} from '@/features/products/products.actions';
import {
  selectIsProductLimitReached,
  selectProductsSortedByDate,
  selectRemainingProductSlots,
} from '@/features/products/products.selectors';
import { Product, PRODUCT_LIMITS } from '@/features/products/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { borderRadius, colors, spacing, touchTarget } from '@/styles/design-tokens';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];
  const dispatch = useAppDispatch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const products = useAppSelector(selectProductsSortedByDate);
  const isLimitReached = useAppSelector(selectIsProductLimitReached);
  const remainingSlots = useAppSelector(selectRemainingProductSlots);

  // Initialize on mount
  useEffect(() => {
    dispatch(loadProducts());
    dispatch(initializeNotifications());
  }, [dispatch]);

  const handleAddProduct = async (name: string, price: number, imageUri: string) => {
    await dispatch(addProduct(name, price, imageUri));
    setShowAddModal(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    await dispatch(removeProduct(productId));
    if (selectedProduct?.id === productId) {
      setShowDetailsModal(false);
      setSelectedProduct(null);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditModal(true);
    setShowDetailsModal(false);
  };

  const handleUpdateProduct = async (name: string, price: number, imageUri: string) => {
    if (!editingProduct) {
      return;
    }

    await dispatch(updateProduct(editingProduct.id, name, price, imageUri));
    setShowEditModal(false);
    if (selectedProduct?.id === editingProduct.id) {
      setSelectedProduct({ ...selectedProduct, name, price, imageUri });
    }
    setEditingProduct(null);
  };

  const handleOpenAddModal = () => {
    if (isLimitReached) {
      Alert.alert(
        'Limit Reached',
        `You can only add up to ${PRODUCT_LIMITS.MAX_PRODUCTS} products.`,
        [{ text: 'OK' }]
      );
      return;
    }
    setShowAddModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View>
          <Text style={[styles.title, { color: theme.text.primary }]}>QuickStock</Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            {remainingSlots} of {PRODUCT_LIMITS.MAX_PRODUCTS} slots remaining
          </Text>
        </View>
      </View>

      {/* Product List */}
      <View style={styles.content}>
        <ProductList
          products={products}
          onDeleteProduct={handleDeleteProduct}
          onEditProduct={handleEditProduct}
          onSelectProduct={handleSelectProduct}
        />
      </View>

      {/* Add Button */}
      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <Pressable
          onPress={handleOpenAddModal}
          disabled={isLimitReached}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: theme.primary },
            isLimitReached && styles.addButtonDisabled,
            pressed && !isLimitReached && styles.addButtonPressed,
          ]}
        >
          <Text style={styles.addButtonText}>
            {isLimitReached ? 'Limit Reached' : '+ Add Product'}
          </Text>
        </Pressable>
      </View>

      {/* Add Product Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <AddProductForm onSubmit={handleAddProduct} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowEditModal(false);
          setEditingProduct(null);
        }}
      >
        <AddProductForm
          onSubmit={handleUpdateProduct}
          onCancel={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          title="Edit Product"
          submitLabel="Save Changes"
          initialValues={
            editingProduct
              ? {
                name: editingProduct.name,
                price: editingProduct.price,
                imageUri: editingProduct.imageUri,
              }
              : undefined
          }
        />
      </Modal>

      {/* Product Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onClose={() => setShowDetailsModal(false)}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  addButton: {
    height: touchTarget.minSize + 8,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});