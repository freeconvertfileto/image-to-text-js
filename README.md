# Image to Text (OCR)

Extract text from images using Tesseract.js OCR, running entirely in the browser.

**Live Demo:** https://file-converter-free.com/en/image-tools/image-to-text

## How It Works

When an image is selected, `Tesseract.recognize(file, lang, { logger })` is called with the chosen language code. Tesseract.js runs a WebAssembly build of the Tesseract OCR engine entirely in the browser without any server upload. A `logger` callback receives progress events that are displayed as a status update during the recognition process. After completion, the recognized text is displayed with word count and character count statistics. The text can be copied to the clipboard or downloaded as a `.txt` file.

## Features

- OCR powered by Tesseract.js (WebAssembly, fully browser-side)
- Multi-language selector (dozens of languages supported)
- Real-time progress feedback during recognition
- Word count and character count of extracted text
- Copy to clipboard or download as .txt

## Browser APIs Used

- Tesseract.js WebAssembly OCR engine
- FileReader API
- Clipboard API (`navigator.clipboard.writeText`)
- Blob / URL.createObjectURL for .txt download

## Code Structure

| File | Description |
|------|-------------|
| `image-to-text.js` | IIFE — Tesseract.js integration, language selector, progress callback, word/char count, copy and download |

## Usage

| Element ID | Purpose |
|------------|---------|
| `dropZone` | Drag-and-drop target for image |
| `fileInput` | File picker input |
| `langSelect` | OCR language selector |
| `progressStatus` | Recognition progress message |
| `textOutput` | Extracted text result area |
| `wordCount` | Word count of extracted text |
| `charCount` | Character count of extracted text |
| `copyBtn` | Copy extracted text to clipboard |
| `downloadBtn` | Download extracted text as .txt |

## License

MIT
