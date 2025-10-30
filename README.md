# GSK Chatbot Launcher Project

Hey there! This is a dynamic chatbot loader that helps you test different GSK product chatbots. Here's what you need to know:

## What This Project Does

This is a web app that lets you pick a product (like Nucala, Trelegy, Shingrix, etc.) and load its chatbot in either development or production mode. Think of it as a testing dashboard for chatbots.

## Files You Actually Need to Care About

### Main Files

**index.html**
This is your homepage - the page you see when you open the app. It has:
- A dropdown to select which product chatbot you want (Nucala, Shingrix, etc.)
- A dropdown to choose the environment (Development or Production)
- A "Load Chatbot" button to start the bot
- A "Clear & Reload" button to reset everything

**package.json**
This tells Node.js what the project needs. Right now it only needs `http-server` to run a local web server during development.

### JavaScript Files

**js/launcher.js** - The Brain of the Operation
This is where all the magic happens:
- Stores configuration for all the different products (50+ products!)
- Handles what happens when you click "Load Chatbot"
- Cleans up old chatbot instances when switching products
- Dynamically loads the chatbot configuration and scripts
- Creates those floating animated particles in the background

**js/main.js** - The SDK Builder
Once the launcher loads everything, this file:
- Checks if the chatbot SDK is ready
- Builds the Inbenta chatbot with the right credentials
- Handles language switching (English/Spanish)
- Makes sure the chatbot opens automatically after loading

**js/helpers/import-script.js** - Script Loader Helper
A simple utility that loads JavaScript files on-the-fly. Instead of hardcoding all scripts in HTML, this lets you load them when needed.

**js/helpers/get-sdk-script.js** - SDK URL Generator
This takes a product name and version, then builds the correct URL to fetch the Inbenta chatbot SDK from their CDN.

### Configuration

**conf/inbenta-conf.js** - The Big Configuration File
This is a massive file (~52,000 lines!) that contains:
- All the chatbot settings (colors, buttons, behaviors)
- API keys and domain keys for authentication
- Product-specific variables and parameters
- All the custom adapters bundled together (like Salesforce integration, tracking, etc.)
- Conversation window settings (header, footer, buttons)

Think of this as the "recipe book" that tells each chatbot how to look and behave.

### Styling

**assets/css/main.css**
All the styles that make the launcher look good:
- The gradient background
- Floating particle animations
- Button styles (that nice red GSK color)
- The card design with rounded corners
- Responsive layouts so it works on different screen sizes

## Files You Can Ignore

These files exist in your project but aren't being used:

- `index.js` and `index.min.js` - Not loaded anywhere
- Everything in the `css/` folder (*.scss files) - SCSS source files that aren't compiled
- Individual files in `js/adapters/` - They're bundled into conf/inbenta-conf.js
- Most files in `js/helpers/` - Also bundled into the conf file

## How It All Works Together

1. User opens **index.html** in browser
2. Browser loads **assets/css/main.css** (for styling) and **js/launcher.js**
3. User picks a product and clicks "Load Chatbot"
4. **launcher.js** creates configuration attributes and loads **conf/inbenta-conf.js**
5. **conf/inbenta-conf.js** loads **js/main.js**
6. **main.js** uses the helper files to fetch and build the Inbenta SDK
7. Chatbot appears on screen!

## Running the Project

```bash
npm install
npx http-server -p 8080
```

Then open http://localhost:8080 in your browser.

## Need to Add a New Product?

Go to **js/launcher.js** and add your product to the `PRODUCT_CONFIG` object. Follow the same pattern as existing products:

```javascript
'yourproduct': {
  src: 'YourProduct',      // Source identifier
  prod: 'YourProduct',     // Product name
  id: 'YourProduct'        // Product ID
}
```

Then add it to the dropdown in **index.html**.

## Questions?

If something breaks, check the browser console (F12) - there's tons of logging that shows you exactly what's loading and when. Look for messages like "Launching chatbot for:" or "Loading Product:".

Good luck! 🚀
