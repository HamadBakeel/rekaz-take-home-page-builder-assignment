# Mini Website Builder

A responsive, interactive website builder that allows users to create web pages by adding, editing, and rearranging pre-built sections with a focus on performance and user experience.

## ✨ Features

- **Section Library**: Pre-built sections (Header, Hero, Content, Footer) that can be added to your page with a single click
- **Drag and Drop Interface**: Intuitive reordering of sections with visual feedback and touch support for mobile devices
- **Property Editor**: Customize each section's content and appearance with real-time updates
- **Live Preview**: Real-time visualization of your website as you build with responsive scaling options
- **Import/Export**: Save and load your designs as JSON files with schema validation
- **Responsive Design**: Fully adaptive interface optimized for both desktop and mobile experiences
- **Dark/Light Theme**: Toggle between light and dark mode using system preferences or manual selection
- **Animations**: Smooth transitions and feedback animations throughout the interface using Framer Motion

## 🛠️ Technical Implementation

### Architecture

- **Next.js 15** with App Router for server/client component separation
- **TypeScript** for type safety and better developer experience
- **Zustand** for state management with immutable updates
- **React DnD** for drag-and-drop functionality
- **Zod** for schema validation of imported/exported data
- **Framer Motion** for animations and transitions
- **Tailwind CSS** with Shadcn UI components for styling

### Performance Optimizations

- **Memoization**: Strategic use of `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary re-renders
- **Optimized Drag Operations**: Custom touch handling for mobile with auto-scrolling
- **SSR Friendly**: Server components used where possible, client components pushed down the tree
- **Error Boundaries**: Isolated error handling for sections to prevent whole app crashes

### Mobile Optimizations

- **Responsive Layout**: Adapts to different screen sizes with breakpoint-based adjustments
- **Touch-friendly Controls**: Optimized drag handles and controls for touch devices
- **Mobile Property Editor**: Collapsible bottom sheet for editing on small screens
- **Auto-scrolling**: Smart viewport scrolling during drag operations on mobile
- **Zoom Controls**: Ability to scale the preview area on smaller screens

## 🏗️ Project Structure

```
src/
├── app/               # Next.js app router pages
├── components/        # UI components
│   ├── builder/       # Builder-specific components (drag-drop, editors)
│   ├── sections/      # Pre-built section templates (header, hero, etc.)
│   └── ui/            # Reusable UI components (buttons, inputs, etc.)
├── data/              # Static data and section templates
├── lib/               # Utility libraries
├── stores/            # Zustand state stores for builder data
├── types/             # TypeScript type definitions and Zod schemas
└── utils/             # Helper functions and constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hamadbakeel/rekaz-take-home-page-builder-assignment.git
   cd rekaz-take-home-page-builder-assignment
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Key Implementation Details

### State Management

The application uses Zustand for state management, with a focus on immutable updates and performance. The main store (`builder-store.ts`) handles:

- Section management (add, update, delete, reorder)
- Selection state
- Import/export functionality with validation

### Drag and Drop

The drag and drop system uses React DnD for desktop and custom touch event handling for mobile devices, providing:

- Visual feedback during drag operations
- Automatic scrolling when dragging near viewport edges on mobile
- Smooth animations for reordering

### Responsive Design

The builder adapts to different screen sizes with:

- Collapsible section library on mobile
- Bottom sheet property editor on small screens
- Preview area scaling controls
- Touch-optimized controls and interactions

### Animation System

Animations are implemented using Framer Motion for:

- Section add/remove transitions
- Smooth reordering animations
- Interactive feedback (hover, active states)
- Loading states and transitions

## 🌟 Future Improvements

- Additional section templates with more design variations
- Undo/redo functionality for editing operations
- Multi-page support for building complete websites
- Custom code blocks for advanced users
- Collaborative editing capabilities
- Image upload and asset management

## 📄 License

This project is licensed under the MIT License.
