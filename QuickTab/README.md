# QuickTab

A feature-rich Chrome Extension that replaces your new tab page with a beautiful, customizable productivity dashboard.

---

## ✨ Features

- **5 Themes** — MyDesk, W10 Lockscreen, Simplified, Big Ben, Gradient Blob
- **Live Weather Widget** — Real-time temperature, humidity, wind speed via OpenWeatherMap
- **Notepad** — Markdown-powered editor with split view, preview mode, and export (.txt / .md)
- **Todo List** — Add, complete, edit, delete tasks with local persistence
- **Bookmarks** — Quick-access favicon bookmarks, fully manageable from settings
- **Calendar** — Month view calendar widget
- **Calculator** — Inline CSP-safe expression calculator
- **YouTube Media Controller** — Control YouTube / YouTube Music playback from your dashboard
- **Search Bar** — Google, Bing, DuckDuckGo, or Yandex — supports URLs too
- **Settings Panel** — Theme switcher, color customizer, wallpaper, time format, and more

---

## 📁 Project Structure

```
QuickTab/
├── index.html              # Main new tab page
├── manifest.json           # Chrome Extension manifest (MV3)
├── bg.jpg                  # Default wallpaper
├── .gitignore
├── res/
│   ├── js/
│   │   ├── config.js       # ⚠️ Your secret keys (GITIGNORED — create this manually)
│   │   ├── script.js       # Core app logic & widgets
│   │   ├── background.js   # Service worker (media relay)
│   │   ├── settings.js     # Settings page logic
│   │   ├── youtube.js      # YouTube content script
│   │   ├── jquery.js       # jQuery (bundled)
│   │   └── marked.js       # Markdown parser (bundled)
│   ├── css/
│   │   ├── main.scss       # Primary styles (compile → main.css)
│   │   └── widgets.scss    # Widget styles (compile → widgets.css)
│   ├── theme/
│   │   ├── settings.html   # Settings page
│   │   ├── theme1/         # MyDesk
│   │   ├── theme2/         # W10 Lockscreen
│   │   ├── theme3/         # Simplified
│   │   ├── theme4/         # Big Ben
│   │   └── theme5/         # Gradient Blob
│   └── logo/               # Icons and SVG assets
```

---

## ⚙️ Configuration (API Keys)

QuickTab uses a **`config.js`** file to store sensitive keys. This file is **gitignored** and must be created manually.

### 1. Create the config file

Create the file at:
```
res/js/config.js
```

### 2. Paste the following and fill in your keys

```js
// ============================================================
// QuickTab — Config File
// ⚠️  This file is GITIGNORED — do NOT commit it
//     Add your secret keys here
// ============================================================

const QUICKTAB_CONFIG = {
    WEATHER_API_KEY: "your_openweathermap_api_key_here",
};
```

### 3. Get an OpenWeatherMap API Key

1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to **API Keys** in your dashboard
4. Copy your key and paste it into `config.js`

> **Free tier** is sufficient — it supports the Current Weather API used by QuickTab.

---

## 🚀 Installing in Chrome

Since QuickTab is an unpacked extension (not on the Chrome Web Store), you load it manually.

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/QuickTab.git
cd QuickTab/QuickTab
```

### Step 2 — Create your config file

Follow the [Configuration](#️-configuration-api-keys) section above.

### Step 3 — Open Chrome Extensions

Go to:
```
chrome://extensions
```

Or: **Chrome Menu → More Tools → Extensions**

### Step 4 — Enable Developer Mode

Toggle **Developer mode** ON (top-right corner of the Extensions page).

### Step 5 — Load the extension

1. Click **"Load unpacked"**
2. Select the **inner `QuickTab` folder** — the one that contains `manifest.json`

   ```
   QuickTab/
   └── QuickTab/       ← Select THIS folder
       ├── manifest.json
       ├── index.html
       └── ...
   ```

### Step 6 — Open a new tab

Press `Ctrl + T` — QuickTab should replace the default new tab page. ✅

---

## 🔄 Reloading After Changes

Whenever you make code changes:

1. Go to `chrome://extensions`
2. Find **QuickTab** and click the **↺ reload** button
3. Open a new tab

---

## 🎨 Themes

| Name | Description |
|---|---|
| **MyDesk** | Clean desktop-style layout with wallpaper |
| **W10 Lockscreen** | Windows 10 lockscreen inspired |
| **Simplified** | Minimal, distraction-free |
| **Big Ben** | Dark glassmorphism aesthetic |
| **Gradient Blob** | Animated canvas blobs with radial gradient background |

Switch themes from the **Settings panel** (gear icon on the dashboard).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | SCSS → CSS |
| Logic | Vanilla JavaScript + jQuery |
| Markdown | [Marked.js](https://marked.js.org/) |
| Weather | [OpenWeatherMap API](https://openweathermap.org/) |
| Storage | `localStorage` |
| Extension API | Chrome MV3 (Manifest Version 3) |

---

## 📝 Notes

- All user data (bookmarks, todo, notepad, theme settings) is stored in **`localStorage`** — it persists across sessions but is local to your browser profile.
- The `config.js` file is **never committed** to git. If you clone on a new machine, you must recreate it.
- SCSS files must be compiled to CSS. If you edit `.scss` files, run your SCSS compiler (e.g. the VS Code Live Sass Compiler extension).
