import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface DocumentationItem {
  id: string;
  title: string;
  category: string;
  content: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

const Documentation: React.FC = () => {
  const [items, setItems] = useState<DocumentationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>('1');

  // Sample documentation data - replace with API call
  const sampleDocs: DocumentationItem[] = [
    {
      id: '1',
      title: 'Getting Started',
      category: 'Basics',
      description: 'Welcome to the Trimble Agentic Catalog. This guide will help you get up and running with the platform.',
      content: `Welcome to the Trimble Agentic Catalog. This guide will help you get up and running with the platform.

## What is the Catalog?

The Trimble Agentic Catalog is a centralized repository for managing instructions, prompts, and collections for agentic workflows.

## Key Features

- **Instructions**: Step-by-step guides for complex operations
- **Prompts**: Pre-built AI prompts for various use cases
- **Collections**: Organize related items together
- **Flow View**: Visualize relationships between items

## Getting Started

1. Log in to your account
2. Explore the dashboard to see your recent items
3. Navigate to Instructions, Prompts, or Collections to start creating
4. Use categories to organize your items
5. Share collections with your team`,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Creating Instructions',
      category: 'Instructions',
      description: 'Instructions are step-by-step guides that help users accomplish specific tasks.',
      content: `Instructions are step-by-step guides that help users accomplish specific tasks.

## How to Create an Instruction

1. Navigate to the Instructions page
2. Click the "Create New Instruction" button
3. Fill in the following fields:
   - **Title**: A clear, descriptive title
   - **Category**: Select an appropriate category
   - **Content**: Write step-by-step instructions
   - **Variables**: Add dynamic variables for customization
4. Click "Create Instruction"

## Best Practices

- Use clear, concise language
- Include examples when possible
- Test instructions thoroughly before publishing
- Use variables to make instructions reusable
- Document prerequisites and expected outcomes`,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Working with Prompts',
      category: 'Prompts',
      description: 'Prompts are AI-powered templates that can be customized with variables.',
      content: `Prompts are AI-powered templates that can be customized with variables.

## Creating Prompts

1. Go to the Prompts section
2. Click "Create New Prompt"
3. Define your prompt template with variables using {{variable_name}} syntax
4. Add variables with their types and descriptions
5. Test the prompt execution

## Prompt Variables

Variables allow you to create flexible, reusable prompts:
- **TEXT**: Simple text input
- **SELECT**: Dropdown selection
- **MULTI**: Multiple choice options

## Executing Prompts

1. Click the View icon on any prompt
2. Fill in the required variables
3. Click "Execute" to see the processed output
4. Copy or save the result as needed`,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Collections Overview',
      category: 'Collections',
      description: 'Collections help you organize related instructions and prompts together.',
      content: `Collections help you organize related instructions and prompts together.

## What is a Collection?

A collection is a logical grouping of instructions, prompts, and other items that work together to accomplish a larger goal.

## Creating Collections

1. Navigate to Collections
2. Click "Create New Collection"
3. Add a title and description
4. Add items to the collection
5. Publish the collection

## Using Collections

Collections are useful for:
- Grouping related workflows
- Sharing with teams
- Documentation purposes
- Creating reusable templates

## Best Practices

- Keep collections focused on a single workflow
- Include clear descriptions
- Test collections before sharing
- Update collections when items change`,
      order: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Flow View Guide',
      category: 'Advanced',
      description: 'The Flow View provides a visual representation of your workflows and their relationships.',
      content: `The Flow View provides a visual representation of your workflows and their relationships.

## Understanding Flow View

- **Nodes**: Represent items (instructions, prompts, collections)
- **Edges**: Show relationships between items
- **Layout**: Automatically organized for clarity

## Interacting with Flow View

- Zoom in/out to navigate
- Click nodes to view details
- Drag nodes to reorganize
- Double-click to edit items

## Best Practices

- Use Flow View to understand dependencies
- Identify circular references
- Plan workflow improvements
- Document complex workflows visually`,
      order: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    // Simulate loading documentation
    setLoading(true);
    setTimeout(() => {
      setItems(sampleDocs.sort((a, b) => a.order - b.order));
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent dark:from-primary-400 dark:to-emerald-300 mb-4">
          Documentation
        </h1>
        <p className="text-lg text-gray-600 dark:text-slate-400">
          Learn how to use the Trimble Agentic Catalog
        </p>
      </header>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Getting Started</h2>
        <p className="text-gray-600 dark:text-slate-400 mb-8 text-lg">
          The Trimble Agentic Catalog is a centralized repository for managing instructions, prompts, and collections for agentic workflows. Explore our comprehensive guides to get started building amazing workflows.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">Core Features</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Instructions Feature */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Instructions</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">Step-by-step guides with variables and templates</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Prompts</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">AI-powered templates with customizable variables</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Collections</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">Organize related items together logically</p>
              </div>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Flow View</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">Visual representation of workflows and relationships</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Categories</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">Browse and filter by category for easy discovery</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary-600 dark:text-primary-400 text-xl">✓</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Global Search</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">Find items quickly with powerful search</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Accordion */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Documentation Guide</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900/30"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 dark:text-slate-500 transition-transform ml-4 flex-shrink-0 ${
                      expandedId === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4"
                    >
                      <div className="text-sm text-gray-700 dark:text-slate-300 space-y-3 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                        {item.content.split('\n\n').map((paragraph, idx) => (
                          <div key={idx}>
                            {paragraph.split('\n').map((line, lineIdx) => (
                              <div
                                key={lineIdx}
                                className={`${
                                  line.startsWith('##') ? 'font-bold text-gray-900 dark:text-white mt-3 mb-2' :
                                  line.startsWith('-') || line.startsWith('•') ? 'ml-4' :
                                  ''
                                }`}
                              >
                                {line.replace(/^##\s*/, '').replace(/\*\*(.*?)\*\*/g, (_, text) => text)}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Need Help?</h3>
          <p className="text-gray-600 dark:text-slate-400">
            Explore the accordion above to learn about each feature. Use the sidebar to browse items by category, search for specific instructions or prompts, or explore the Flow View to understand relationships between your workflows.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Documentation;
