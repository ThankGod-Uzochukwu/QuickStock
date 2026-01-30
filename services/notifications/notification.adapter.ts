import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export interface NotificationAdapter {
    requestPermissions(): Promise<boolean>;
    scheduleNotification(title: string, body: string): Promise<void>;
}

class ExpoNotificationService implements NotificationAdapter {
    async requestPermissions(): Promise<boolean> {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            return finalStatus === 'granted';
        } catch (error) {
            console.error('Failed to request notification permissions:', error);
            return false;
        }
    }

    async scheduleNotification(title: string, body: string): Promise<void> {
        try {
            // On iOS, ensure permissions are granted
            if (Platform.OS === 'ios') {
                const hasPermission = await this.requestPermissions();
                if (!hasPermission) {
                    console.warn('Notification permissions not granted');
                    return;
                }
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                },
                trigger: null, // Immediate notification
            });
        } catch (error) {
            console.error('Failed to schedule notification:', error);
            // Don't throw - notifications are non-critical
        }
    }
}

/**
 * Mock notification service for testing
 */
export class MockNotificationService implements NotificationAdapter {
    public notifications: Array<{ title: string; body: string }> = [];

    async requestPermissions(): Promise<boolean> {
        return true;
    }

    async scheduleNotification(title: string, body: string): Promise<void> {
        this.notifications.push({ title, body });
    }

    clear(): void {
        this.notifications = [];
    }
}

export const notificationService: NotificationAdapter = new ExpoNotificationService();
