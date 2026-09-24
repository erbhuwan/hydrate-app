# Privacy Policy for Hydrate

**Effective Date:** September 24, 2026  
**Last Updated:** September 24, 2026

Hydrate ("we", "our", or "the app") is a privacy-first, open-source macOS and desktop hydration reminder and wellness tracking application. We respect your privacy and are committed to protecting your personal data.

---

## 1. Information We Collect and Process

### A. Local Hydration & Ergonomics Data
- **What is stored:** Daily water intake logs, reminder intervals, custom sound settings, and active desk/sitting duration.
- **Where it is stored:** All data is stored locally on your device in standard JSON files.

### B. Google Account & Cloud Services (Optional)
When you choose to connect your Google account, Hydrate uses the following permissions:
- **Google Drive (`https://www.googleapis.com/auth/drive.appdata`):** Used exclusively to save and restore your hydration backup file (`hydrate_backup.json`) inside your private, hidden Google Drive application folder (`appDataFolder`). Hydrate does not have access to any other files or folders in your Google Drive.
- **Google Calendar (`https://www.googleapis.com/auth/calendar.readonly`):** Used in a read-only manner to display your today's schedule on the dashboard and automatically snooze reminder notifications while you are in busy meetings. We never create, edit, or delete calendar events.
- **Basic Profile & Email (`openid`, `userinfo.email`, `userinfo.profile`):** Used to display your name and profile avatar inside the app.

---

## 2. How Your Data Is Used
- To calculate your daily hydration progress and notify you when it's time to drink water.
- To pause reminders while you are in scheduled meetings or away from your desk.
- To synchronize your settings across your devices via your personal Google Drive account.

---

## 3. Data Sharing & Third Parties
- **Zero Third-Party Tracking:** We do not sell, rent, monetize, or transmit your personal data or hydration logs to any third-party advertising or analytics networks.
- **Direct Google API Communication:** All cloud sync communication happens directly between the desktop app and official Google APIs using secure HTTPS.

---

## 4. Data Security & Storage
- Authentication tokens stored locally on macOS are encrypted using the native macOS Keychain via Electron `safeStorage`.
- You can disconnect your Google account or delete your local data at any time directly through the app settings.

---

## 5. Contact & Open Source
Hydrate is open source and community-driven. If you have any questions or privacy inquiries, please contact:
- **Developer Email:** `v1acharya34@gmail.com`
- **Source Code Repository:** `https://github.com/erbhuwan/hydrate-app`
