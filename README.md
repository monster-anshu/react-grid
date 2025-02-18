# React Grid

This React application is a spreadsheet implementation without any external library.

## Features

1. **Column Resizing**
2. **Row Resizing**
3. **Selection**
4. **Copy-Paste**
5. **Sorting**
6. **AI Auto-Complete**
7. **Undo Redo**

## Tech Stack

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Gemini AI**

### Resizing

![Resizing](static/resizing.gif)

### Single Selection

Select cell this click

![Single Selection](static/single-selection.gif)

### Multi selection Selection

Hold Ctr and select multiple cells

![Multi Selection](static/multiple-selection.gif)

### Range selection Selection

Hold Ctr + Shift for range selection

![Range Selection](static/range-selection.gif)

### Click and drag Selection

![Click and drag](static/click-drag.gif)

### Sorting

![Sorting](static/sorting.gif)

### AI Auto Fill

Select the magic icon at the end of non empty cell and drag and select cell that should be used for the ai auto completion.

If current selection is a AI selection the selection color will be blue otherwise green.

![AI auto fill](static/ai-1.gif)
![AI auto fill](static/ai-2.gif)

## Run locally

Clone repo

```bash
git clone https://github.com/monster-anshu/react-grid.git
cd react-grid
```

Add a `.env` file containing gemini ai api key for auto completion.

```bash
GEMINI_KEY=key
```

Start application

```bash
pnpm i
pnpm dev
```

Open http://localhost:3000
