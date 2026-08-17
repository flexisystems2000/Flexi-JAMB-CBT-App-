// back-handler.js
document.addEventListener('DOMContentLoaded', async () => {
  // Only run inside Capacitor
  if (!window.Capacitor) return;

  try {
    const { App } = await import('@capacitor/app');

    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        // Go to previous page in history
        window.history.back();
      } else {
        // Optional: Exit the app when on the home page
        // App.exitApp();
        
        // Or just do nothing (stay on current page)
      }
    });
  } catch (err) {
    console.warn('Back button handler failed:', err);
  }
});
