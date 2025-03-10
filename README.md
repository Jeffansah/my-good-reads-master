# My Good Reads

A modern web application for searching books and managing your reading wishlist. Built with React and TypeScript.

🌐 **Live Demo**: [https://my-good-reads-master.vercel.app](https://my-good-reads-master.vercel.app)

## Features

- 🔍 Real-time book search with debounced API calls
- 📚 Responsive book listing with pagination
- ❤️ Wishlist management with local storage persistence
- 📱 Mobile-friendly design with collapsible wishlist panel
- 🧪 Comprehensive test coverage

## Tech Stack

- React 16
- TypeScript
- SCSS for styling
- Jest and React Testing Library for testing
- Google Books API for book data

> **Note:** This application uses the Google Books API which has rate limits. If you encounter "No books found" errors, even though your search query seems right, it might be due to:
>
> - Reaching the API rate limit
> - Too many requests in a short time period
> - Network connectivity issues
>
> Please wait a while before trying again if you encounter these issues.

## Prerequisites

- Node.js v20.18.1 or higher
- Yarn package manager

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Jeffansah/my-good-reads-master.git
   cd my-good-reads-master
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Start the development server:

   ```bash
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `yarn start` - Runs the app in development mode
- `yarn test` - Launches the test runner
- `yarn build` - Builds the app for production
- `yarn eject` - Ejects from Create React App

## Troubleshooting

### OpenSSL Legacy Provider Issue

The scripts in this project use the OpenSSL legacy provider to resolve Node.js compatibility issues. If you encounter any problems with this configuration, you can revert to the original scripts:

1. **Current Configuration** (with OpenSSL legacy provider):

   ```json
   "scripts": {
     "start": "NODE_OPTIONS=--openssl-legacy-provider react-scripts start",
     "build": "NODE_OPTIONS=--openssl-legacy-provider react-scripts build",
     "test": "NODE_OPTIONS=--openssl-legacy-provider react-scripts test",
     "eject": "react-scripts eject"
   }
   ```

2. **Original Configuration** (if the above causes issues):
   ```json
   "scripts": {
     "start": "react-scripts start",
     "build": "react-scripts build",
     "test": "react-scripts test",
     "eject": "react-scripts eject"
   }
   ```

Choose the configuration that works best with your Node.js environment.

## Usage

### Searching for Books

1. Type a book title, author, or topic in the search box
2. Results will appear automatically as you type (with a 500ms debounce)
3. Use the pagination controls to navigate through results

### Managing Your Wishlist

1. Click the heart icon on any book to add it to your wishlist
2. View your wishlist in the right panel (desktop) or bottom panel (mobile)
3. Remove books from your wishlist using the trash icon
4. Your wishlist persists between sessions using local storage

### Mobile Experience

- The wishlist panel collapses into a bottom drawer on mobile devices
- Tap to expand the wishlist
- Tap to collapse it
- The search interface adapts to smaller screens

## Testing

The application includes comprehensive test coverage:

- Unit tests for components and utility functions

Run the test suite:

```bash
yarn test
```

## Project Structure

```
src/
├── book-search/     # Book search components
├── context/         # React context providers
├── lib/            # Utility functions
├── types/          # TypeScript type definitions
├── wishlist/       # Wishlist components
└── assets/         # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License
