# Music Player Application

A responsive music player application built with React, TypeScript, and SCSS. This application resembles the Spotify interface and allows users to browse, search, and play music tracks.

## Features

- Music playback with play/pause controls
- Responsive design for various screen sizes
- Search functionality for finding songs
- Favorites system using local storage
- Recently played tracks list using session storage
- Dynamic background colors based on album art
- Fluid animations and transitions

## Technologies Used

- React.js
- TypeScript
- SCSS
- React Bootstrap
- Vite
- Context API for state management

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
