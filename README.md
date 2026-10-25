# BillSamjho

Explains Indian hospital bills and insurance claim decisions in simple words (English, Hindi, Bengali, Punjabi, Marathi).
Flow: hospital bill -> insurance question -> policy -> insurer decision -> complaint letter. Has voice input (mic) and read-aloud (speaker).
Explanation tool only, not legal, medical or insurance advice. Use sample or redacted data only while testing.

## Run on your computer (localhost)
1. Install Node.js 18 or newer from nodejs.org
2. Open a terminal in this folder and run:  node server.js
3. Open http://localhost:3000

Settings are in `.env` (API_KEY, API_URL, MODEL, PORT, HOST). The key stays on the server and is never sent to the browser.
Do not share or upload this folder with the real key inside. Use Chrome or Edge for voice input.

## Files
- server.js: tiny local server, forwards chat requests to the AI API
- index.html: the local chatbot page (PDF, photo and text upload, voice in/out)
- .env: your API key and settings
- billsamjho-chat.html: the same chatbot as published inside Claude (no key needed there; PDFs are read in the browser)
- archive/billsamjho-v1-form.html: the first form-style prototype
