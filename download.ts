import { Platform } from 'react-native';
import { copyToClipboard } from './clipboard';

// react-native-web has no native file-save API, but the browser does — a
// Blob + anchor click triggers a real download. Native builds have no
// equivalent here (no filesystem write without a Files/Documents picker
// module), so they fall back to a clipboard copy of the same content.
export async function downloadTextFile(filename: string, content: string): Promise<'downloaded' | 'copied' | 'failed'> {
  if (Platform.OS === 'web') {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return 'downloaded';
    } catch {
      return 'failed';
    }
  }
  const ok = await copyToClipboard(content);
  return ok ? 'copied' : 'failed';
}
