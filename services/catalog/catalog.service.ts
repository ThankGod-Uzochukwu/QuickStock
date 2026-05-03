import { Product } from '@/features/products/types';

interface FakeStoreProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating?: {
        rate?: number;
        count?: number;
    };
}

const mockCatalog: Product[] = [
    {
        id: 'aurora-headphones',
        name: 'Aurora Noise Canceling Headphones',
        price: 189.99,
        imageUri: 'https://picsum.photos/seed/quickstock-headphones/1200/1200',
        createdAt: Date.now() - 1000 * 60 * 30,
        description: 'Immersive over-ear headphones tuned for rich bass, clean mids, and long-haul comfort.',
        category: 'Audio',
        rating: 4.8,
        reviewCount: 312,
        inStock: 18,
        featured: true,
        badge: 'Best Seller',
        tags: ['Audio', 'Wireless', 'Travel'],
    },
    {
        id: 'nova-smartwatch',
        name: 'Nova Smartwatch X2',
        price: 149.5,
        imageUri: 'https://picsum.photos/seed/quickstock-watch/1200/1200',
        createdAt: Date.now() - 1000 * 60 * 90,
        description: 'A lightweight fitness companion with all-day battery and vivid always-on display.',
        category: 'Wearables',
        rating: 4.7,
        reviewCount: 205,
        inStock: 24,
        featured: true,
        badge: 'New',
        tags: ['Wearables', 'Fitness', 'Smart'],
    },
    {
        id: 'pixel-pro-cam',
        name: 'Pixel Pro Camera',
        price: 299.0,
        imageUri: 'https://picsum.photos/seed/quickstock-camera/1200/1200',
        createdAt: Date.now() - 1000 * 60 * 120,
        description: 'Capture crisp photos and cinematic video with a compact mirrorless body.',
        category: 'Photography',
        rating: 4.9,
        reviewCount: 141,
        inStock: 12,
        featured: false,
        tags: ['Photography', 'Creator', 'Portable'],
    },
    {
        id: 'orbit-speaker',
        name: 'Orbit Smart Speaker',
        price: 79.0,
        imageUri: 'https://picsum.photos/seed/quickstock-speaker/1200/1200',
        createdAt: Date.now() - 1000 * 60 * 150,
        description: 'Room-filling sound with voice control, deep low-end, and multiroom pairing.',
        category: 'Audio',
        rating: 4.5,
        reviewCount: 408,
        inStock: 40,
        featured: false,
        badge: 'Value',
        tags: ['Audio', 'Home', 'Voice'],
    },
    {
        id: 'glide-ride-stand',
        name: 'Glide Ride Phone Stand',
        price: 24.99,
        imageUri: 'https://picsum.photos/seed/quickstock-stand/1200/1200',
        createdAt: Date.now() - 1000 * 60 * 180,
        description: 'An adjustable aluminum desk stand that keeps your setup clean and ready.',
        category: 'Accessories',
        rating: 4.6,
        reviewCount: 118,
        inStock: 64,
        featured: false,
        tags: ['Desk', 'Accessories', 'Mobile'],
    },
    {
        id: 'zen-pro-keyboard',
        name: 'Zen Pro Mechanical Keyboard',
        price: 129.99,
        imageUri: 'https://picsum.photos/seed/quickstock-keyboard/1200/1200',
        createdAt: Date.now() - 1000 * 60 * 210,
        description: 'A tactile low-profile board with hot-swappable switches and a smooth typing feel.',
        category: 'Workspace',
        rating: 4.9,
        reviewCount: 95,
        inStock: 20,
        featured: true,
        badge: 'Editor Pick',
        tags: ['Workspace', 'Typing', 'Premium'],
    },
    {
        id: 'lumen-lamp',
        name: 'Lumen Ambient Desk Lamp',
        price: 54.75,
        imageUri: 'https://picsum.photos/seed/quickstock-lamp/1200/1200',
        createdAt: Date.now() - 1000 * 60 * 240,
        description: 'Soft adjustable lighting designed to add warmth without eye strain.',
        category: 'Home',
        rating: 4.4,
        reviewCount: 67,
        inStock: 29,
        featured: false,
        tags: ['Home', 'Lighting', 'Desk'],
    },
    {
        id: 'pulse-earbuds',
        name: 'Pulse True Wireless Earbuds',
        price: 99.99,
        imageUri: 'https://picsum.photos/seed/quickstock-earbuds/1200/1200',
        createdAt: Date.now() - 1000 * 60 * 270,
        description: 'Pocketable buds with punchy audio, fast pairing, and a compact charging case.',
        category: 'Audio',
        rating: 4.7,
        reviewCount: 251,
        inStock: 33,
        featured: true,
        badge: 'Hot',
        tags: ['Audio', 'Portable', 'Daily'],
    },
];

const apiDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function toTitleCase(value: string): string {
    return value
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
}

function normalizeCategory(category: string): string {
    const compact = category.trim().toLowerCase();

    if (compact === 'jewelery') {
        return 'Jewelry';
    }

    return toTitleCase(compact);
}

function mapFakeStoreProduct(item: FakeStoreProduct): Product {
    const normalizedCategory = normalizeCategory(item.category);
    const rating = Number(item.rating?.rate ?? 4);
    const reviewCount = Number(item.rating?.count ?? 0);

    return {
        id: String(item.id),
        name: item.title,
        price: Number(item.price),
        imageUri: item.image,
        createdAt: Date.now() - Number(item.id) * 1000,
        description: item.description,
        category: normalizedCategory,
        rating: Number.isFinite(rating) ? rating : 4,
        reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
        inStock: 20 + (Number(item.id) % 17),
        featured: Number(item.id) % 3 === 0,
        badge: Number(item.id) % 5 === 0 ? 'Trending' : undefined,
        tags: [normalizedCategory, 'Online', 'Mock API'],
    };
}

function isProductShape(value: unknown): value is Product {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Partial<Product>;
    return (
        typeof candidate.id === 'string' &&
        typeof candidate.name === 'string' &&
        typeof candidate.price === 'number' &&
        typeof candidate.imageUri === 'string'
    );
}

function isFakeStoreShape(value: unknown): value is FakeStoreProduct {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const candidate = value as Partial<FakeStoreProduct>;
    return (
        typeof candidate.id === 'number' &&
        typeof candidate.title === 'string' &&
        typeof candidate.price === 'number' &&
        typeof candidate.image === 'string'
    );
}

export async function fetchCatalogProducts(): Promise<Product[]> {
    const baseUrl = process.env.EXPO_PUBLIC_MOCK_API_URL;

    if (baseUrl) {
        const response = await fetch(`${baseUrl.replace(/\/$/, '')}/products`);

        if (!response.ok) {
            throw new Error('Unable to fetch catalog');
        }

        const payload = (await response.json()) as unknown;

        if (!Array.isArray(payload)) {
            throw new Error('Invalid catalog payload');
        }

        if (payload.every(isProductShape)) {
            return payload;
        }

        if (payload.every(isFakeStoreShape)) {
            return payload.map(mapFakeStoreProduct);
        }

        throw new Error('Unsupported catalog response shape');
    }

    await apiDelay(600);
    return mockCatalog;
}

export async function submitMockOrder(orderId: string): Promise<{ orderId: string; confirmationCode: string }> {
    await apiDelay(750);

    return {
        orderId,
        confirmationCode: `QS-${orderId.slice(-6).toUpperCase()}`,
    };
}

export const catalogCategories = [
    'All',
    'Audio',
    'Wearables',
    'Photography',
    'Accessories',
    'Workspace',
    'Home',
    'Electronics',
    'Jewelry',
    "Men's Clothing",
    "Women's Clothing",
];