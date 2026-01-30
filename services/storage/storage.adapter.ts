import * as FileSystem from 'expo-file-system';

const STORAGE_KEYS = {
    PRODUCTS: 'products_v1',
    APP_STATE: 'app_state_v1',
} as const;

export interface StorageAdapter {
    save<T>(key: string, value: T): Promise<void>;
    load<T>(key: string): Promise<T | null>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}

/**
 * File system-based storage implementation.
 * Preferred over AsyncStorage for larger payloads and better performance.
 */
class FileSystemStorage implements StorageAdapter {
    private getFilePath(key: string): string {
        return `${FileSystem.documentDirectory}${key}.json`;
    }

    async save<T>(key: string, value: T): Promise<void> {
        try {
            const filePath = this.getFilePath(key);
            const jsonString = JSON.stringify(value);
            await FileSystem.writeAsStringAsync(filePath, jsonString);
        } catch (error) {
            console.error(`Storage save error for key "${key}":`, error);
            throw new Error(`Failed to save data: ${key}`);
        }
    }

    async load<T>(key: string): Promise<T | null> {
        try {
            const filePath = this.getFilePath(key);
            const info = await FileSystem.getInfoAsync(filePath);

            if (!info.exists) {
                return null;
            }

            const jsonString = await FileSystem.readAsStringAsync(filePath);
            return JSON.parse(jsonString) as T;
        } catch (error) {
            console.error(`Storage load error for key "${key}":`, error);
            return null;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            const filePath = this.getFilePath(key);
            const info = await FileSystem.getInfoAsync(filePath);

            if (info.exists) {
                await FileSystem.deleteAsync(filePath);
            }
        } catch (error) {
            console.error(`Storage remove error for key "${key}":`, error);
            throw new Error(`Failed to remove data: ${key}`);
        }
    }

    async clear(): Promise<void> {
        try {
            // Remove all known keys
            const keys = Object.values(STORAGE_KEYS);
            await Promise.all(keys.map((key) => this.remove(key)));
        } catch (error) {
            console.error('Storage clear error:', error);
            throw new Error('Failed to clear storage');
        }
    }
}

/**
 * Singleton instance - production storage
 */
export const storage: StorageAdapter = new FileSystemStorage();

/**
 * Mock storage for testing
 */
export class MockStorage implements StorageAdapter {
    private store = new Map<string, string>();

    async save<T>(key: string, value: T): Promise<void> {
        this.store.set(key, JSON.stringify(value));
    }

    async load<T>(key: string): Promise<T | null> {
        const item = this.store.get(key);
        return item ? (JSON.parse(item) as T) : null;
    }

    async remove(key: string): Promise<void> {
        this.store.delete(key);
    }

    async clear(): Promise<void> {
        this.store.clear();
    }
}

export { STORAGE_KEYS };

