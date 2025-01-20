export async function requestNotificationPermission() {
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
      }

      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    export function scheduleNotification(title: string, options: NotificationOptions, timestamp: number) {
      const now = Date.now();
      const delay = timestamp - now;

      if (delay <= 0) {
        if (Notification.permission === 'granted') {
          new Notification(title, options);
        }
        return;
      }

      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification(title, options);
        }
      }, delay);
    }
