# Prompts Component Architecture

## Visual Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                     Prompts.tsx (Main Page)                 │
│                                                             │
│  State Management:                                          │
│  • prompts, loading, modals state                          │
│  • search & filter state (from Zustand)                    │
│  • form state (react-hook-form)                            │
│                                                             │
│  Business Logic:                                            │
│  • API calls (fetch, create, update, delete)               │
│  • Event handlers (search, filter, CRUD)                   │
│  • Template execution logic                                │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌───────────────┐ ┌──────────────┐ ┌─────────────────────┐
│PromptsHeader  │ │PromptsFilters│ │   PromptsGrid       │
├───────────────┤ ├──────────────┤ ├─────────────────────┤
│• Page title   │ │• Search input│ │• Responsive grid    │
│• Description  │ │• Category    │ │• Map prompt cards   │
│• Create btn   │ │  dropdown    │ │• Empty state        │
└───────────────┘ └──────────────┘ └──────┬──────────────┘
                                           │
                                 ┌─────────┴─────────┐
                                 │                   │
                                 ▼                   ▼
                          ┌──────────────┐   ┌──────────────┐
                          │ PromptCard   │   │ Empty State  │
                          ├──────────────┤   ├──────────────┤
                          │• Title/desc  │   │• Message     │
                          │• Metadata    │   │• Create CTA  │
                          │• Tags/vars   │   └──────────────┘
                          │• Actions     │
                          └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         Modals Layer                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────┐  ┌────────────────────────┐│
│  │   PromptFormModal          │  │   PromptViewModal      ││
│  ├────────────────────────────┤  ├────────────────────────┤│
│  │• Title, description fields │  │• Two-state modal:      ││
│  │• Content textarea          │  │  1. Input form         ││
│  │• Category, tags            │  │  2. Executed output    ││
│  │• Public checkbox           │  │• Copy to clipboard     ││
│  │• Embedded VariableEditor   │  │• Edit variables option ││
│  │• Used for Create & Edit    │  └────────────────────────┘│
│  └──────────┬─────────────────┘                            │
│             │                                               │
│             ▼                                               │
│  ┌─────────────────────────┐                               │
│  │   VariableEditor        │                               │
│  ├─────────────────────────┤                               │
│  │• Add/remove variables   │                               │
│  │• Name, type, required   │                               │
│  │• Default values         │                               │
│  │• Select options         │                               │
│  └─────────────────────────┘                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Read Operations (View/List)
```
User Action → Prompts.tsx → PromptsGrid → PromptCard → Display
              ↓
          API Call
              ↓
          Update State
```

### Create Operation
```
User Click → PromptsHeader → Prompts.tsx → PromptFormModal
                                              ↓
                                         VariableEditor
                                              ↓
                                         Form Submit
                                              ↓
                                          API Call
                                              ↓
                                      Refresh Prompts
```

### Execute Operation
```
User Click → PromptCard → Prompts.tsx → PromptViewModal
                                              ↓
                                    PromptExecutionForm
                                              ↓
                                    Process Variables
                                              ↓
                                    Display Result
```

## Component Responsibilities Matrix

| Component | State | UI | Logic | API |
|-----------|-------|-----|-------|-----|
| Prompts.tsx | ✅ Primary | 🔄 Layout | ✅ Business | ✅ Calls |
| PromptsHeader | ❌ None | ✅ Display | ❌ None | ❌ None |
| PromptsFilters | ❌ None | ✅ Display | ❌ None | ❌ None |
| PromptsGrid | ❌ None | ✅ Layout | ❌ None | ❌ None |
| PromptCard | ❌ None | ✅ Display | ❌ None | ❌ None |
| VariableEditor | ❌ None | ✅ Form | 🔄 Updates | ❌ None |
| PromptFormModal | ❌ None | ✅ Form | 🔄 Submit | ❌ None |
| PromptViewModal | 🔄 Local | ✅ Display | ✅ Execute | ❌ None |

Legend:
- ✅ Primary responsibility
- 🔄 Partial/shared responsibility
- ❌ Not responsible

## Props Flow

```typescript
// Main Page
Prompts.tsx {
  // Zustand Store
  prompts: Prompt[]
  loading: boolean
  searchQuery: string
  selectedCategory: string
  
  // Local State
  modals: { create, edit, view }
  editingPrompt: Prompt | null
  viewingPrompt: Prompt | null
  variables: PromptVariable[]
  executedTemplate: string
  
  // React Hook Form
  createForm: { register, errors, submit }
  editForm: { register, errors, submit }
}

// Component Props
PromptsHeader {
  onCreateClick: () => void
}

PromptsFilters {
  searchQuery: string
  selectedCategory: string
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
}

PromptsGrid {
  prompts: Prompt[]
  onView: (prompt: Prompt) => void
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
  onCreateClick: () => void
}

PromptCard {
  prompt: Prompt
  onView: (prompt: Prompt) => void
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
}

VariableEditor {
  variables: PromptVariable[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index, field, value) => void
}

PromptFormModal {
  isOpen: boolean
  onClose: () => void
  title: string
  onSubmit: (e: FormEvent) => void
  register: UseFormRegister
  errors: FieldErrors
  isSubmitting: boolean
  variables: PromptVariable[]
  onAddVariable: () => void
  onRemoveVariable: (index) => void
  onUpdateVariable: (index, field, value) => void
  submitButtonText?: string
}

PromptViewModal {
  isOpen: boolean
  onClose: () => void
  prompt: Prompt | null
  isExecuted: boolean
  executedTemplate: string
  onExecute: (values: Record<string, string>) => void
  onReset: () => void
}
```

