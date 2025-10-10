# Prompts Components

This directory contains modular, reusable components for the Prompts feature, following best practices for React component architecture.

## Component Structure

### 1. **PromptsHeader**
- **Purpose**: Display page title and create button
- **Props**:
  - `onCreateClick: () => void` - Callback when create button is clicked
- **Usage**: Page header with title and primary action

### 2. **PromptsFilters**
- **Purpose**: Search and filter controls for prompts list
- **Props**:
  - `searchQuery: string` - Current search query
  - `selectedCategory: string` - Selected category filter
  - `onSearchChange: (query: string) => void` - Search input handler
  - `onCategoryChange: (category: string) => void` - Category select handler
- **Features**: 
  - Search input with icon
  - Category dropdown filter
  - Responsive layout (stacks on mobile)

### 3. **PromptCard**
- **Purpose**: Individual prompt display card
- **Props**:
  - `prompt: Prompt` - Prompt data object
  - `onView: (prompt: Prompt) => void` - View/execute handler
  - `onEdit: (prompt: Prompt) => void` - Edit handler
  - `onDelete: (id: string) => void` - Delete handler
- **Features**:
  - Displays title, description, category, tags
  - Shows variable count and update date
  - Public indicator (star icon)
  - Action buttons (View, Edit, Delete)
  - Dark mode support
  - Hover effects

### 4. **PromptsGrid**
- **Purpose**: Container for prompt cards with empty state
- **Props**:
  - `prompts: Prompt[]` - Array of prompts to display
  - `onView: (prompt: Prompt) => void` - View handler
  - `onEdit: (prompt: Prompt) => void` - Edit handler
  - `onDelete: (id: string) => void` - Delete handler
  - `onCreateClick: () => void` - Create button handler (for empty state)
- **Features**:
  - Responsive grid (1-3 columns)
  - Empty state with call-to-action
  - Maps prompt cards

### 5. **VariableEditor**
- **Purpose**: Manage prompt variables (add/edit/remove)
- **Props**:
  - `variables: PromptVariable[]` - Array of variables
  - `onAdd: () => void` - Add new variable
  - `onRemove: (index: number) => void` - Remove variable
  - `onUpdate: (index: number, field: keyof PromptVariable, value: any) => void` - Update variable field
- **Features**:
  - Add/remove variables dynamically
  - Configure: name, type, required, default value
  - Select type with custom options
  - Dark mode support

### 6. **PromptFormModal**
- **Purpose**: Reusable form modal for create/edit operations
- **Props**:
  - `isOpen: boolean` - Modal visibility
  - `onClose: () => void` - Close handler
  - `title: string` - Modal title
  - `onSubmit: (e: React.FormEvent) => void` - Form submit handler
  - `register: UseFormRegister<any>` - React Hook Form register
  - `errors: FieldErrors<any>` - Form validation errors
  - `isSubmitting: boolean` - Submit state
  - `variables: PromptVariable[]` - Variables array
  - `onAddVariable: () => void` - Add variable handler
  - `onRemoveVariable: (index: number) => void` - Remove variable handler
  - `onUpdateVariable: (index, field, value) => void` - Update variable handler
  - `submitButtonText?: string` - Custom submit button text (default: "Create Prompt")
- **Features**:
  - Title, description, content inputs
  - Category and tags fields
  - Integrated VariableEditor
  - Public checkbox
  - Form validation
  - Loading states
  - Dark mode support

### 7. **PromptViewModal**
- **Purpose**: View and execute prompts with variables
- **Props**:
  - `isOpen: boolean` - Modal visibility
  - `onClose: () => void` - Close handler
  - `prompt: Prompt | null` - Prompt to display
  - `isExecuted: boolean` - Execution state
  - `executedTemplate: string` - Processed template result
  - `onExecute: (values: Record<string, string>) => void` - Execute handler
  - `onReset: () => void` - Reset to edit variables
- **Features**:
  - Two-state modal (form → result)
  - Variable input form (PromptExecutionForm)
  - Executed output display
  - Copy to clipboard functionality
  - Reset/edit variables option
  - Dark mode support

## Benefits of This Architecture

### ✅ **Maintainability**
- Each component has a single, clear responsibility
- Easy to locate and fix bugs
- Changes isolated to specific components

### ✅ **Reusability**
- Components can be used in different contexts
- PromptFormModal serves both create and edit
- PromptCard can be used in lists or grids

### ✅ **Testability**
- Smaller components are easier to test
- Clear props interface for each component
- Isolated logic simplifies unit testing

### ✅ **Readability**
- Main Prompts.tsx page is now ~300 lines (down from ~750)
- Component names clearly describe their purpose
- Props interfaces document expected inputs

### ✅ **Scalability**
- Easy to add new features to specific components
- Can replace/refactor individual components
- Clear separation of concerns

## Usage Example

```tsx
import {
  PromptsHeader,
  PromptsFilters,
  PromptsGrid,
  PromptFormModal,
  PromptViewModal,
} from '../components/prompts';

function PromptsPage() {
  // ... state and handlers ...
  
  return (
    <div className="space-y-6">
      <PromptsHeader onCreateClick={() => setIsCreateModalOpen(true)} />
      
      <PromptsFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={handleSearch}
        onCategoryChange={handleCategoryFilter}
      />

      <PromptsGrid
        prompts={prompts}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      <PromptFormModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreate}
        title="Create New Prompt"
        // ... other props
      />

      <PromptViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseView}
        prompt={viewingPrompt}
        // ... other props
      />
    </div>
  );
}
```

## File Structure

```
src/components/prompts/
├── index.ts                 # Barrel export for easy imports
├── PromptsHeader.tsx        # Page header component
├── PromptsFilters.tsx       # Search and filter controls
├── PromptCard.tsx           # Individual prompt card
├── PromptsGrid.tsx          # Grid container with empty state
├── VariableEditor.tsx       # Variable management component
├── PromptFormModal.tsx      # Create/edit form modal
├── PromptViewModal.tsx      # View/execute modal
└── README.md               # This documentation
```

## Dark Mode Support

All components include dark mode variants using Tailwind's `dark:` prefix:
- Background colors: `dark:bg-gray-800`, `dark:bg-gray-900`
- Text colors: `dark:text-gray-100`, `dark:text-gray-400`
- Border colors: `dark:border-gray-700`
- Semantic colors maintain proper contrast

## Next Steps

Consider extracting similar patterns from:
- **Instructions page** - Similar structure to Prompts
- **Collections page** - Could benefit from modular cards/grids
- **Dashboard panels** - Reusable panel components
