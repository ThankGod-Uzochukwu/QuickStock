import * as FileSystem from 'expo-file-system/legacy';

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
    private getBaseDirectory(): string {
        if (FileSystem.documentDirectory) {
            return FileSystem.documentDirectory;
        }

        if (FileSystem.cacheDirectory) {
            return FileSystem.cacheDirectory;
        }

        throw new Error('No file system directory available');
    }

    private getFilePath(key: string): string {
        return `${this.getBaseDirectory()}${key}.json`;
    }

    private async ensureBaseDirectory(): Promise<void> {
        const baseDirectory = this.getBaseDirectory();
        const info = await FileSystem.getInfoAsync(baseDirectory);

        if (!info.exists) {
            await FileSystem.makeDirectoryAsync(baseDirectory, { intermediates: true });
        }
    }

    async save<T>(key: string, value: T): Promise<void> {
        try {
            await this.ensureBaseDirectory();
            const filePath = this.getFilePath(key);
            const jsonString = JSON.stringify(value);
            await FileSystem.writeAsStringAsync(filePath, jsonString, {
                encoding: FileSystem.EncodingType.UTF8,
            });
        } catch (error) {
            console.error(`Storage save error for key "${key}":`, error);
            throw new Error(`Failed to save data: ${key}`);
        }
    }

    async load<T>(key: string): Promise<T | null> {
        try {
            await this.ensureBaseDirectory();
            const filePath = this.getFilePath(key);
            const info = await FileSystem.getInfoAsync(filePath);

            if (!info.exists) {
                return null;
            }

            const jsonString = await FileSystem.readAsStringAsync(filePath, {
                encoding: FileSystem.EncodingType.UTF8,
            });
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

