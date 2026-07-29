import { Platform } from 'react-native';
import * as ExpoClipboard from 'expo-clipboard';

// react-native-web doesn't implement the native Clipboard bridge the same
// way, and Alert.alert is a no-op on web (see PortfolioScreen) — so this
// copy helper takes the web path directly instead of routing through
// expo-clipboard's web shim, which depends on document focus timing.
export async function copyToClipboard(text: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fall through to legacy path below
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
  try {
    await ExpoClipboard.setStringAsync(text);
    return true;
  } catch {
    return false;
  }
}

export const founderProfileUrl = (startupId: string) => `https://waaw.co/p/${startupId}`;
