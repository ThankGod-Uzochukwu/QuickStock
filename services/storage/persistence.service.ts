import { storage } from './storage.adapter';

/**
 * Current state version.
 * Increment this when state shape changes.
 */
export const CURRENT_STATE_VERSION = 1;

/**
 * Versioned state wrapper
 */
export interface PersistedState<T> {
    version: number;
    data: T;
    timestamp: number;
}

/**
 * Migration function type
 */
type MigrationFn<T> = (oldState: unknown) => T;

/**
 * Migration registry.
 * Add new migrations when state shape changes.
 * 
 * Example:
 * Version 1 -> 2: Added 'description' field to products
 * const migrationV2: MigrationFn<StateV2> = (oldState: any) => ({
 *   ...oldState,
 *   products: oldState.products.map(p => ({ ...p, description: '' }))
 * })
 */
const migrations: Record<number, MigrationFn<unknown>> = {
    // Migrations from version X to X+1
    // 2: migrationV2,
    // 3: migrationV3,
};

/**
 * Persist state to storage with version metadata
 */
export async function persistState<T>(key: string, data: T): Promise<void> {
    const wrappedState: PersistedState<T> = {
        version: CURRENT_STATE_VERSION,
        data,
        timestamp: Date.now(),
    };

    await storage.save(key, wrappedState);
}

/**
 * Load and migrate state from storage.
 * Returns null if state doesn't exist or migration fails.
 */
export async function loadPersistedState<T>(key: string): Promise<T | null> {
    try {
        const persisted = await storage.load<PersistedState<T>>(key);

        if (!persisted) {
            return null;
        }

        // Check if migration is needed
        if (persisted.version === CURRENT_STATE_VERSION) {
            return persisted.data;
        }

        // Migrate forward
        console.warn(
            `Migrating state from version ${persisted.version} to ${CURRENT_STATE_VERSION}`
        );

        const migrated = migrateState(persisted.data, persisted.version);
        return migrated as T;
    } catch (error) {
        console.error('Failed to load persisted state:', error);
        return null;
    }
}

/**
 * Apply migrations sequentially from old version to current
 */
function migrateState(data: unknown, fromVersion: number): unknown {
    let migrated = data;

    for (let v = fromVersion; v < CURRENT_STATE_VERSION; v++) {
        const migration = migrations[v + 1];

        if (!migration) {
            throw new Error(`Missing migration from version ${v} to ${v + 1}`);
        }

        migrated = migration(migrated);
    }

    return migrated;
}

/**
 * Clear all persisted state (for debugging/testing)
 */
export async function clearPersistedState(): Promise<void> {
    await storage.clear();
}
