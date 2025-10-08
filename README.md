# Prompt & Instruction Dashboard

A modern React TypeScript dashboard for building, managing, and visualizing prompts and instruction sets for business, product, and software engineering contexts.

## Features

- 📝 **Instruction Management**: Create, edit, and organize instruction sets
- 🤖 **Prompt Templates**: Manage AI prompts with variable support
- � **Collections**: Organize related prompts and instructions
- �🔄 **Flow Visualization**: Interactive React Flow diagrams showing relationships
- 📱 **Responsive Design**: Mobile, tablet, and desktop optimized
- 🎨 **Modern UI**: Built with Tailwind CSS and Framer Motion
- 🔍 **Search & Filter**: Advanced filtering by categories and tags
- ⚙️ **Settings**: Customizable application configuration
- 🚀 **Real-time Updates**: Live data synchronization

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Visualization**: React Flow
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prompt-instruction-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API client and services
│   ├── client.ts    # HTTP client configuration
│   └── services.ts  # API service functions
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Input, Modal)
│   ├── Layout.tsx   # Main layout with navigation
│   └── PromptExecutionForm.tsx  # Form for executing prompts
├── data/            # Mock data and test data
├── pages/           # Route-level page components
│   ├── Dashboard.tsx           # Main dashboard page
│   ├── Instructions.tsx        # Instructions listing page
│   ├── InstructionDetail.tsx   # Individual instruction details
│   ├── Prompts.tsx            # Prompts listing page
│   ├── PromptDetail.tsx       # Individual prompt details
│   ├── Collections.tsx        # Collections management
│   ├── FlowVisualization.tsx  # Interactive flow diagrams
│   └── Settings.tsx           # Application settings
├── store/           # State management (Zustand)
│   └── useAppStore.ts
├── styles/          # Global styles and Tailwind config
│   └── globals.css
└── types/           # TypeScript type definitions
    └── index.ts
```

## API Integration

The application is designed to work with a RESTful API with the following endpoints:

### Instructions
- `GET /api/v1/instructions` - List all instructions
- `GET /api/v1/instructions/:id` - Get instruction by ID
- `POST /api/v1/instructions` - Create new instruction
- `PUT /api/v1/instructions/:id` - Update instruction
- `DELETE /api/v1/instructions/:id` - Delete instruction

### Prompts
- `GET /api/v1/prompts` - List all prompts
- `GET /api/v1/prompts/:id` - Get prompt by ID
- `POST /api/v1/prompts` - Create new prompt
- `PUT /api/v1/prompts/:id` - Update prompt
- `DELETE /api/v1/prompts/:id` - Delete prompt

### Health
- `GET /api/v1/health` - System health status

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### API Proxy

The Vite configuration includes a proxy for `/api` requests to `http://localhost:8080` by default.

## Features Overview

### Dashboard
- Overview statistics and metrics
- Recent instructions and prompts
- System health monitoring
- Quick access to create new content

### Instructions Management
- Grid view with search and filtering
- Category-based organization
- Tag-based classification
- CRUD operations with modal forms
- Public/private visibility control

### Flow Visualization
- Interactive node-based visualization
- Drag and drop interface
- Relationship mapping between instructions and prompts
- Auto-layout algorithms
- Zoom and pan controls
- Mini-map navigation

### Responsive Design
- Mobile-first approach
- Slide-out navigation for mobile
- Adaptive grid layouts
- Touch-friendly interactions

## Customization

### Adding New Categories

Update the enums in `src/types/index.ts`:

```typescript
export enum InstructionCategory {
  BUSINESS = 'business',
  PRODUCT = 'product',
  // Add new categories here
}
```

### Styling

The application uses Tailwind CSS with a custom design system defined in `src/styles/globals.css`. Key design tokens:

- **Primary Color**: Blue (customizable in `tailwind.config.js`)
- **Font**: Inter (loaded from Google Fonts)
- **Shadows**: Custom soft shadows
- **Borders**: Rounded corners with subtle borders

### Custom Components

All UI components are built with consistent props and styling:

```typescript
// Example usage
<Button variant="primary" size="md" loading={isLoading}>
  Save Changes
</Button>
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint with React and TypeScript rules
- Consistent naming conventions
- Functional components with hooks

## API Mock Data

For development without a backend, you can modify the API services in `src/api/services.ts` to return mock data.

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure your web server to serve the `index.html` for all routes (SPA mode)

### Popular Hosting Options

- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: Deploy the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue on the GitHub repository.