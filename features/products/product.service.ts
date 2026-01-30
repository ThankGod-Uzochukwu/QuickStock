import { Product, PRODUCT_LIMITS, ValidationResult } from './types';

/**
 * Generate a unique ID for a product.
 * Uses timestamp + random for uniqueness without external dependencies.
 */
export function generateProductId(): string {
    return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate product name
 */
export function validateProductName(name: string): ValidationResult<string> {
    const trimmed = name.trim();

    if (trimmed.length === 0) {
        return { valid: false, error: 'Product name is required' };
    }

    if (trimmed.length > PRODUCT_LIMITS.MAX_NAME_LENGTH) {
        return {
            valid: false,
            error: `Product name must be ${PRODUCT_LIMITS.MAX_NAME_LENGTH} characters or less`,
        };
    }

    return { valid: true, data: trimmed };
}

/**
 * Validate product price
 */
export function validateProductPrice(price: number): ValidationResult<number> {
    if (isNaN(price)) {
        return { valid: false, error: 'Price must be a valid number' };
    }

    if (price < PRODUCT_LIMITS.MIN_PRICE) {
        return { valid: false, error: 'Price cannot be negative' };
    }

    if (price > PRODUCT_LIMITS.MAX_PRICE) {
        return {
            valid: false,
            error: `Price cannot exceed ${PRODUCT_LIMITS.MAX_PRICE}`,
        };
    }

    // Round to 2 decimal places
    const rounded = Math.round(price * 100) / 100;
    return { valid: true, data: rounded };
}

/**
 * Validate image URI
 */
export function validateImageUri(uri: string): ValidationResult<string> {
    const trimmed = uri.trim();

    if (trimmed.length === 0) {
        return { valid: false, error: 'Product image is required' };
    }

    // Basic URI format validation
    if (!trimmed.startsWith('file://') && !trimmed.startsWith('http')) {
        return { valid: false, error: 'Invalid image URI format' };
    }

    return { valid: true, data: trimmed };
}

/**
 * Check if product limit has been reached
 */
export function isProductLimitReached(currentCount: number): boolean {
    return currentCount >= PRODUCT_LIMITS.MAX_PRODUCTS;
}

/**
 * Get remaining product slots
 */
export function getRemainingProductSlots(currentCount: number): number {
    return Math.max(0, PRODUCT_LIMITS.MAX_PRODUCTS - currentCount);
}

/**
 * Validate complete product data before creation
 */
export function validateProductData(
    name: string,
    price: number,
    imageUri: string
): ValidationResult<{ name: string; price: number; imageUri: string }> {
    const nameValidation = validateProductName(name);
    if (!nameValidation.valid) {
        return nameValidation;
    }

    const priceValidation = validateProductPrice(price);
    if (!priceValidation.valid) {
        return priceValidation;
    }

    const imageValidation = validateImageUri(imageUri);
    if (!imageValidation.valid) {
        return imageValidation;
    }

    return {
        valid: true,
        data: {
            name: nameValidation.data,
            price: priceValidation.data,
            imageUri: imageValidation.data,
        },
    };
}

/**
 * Create a new product with validated data
 */
export function createProduct(
    name: string,
    price: number,
    imageUri: string
): ValidationResult<Product> {
    const validation = validateProductData(name, price, imageUri);

    if (!validation.valid) {
        return validation;
    }

    const product: Product = {
        id: generateProductId(),
        name: validation.data.name,
        price: validation.data.price,
        imageUri: validation.data.imageUri,
        createdAt: Date.now(),
    };

    return { valid: true, data: product };
}

/**
 * Update an existing product with validated data
 */
export function updateProductData(
    existing: Product,
    name: string,
    price: number,
    imageUri: string
): ValidationResult<Product> {
    const validation = validateProductData(name, price, imageUri);

    if (!validation.valid) {
        return validation;
    }

    return {
        valid: true,
        data: {
            ...existing,
            name: validation.data.name,
            price: validation.data.price,
            imageUri: validation.data.imageUri,
        },
    };
}
