import { Share, Alert } from 'react-native';

/**
 * Opens the native share sheet.
 * @param {Object} content - The content to share.
 * @param {string} content.message - The main text message.
 * @param {string} [content.url] - URL to share (iOS primarily).
 * @param {string} [content.title] - Title of the content.
 */
export const shareContent = async ({ message, url, title }) => {
    try {
        const result = await Share.share({
            message: url ? `${message}\n${url}` : message,
            title: title,
            url: url, // iOS only
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // Shared with activity type of result.activityType
            } else {
                // Shared
            }
        } else if (result.action === Share.dismissedAction) {
            // Dismissed
        }
    } catch (error) {
        Alert.alert('Error', error.message);
    }
};
