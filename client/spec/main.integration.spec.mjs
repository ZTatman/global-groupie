// import React from 'react';
// import { render, waitFor } from '@testing-library/react';
// import { Main } from '../src/components/main';

// describe('Main Component Integration Test', () => {
//   let container;
  
//   beforeEach(() => {
//     // Create container for Cesium
//     container = document.createElement('div');
//     container.id = 'cesium-container';
//     container.style.width = '500px';
//     container.style.height = '500px';
//     document.body.appendChild(container);
//   });
  
//   afterEach(() => {
//     // Clean up
//     if (container && container.parentNode) {
//       container.parentNode.removeChild(container);
//     }
//   });
  
//   it('initializes Cesium and renders a canvas element', async () => {
//     render(React.createElement(Main), {
//       container: document.getElementById('cesium-container')
//     });
    
//     // Wait for Cesium to initialize and render canvas
//     await waitFor(() => {
//       const canvas = container.querySelector('canvas');
//       expect(canvas).toBeTruthy();
//     }, { timeout: 5000 });
//   });
// }); 