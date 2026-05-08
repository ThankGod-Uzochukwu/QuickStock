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

const CATALOG_SEED = [
    {
        name: 'Linen Market Tote',
        price: 28.5,
        imageUri:
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Ceramic Pour-Over Set',
        price: 42,
        imageUri:
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Studio Desk Lamp',
        price: 79,
        imageUri:
            'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Essential Travel Kit',
        price: 54.25,
        imageUri:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Soft Knit Throw',
        price: 66,
        imageUri:
            'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
    },
    {
        name: 'Glass Storage Trio',
        price: 31,
        imageUri:
            'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=800&q=80',
    },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchCatalog(): Promise<Product[]> {
    await delay(700);

    if (Math.random() < 0.1) {
        throw new Error('Unable to reach the catalog service.');
    }

    return CATALOG_SEED.map((seed, index) => ({
        id: `seed_${Date.now()}_${index}`,
        name: seed.name,
        price: seed.price,
        imageUri: seed.imageUri,
        createdAt: Date.now() - index * 1000 * 60 * 60,
    }));
}
