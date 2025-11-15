cd kanban-app

# Core React dependencies
npm install react-router-dom zustand axios react-beautiful-dnd

# UI/Styling
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Form handling & validation
npm install react-hook-form zod

# Utilities
npm install date-fns uuid lodash-es clsx

# Jest & React Testing Library
npm install -D jest @types/jest jest-environment-jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @testing-library/react-hooks

# Cucumber (BDD)
npm install -D @cucumber/cucumber @cucumber/pretty-formatter

# Playwright (E2E)
npm install -D @playwright/test
npx playwright install

# Mock Service Worker (API mocking)
npm install -D msw

# Coverage & Reporting
npm install -D @vitest/coverage-v8 jest-html-reporter

# Babel for Jest
npm install -D @babel/preset-env @babel/preset-react babel-jest

# Additional test utilities
npm install -D jest-axe identity-obj-proxy

npm install -D @faker-js/faker