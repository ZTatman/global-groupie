// This script updates jasmine-browser.js with correct package versions
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
try {
  // Read package.json to get the exact installed versions
  let packageJson;
  try {
    const packageJsonContent = fs.readFileSync('./package.json', 'utf8');
    packageJson = JSON.parse(packageJsonContent);
  } catch (err) {
    console.error('❌ Failed to read package.json:', err.message);
    console.error('   Make sure you are running this script from the project root directory.');
    process.exit(1);
  }

  // Check if dependencies exist
  if (!packageJson.dependencies) {
    console.error('❌ No dependencies found in package.json');
    process.exit(1);
  }

  // Get installed React version
  let reactVersion, reactDomVersion, testingLibraryVersion;
  
  try {
    if (!packageJson.dependencies.react) {
      throw new Error('React dependency not found in package.json');
    }
    reactVersion = packageJson.dependencies.react.replace('^', '');
    
    if (!packageJson.dependencies['react-dom']) {
      throw new Error('react-dom dependency not found in package.json');
    }
    reactDomVersion = packageJson.dependencies['react-dom'].replace('^', '');

    if (!packageJson.devDependencies || !packageJson.devDependencies['@testing-library/react']) {
      throw new Error('@testing-library/react dev dependency not found in package.json');
    }
    testingLibraryVersion = packageJson.devDependencies['@testing-library/react'].replace('^', '');
  } catch (err) {
    console.error(`❌ ${err.message}`);
    console.error('Please make sure all required dependencies are installed.');
    process.exit(1);
  }

  // Now, read and update jasmine-browser.js file
  const jasmineBrowserPath = path.resolve(__dirname, 'jasmine-browser.js');

  let jasmineBrowserContent;
  
  try {
    if (!fs.existsSync(jasmineBrowserPath)) {
      throw new Error(`❌ File not found: ${jasmineBrowserPath}, please create a jasmine-browser.js file in the spec/support directory using the 'npx jasmine-browser-runner init' command.`);
    }
    jasmineBrowserContent = fs.readFileSync(jasmineBrowserPath, 'utf8');
  } catch (err) {
    console.error(`❌ Failed to read jasmine-browser.js: ${err.message}`);
    process.exit(1);
  }

  // Prepare new importMap section
  const IMPORT_MAP_SECTION = `  importMap: {
    imports: {
      "react": "https://esm.sh/react@${reactVersion}",
      "react-dom": "https://esm.sh/react-dom@${reactDomVersion}",
      "react-dom/client": "https://esm.sh/react-dom@${reactDomVersion}/client",
      "@testing-library/react": "https://esm.sh/@testing-library/react@${testingLibraryVersion}"
    }
  },`;

  // Replace existing import map section with regex
  const IMPORT_MAP_REGEX = /\s\simportMap:\s*{[\s\S]*?},/m;
  
  if (!IMPORT_MAP_REGEX.test(jasmineBrowserContent)) {
    console.error('❌ Could not find importMap section in jasmine-browser.js');
    console.error('   Make sure the file has an importMap configuration.');
    process.exit(1);
  }
  
  const updatedContent = jasmineBrowserContent.replace(IMPORT_MAP_REGEX, IMPORT_MAP_SECTION);
  
  // Write back to file
  try {
    fs.writeFileSync(jasmineBrowserPath, updatedContent);
  } catch (err) {
    console.error(`❌ Failed to write updated jasmine-browser.js: ${err.message}`);
    process.exit(1);
  }

  console.log('✅ Updated jasmine-browser.js with correct package versions:');
  console.log(`   - React: ${reactVersion}`);
  console.log(`   - ReactDOM: ${reactDomVersion}`);
  console.log(`   - Testing Library React: ${testingLibraryVersion}`);
} catch (err) {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
} 