## Import/Export Structure

```typescript
// src/components/prompts/index.ts (Barrel Export)
export { PromptsHeader } from './PromptsHeader';
export { PromptsFilters } from './PromptsFilters';
export { PromptCard } from './PromptCard';
export { PromptsGrid } from './PromptsGrid';
export { VariableEditor } from './VariableEditor';
export { PromptFormModal } from './PromptFormModal';
export { PromptViewModal } from './PromptViewModal';

// Usage in Prompts.tsx
import {
  PromptsHeader,
  PromptsFilters,
  PromptsGrid,
  PromptFormModal,
  PromptViewModal,
} from '../components/prompts';
```

## Benefits Visualization

### Before: Monolithic Structure
```
┌─────────────────────────────────────┐
│         Prompts.tsx                 │
│         (~750 lines)                │
│                                     │
│  • All UI rendering                 │
│  • All state management             │
│  • All event handlers               │
│  • All business logic               │
│  • All API calls                    │
│  • All form validation              │
│                                     │
│  ❌ Hard to navigate                │
│  ❌ Difficult to test               │
│  ❌ No reusability                  │
│  ❌ Tight coupling                  │
└─────────────────────────────────────┘
```

### After: Modular Structure
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│PromptsHeader │  │PromptsFilters│  │PromptCard    │
│  (28 lines)  │  │  (55 lines)  │  │ (108 lines)  │
│              │  │              │  │              │
│ ✅ Focused   │  │ ✅ Focused   │  │ ✅ Focused   │
│ ✅ Reusable  │  │ ✅ Reusable  │  │ ✅ Reusable  │
│ ✅ Testable  │  │ ✅ Testable  │  │ ✅ Testable  │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│PromptsGrid   │  │VariableEditor│  │PromptForm    │
│  (55 lines)  │  │ (105 lines)  │  │Modal         │
│              │  │              │  │ (119 lines)  │
│ ✅ Focused   │  │ ✅ Focused   │  │ ✅ Focused   │
│ ✅ Reusable  │  │ ✅ Reusable  │  │ ✅ Reusable  │
│ ✅ Testable  │  │ ✅ Testable  │  │ ✅ Testable  │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────────────────────┐
│PromptView    │  │     Prompts.tsx (Main)       │
│Modal         │  │       (314 lines)            │
│  (79 lines)  │  │                              │
│              │  │  • State orchestration       │
│ ✅ Focused   │  │  • API integration          │
│ ✅ Reusable  │  │  • Component composition    │
│ ✅ Testable  │  │                              │
└──────────────┘  │  ✅ Clean & maintainable    │
                  └──────────────────────────────┘
```

## Testing Strategy

### Unit Tests (Component Level)
```typescript
// PromptsHeader.test.tsx
describe('PromptsHeader', () => {
  it('renders title and description', () => {});
  it('calls onCreateClick when button clicked', () => {});
});

// PromptCard.test.tsx
describe('PromptCard', () => {
  it('displays prompt data correctly', () => {});
  it('calls onEdit with prompt when edit clicked', () => {});
  it('calls onDelete with id when delete clicked', () => {});
  it('shows public indicator when isPublic=true', () => {});
});

// VariableEditor.test.tsx
describe('VariableEditor', () => {
  it('adds new variable when Add clicked', () => {});
  it('updates variable field correctly', () => {});
  it('removes variable at index', () => {});
});
```

### Integration Tests (Page Level)
```typescript
// Prompts.integration.test.tsx
describe('Prompts Page', () => {
  it('fetches and displays prompts on load', () => {});
  it('filters prompts by search query', () => {});
  it('creates new prompt successfully', () => {});
  it('executes prompt with variables', () => {});
});
```

## Performance Considerations

### Code Splitting
```typescript
// Potential lazy loading
const PromptFormModal = lazy(() => import('./PromptFormModal'));
const PromptViewModal = lazy(() => import('./PromptViewModal'));
```

### Memoization Opportunities
```typescript
// Memoize filtered prompts
const filteredPrompts = useMemo(() => 
  prompts.filter(/* ... */), 
  [prompts, searchQuery, selectedCategory]
);

// Memoize card rendering
const PromptCard = memo(({ prompt, onView, onEdit, onDelete }) => {
  // ...
});
```

## Future Enhancements

1. **Extract Common Patterns**
   - Create base `Card` component
   - Create base `FormModal` component
   - Share with Instructions page

2. **Add Component Library**
   - Storybook for documentation
   - Visual regression testing
   - Design system alignment

3. **Optimize Bundle**
   - Dynamic imports for modals
   - Tree-shake unused code
   - Code splitting by route

4. **Enhance Testing**
   - Add unit tests for all components
   - Integration tests for user flows
   - E2E tests for critical paths
