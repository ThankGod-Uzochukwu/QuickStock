import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export interface ImagePickerResult {
    success: boolean;
    uri?: string;
    error?: string;
}

export interface ImageService {
    pickImage(): Promise<ImagePickerResult>;
    requestPermissions(): Promise<boolean>;
}

const IMAGE_CONFIG = {
    MAX_WIDTH: 800,
    MAX_HEIGHT: 800,
    COMPRESS_QUALITY: 0.7,
} as const;

class ExpoImageService implements ImageService {
    async requestPermissions(): Promise<boolean> {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Failed to request image picker permissions:', error);
            return false;
        }
    }

    async pickImage(): Promise<ImagePickerResult> {
        try {
            // Ensure permissions
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                return {
                    success: false,
                    error: 'Permission to access media library was denied',
                };
            }

            // Launch picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], // Square images for consistency
                quality: 1, // Pick at full quality, we'll compress ourselves
            });

            if (result.canceled) {
                return { success: false, error: 'Image selection cancelled' };
            }

            // Optimize the image
            const optimizedUri = await this.optimizeImage(result.assets[0].uri);

            return { success: true, uri: optimizedUri };
        } catch (error) {
            console.error('Image picker error:', error);
            return {
                success: false,
                error: 'Failed to pick image. Please try again.',
            };
        }
    }

    /**
     * Resize and compress image.
     * This is crucial for long-term app performance.
     */
    private async optimizeImage(uri: string): Promise<string> {
        try {
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [
                    {
                        resize: {
                            width: IMAGE_CONFIG.MAX_WIDTH,
                            height: IMAGE_CONFIG.MAX_HEIGHT,
                        },
                    },
                ],
                {
                    compress: IMAGE_CONFIG.COMPRESS_QUALITY,
                    format: ImageManipulator.SaveFormat.JPEG,
                }
            );

            return manipulatedImage.uri;
        } catch (error) {
            console.error('Image optimization error:', error);
            // Return original if optimization fails
            return uri;
        }
    }
}

/**
 * Mock image service for testing
 */
export class MockImageService implements ImageService {
    public shouldSucceed = true;
    public mockUri = 'file://mock-image.jpg';

    async requestPermissions(): Promise<boolean> {
        return this.shouldSucceed;
    }

    async pickImage(): Promise<ImagePickerResult> {
        if (!this.shouldSucceed) {
            return { success: false, error: 'Mock error' };
        }
        return { success: true, uri: this.mockUri };
    }
}

export const imageService: ImageService = new ExpoImageService();
