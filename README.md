# London Experiences Swipe App

A modern React web application that lets you explore London experiences through an interactive map and a swipeable card interface (similar to Bumble). Discover amazing activities, swipe right to save your favorites, and explore what London has to offer!

## Features

- 🗺️ **Interactive Map**: View London experiences on an interactive Leaflet map
- 💳 **Swipeable Cards**: Browse experiences with a smooth, Bumble-style swipe interface
- ⭐ **Rich Details**: See ratings, reviews, prices, categories, and descriptions for each experience
- 💾 **Save Favorites**: Swipe right to save experiences to your local storage
- 📱 **Responsive Design**: Works beautifully on both desktop and mobile devices
- 🎨 **Modern UI**: Beautiful, clean interface with smooth animations

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/swipe_to_explore.git
cd swipe_to_explore
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or the next available port).

### 4. Open in Browser

Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`).

## Usage

1. **View the Map**: On the home screen, you'll see a map of London with pins marking different experiences
2. **Explore Nearby**: Click the "Explore Nearby" button to enter swipe mode
3. **Swipe Through Cards**: 
   - Swipe right (or click Save) to save an experience
   - Swipe left (or click Skip) to move to the next experience
4. **View Details**: Each card shows:
   - High-quality image
   - Title and description
   - Star rating and review count
   - Price range
   - Category tags
5. **Track Progress**: See your progress and saved count at the top of the swipe view

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Deploying to GitLab Pages

This project is configured for GitLab Pages deployment.

### Automatic Deployment

1. Push your code to the `main` branch
2. GitLab CI/CD will automatically build and deploy the site
3. The site will be available at your GitLab Pages URL (check Settings > Pages in your GitLab project)

### Configuration

- CI/CD pipeline: `.gitlab-ci.yml`
- Base path: Configured in `vite.config.js` for GitLab Pages
- Build output: `public/` folder (created automatically by CI/CD)

## Deploying to GitHub Pages

### Option 1: Using npm script (Recommended)

1. Make sure your repository is set up on GitHub
2. Update the `base` path in `vite.config.js` to match your repository name:
   ```js
   base: '/your-repo-name/'
   ```
3. Run the deploy command:
   ```bash
   npm run deploy
   ```
4. Go to your repository settings on GitHub
5. Navigate to Pages settings
6. Select the `gh-pages` branch as the source
7. Your site will be available at `https://yourusername.github.io/your-repo-name/`

### Option 2: Manual Deployment

1. Build the project: `npm run build`
2. Install gh-pages globally: `npm install -g gh-pages`
3. Deploy: `gh-pages -d dist`

## Project Structure

```
swipe_to_explore/
├── src/
│   ├── components/
│   │   ├── MapView.jsx          # Map component with Leaflet
│   │   ├── SwipeView.jsx        # Swipeable card container
│   │   ├── ExperienceCard.jsx   # Individual experience card
│   │   └── *.css                # Component styles
│   ├── data/
│   │   └── experiences.js       # Mock experience data
│   ├── hooks/
│   │   └── useSwipeable.js      # Swipe gesture logic
│   ├── utils/
│   │   └── storage.js           # localStorage utilities
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                    # This file
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **react-leaflet** - React bindings for Leaflet
- **framer-motion** - Animation library
- **react-icons** - Icon library

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Experience data uses placeholder images from Unsplash
- Map tiles provided by OpenStreetMap
- Inspired by modern dating app interfaces
