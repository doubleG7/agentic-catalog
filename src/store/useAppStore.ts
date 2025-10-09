import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Instruction, Prompt, HealthStatus } from '../types';
import { Collection } from '../types/versioning';

interface AppState {
  // Instructions state
  instructions: Instruction[];
  instructionsLoading: boolean;
  instructionsError: string | null;
  
  // Prompts state
  prompts: Prompt[];
  promptsLoading: boolean;
  promptsError: string | null;
  
  // Collections state
  collections: Collection[];
  collectionsLoading: boolean;
  collectionsError: string | null;
  
  // Health status
  healthStatus: HealthStatus | null;
  healthLoading: boolean;
  
  // UI state
  sidebarOpen: boolean;
  darkMode: boolean;
  
  // Search and filters
  searchQuery: string;
  selectedCategory: string;
  
  // Actions
  setInstructions: (instructions: Instruction[]) => void;
  setInstructionsLoading: (loading: boolean) => void;
  setInstructionsError: (error: string | null) => void;
  addInstruction: (instruction: Instruction) => void;
  updateInstruction: (id: string, instruction: Partial<Instruction>) => void;
  removeInstruction: (id: string) => void;
  
  setPrompts: (prompts: Prompt[]) => void;
  setPromptsLoading: (loading: boolean) => void;
  setPromptsError: (error: string | null) => void;
  addPrompt: (prompt: Prompt) => void;
  updatePrompt: (id: string, prompt: Partial<Prompt>) => void;
  removePrompt: (id: string) => void;
  
  setCollections: (collections: Collection[]) => void;
  setCollectionsLoading: (loading: boolean) => void;
  setCollectionsError: (error: string | null) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, collection: Partial<Collection>) => void;
  removeCollection: (id: string) => void;
  
  setHealthStatus: (status: HealthStatus | null) => void;
  setHealthLoading: (loading: boolean) => void;
  
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
  
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  clearFilters: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      instructions: [],
      instructionsLoading: false,
      instructionsError: null,
      
      prompts: [],
      promptsLoading: false,
      promptsError: null,
      
      collections: [],
      collectionsLoading: false,
      collectionsError: null,
      
      healthStatus: null,
      healthLoading: false,
      
      sidebarOpen: false,
      darkMode: false,
      
      searchQuery: '',
      selectedCategory: '',
      
      // Instructions actions
      setInstructions: (instructions) => set({ instructions }),
      setInstructionsLoading: (loading) => set({ instructionsLoading: loading }),
      setInstructionsError: (error) => set({ instructionsError: error }),
      
      addInstruction: (instruction) => 
        set((state) => ({ 
          instructions: [...state.instructions, instruction] 
        })),
      
      updateInstruction: (id, updatedInstruction) =>
        set((state) => ({
          instructions: state.instructions.map((instruction) =>
            instruction.id === id ? { ...instruction, ...updatedInstruction } : instruction
          ),
        })),
      
      removeInstruction: (id) =>
        set((state) => ({
          instructions: state.instructions.filter((instruction) => instruction.id !== id),
        })),
      
      // Prompts actions
      setPrompts: (prompts) => set({ prompts }),
      setPromptsLoading: (loading) => set({ promptsLoading: loading }),
      setPromptsError: (error) => set({ promptsError: error }),
      
      addPrompt: (prompt) => 
        set((state) => ({ 
          prompts: [...state.prompts, prompt] 
        })),
      
      updatePrompt: (id, updatedPrompt) =>
        set((state) => ({
          prompts: state.prompts.map((prompt) =>
            prompt.id === id ? { ...prompt, ...updatedPrompt } : prompt
          ),
        })),
      
      removePrompt: (id) =>
        set((state) => ({
          prompts: state.prompts.filter((prompt) => prompt.id !== id),
        })),
      
      // Collections actions
      setCollections: (collections) => set({ collections }),
      setCollectionsLoading: (loading) => set({ collectionsLoading: loading }),
      setCollectionsError: (error) => set({ collectionsError: error }),
      
      addCollection: (collection) => 
        set((state) => ({ 
          collections: [...state.collections, collection] 
        })),
      
      updateCollection: (id, updatedCollection) =>
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === id ? { ...collection, ...updatedCollection } : collection
          ),
        })),
      
      removeCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((collection) => collection.id !== id),
        })),
      
      // Health actions
      setHealthStatus: (status) => set({ healthStatus: status }),
      setHealthLoading: (loading) => set({ healthLoading: loading }),
      
      // UI actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Filter actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      clearFilters: () => set({ searchQuery: '', selectedCategory: '' }),
    }),
    {
      name: 'prompt-instruction-store',
    }
  )
);

// Selectors for computed values
export const useFilteredInstructions = () => {
  const { instructions, searchQuery, selectedCategory } = useAppStore();
  
  return instructions.filter((instruction) => {
    const matchesSearch = !searchQuery || 
      instruction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instruction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instruction.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || instruction.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
};

export const useFilteredPrompts = () => {
  const { prompts, searchQuery, selectedCategory } = useAppStore();
  
  return prompts.filter((prompt) => {
    const matchesSearch = !searchQuery || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
};

// Statistics selectors
export const useAppStats = () => {
  const { instructions, prompts } = useAppStore();
  
  return {
    totalInstructions: instructions.length,
    totalPrompts: prompts.length,
    publicInstructions: instructions.filter(i => i.isPublic).length,
    publicPrompts: prompts.filter(p => p.isPublic).length,
    recentInstructions: instructions
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5),
    recentPrompts: prompts
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5),
  };
};