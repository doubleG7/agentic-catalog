import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  FileText,
  MessageSquare,
  Settings,
  GitBranch,
  Search,
  Bell,
  FolderOpen,
  Rocket,
} from 'lucide-react';
import { Button } from './ui/Button';
import { useAppStore } from '../store/useAppStore';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Instructions', href: '/instructions', icon: FileText },
    { name: 'Prompts', href: '/prompts', icon: MessageSquare },
    { name: 'Collections', href: '/collections', icon: FolderOpen },
    { name: 'Flow View', href: '/flow', icon: GitBranch },
    { name: 'Deployments', href: '/deployments', icon: Rocket },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const instructionCategories = [
    { name: 'Business', count: 12 },
    { name: 'Product', count: 8 },
    { name: 'Software Engineering', count: 15 },
    { name: 'Development', count: 22 },
    { name: 'Project Management', count: 6 },
    { name: 'Design', count: 9 },
  ];

  const promptCategories = [
    { name: 'Code Generation', count: 18 },
    { name: 'Documentation', count: 11 },
    { name: 'Analysis', count: 7 },
    { name: 'Creative', count: 13 },
    { name: 'Problem Solving', count: 9 },
    { name: 'Communication', count: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="fixed inset-0 bg-gray-600 dark:bg-gray-950 bg-opacity-75 dark:bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-xl lg:hidden"
          >
            <SidebarContent
              navigation={navigation}
              instructionCategories={instructionCategories}
              promptCategories={promptCategories}
              currentPath={location.pathname}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <SidebarContent
          navigation={navigation}
          instructionCategories={instructionCategories}
          promptCategories={promptCategories}
          currentPath={location.pathname}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1">
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 dark:text-gray-500 pl-3" />
              <input
                className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 dark:text-gray-100 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 sm:text-sm"
                placeholder="Search instructions and prompts..."
                type="search"
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <ThemeToggle />
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

interface SidebarContentProps {
  navigation: Array<{ name: string; href: string; icon: any }>;
  instructionCategories: Array<{ name: string; count: number }>;
  promptCategories: Array<{ name: string; count: number }>;
  currentPath: string;
  onClose?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  navigation,
  instructionCategories,
  promptCategories,
  currentPath,
  onClose,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('instructions');

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4 ring-1 ring-gray-900/10 dark:ring-gray-700/50">
      <div className="flex h-16 shrink-0 items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Prompt Studio</h1>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={onClose}
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500">
              BROWSE CATEGORIES
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              <li>
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === 'instructions' ? null : 'instructions'
                    )
                  }
                  className="flex w-full items-center justify-between rounded-md p-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span>Instructions</span>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                    {instructionCategories.reduce((sum, cat) => sum + cat.count, 0)}
                  </span>
                </button>
                <AnimatePresence>
                  {expandedSection === 'instructions' && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 overflow-hidden space-y-1"
                    >
                      {instructionCategories.map((category) => (
                        <li key={category.name}>
                          <Link
                            to={`/instructions?category=${category.name.toLowerCase().replace(' ', '_')}`}
                            className="flex items-center justify-between rounded-md py-1 px-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                            onClick={onClose}
                          >
                            <span>{category.name}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{category.count}</span>
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>

              <li>
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === 'prompts' ? null : 'prompts')
                  }
                  className="flex w-full items-center justify-between rounded-md p-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span>Prompts</span>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                    {promptCategories.reduce((sum, cat) => sum + cat.count, 0)}
                  </span>
                </button>
                <AnimatePresence>
                  {expandedSection === 'prompts' && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 overflow-hidden space-y-1"
                    >
                      {promptCategories.map((category) => (
                        <li key={category.name}>
                          <Link
                            to={`/prompts?category=${category.name.toLowerCase().replace(' ', '_')}`}
                            className="flex items-center justify-between rounded-md py-1 px-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                            onClick={onClose}
                          >
                            <span>{category.name}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{category.count}</span>
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Layout;