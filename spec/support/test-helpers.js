// This file gets loaded as a helper in all specs
// Import React and make it available globally
import React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

// Make React available globally so tests don't need to import it
window.React = React;
window.ReactDOM = ReactDOM;
window.createRoot = createRoot;

// Add any other test setup here
beforeEach(() => {
  // This function runs before each test
  // You can set up common test environment here
});

afterEach(() => {
  // This function runs after each test
  // You can clean up common test environment here
}); 