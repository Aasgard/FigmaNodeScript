import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read and analyze the Figma variables JSON file
function analyzeFigmaVariables() {
  try {
    // Read the JSON file
    const filePath = path.join(__dirname, 'figma-variables.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Check if the data structure is valid
    if (!data.meta) {
      console.error('❌ Error: Invalid JSON structure. Missing "meta" property.');
      return;
    }

    // Extract collections and variables
    const collections = data.meta.variableCollections || {};
    const variables = data.meta.variables || {};

    // Count collections and variables
    const collectionCount = Object.keys(collections).length;
    const variableCount = Object.keys(variables).length;

    // Display results
    console.log('\n📊 Figma Variables Statistics\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📦 Number of Collections: ${collectionCount}`);
    console.log(`🔧 Number of Variables:   ${variableCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Additional statistics - Only Local collections
    if (collectionCount > 0) {
      const localCollections = Object.values(collections).filter(collection => !collection.remote);
      const localCount = localCollections.length;
      
      console.log(`📋 Local Collections (${localCount}):`);
      if (localCount > 0) {
        localCollections.forEach((collection, index) => {
          const varCount = collection.variableIds ? collection.variableIds.length : 0;
          console.log(`   ${index + 1}. ${collection.name || 'Unnamed'} (${varCount} variables)`);
        });
      } else {
        console.log('   No local collections found.');
      }
      console.log('');
    }

    // Variable type breakdown
    if (variableCount > 0) {
      const typeCounts = {};
      Object.values(variables).forEach(variable => {
        const type = variable.resolvedType || 'UNKNOWN';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      console.log('🔍 Variable Types Breakdown:');
      Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([type, count]) => {
          console.log(`   • ${type}: ${count}`);
        });
      console.log('');
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Error: figma-variables.json file not found.');
      console.error('   Please make sure the file exists in the project directory.');
    } else if (error instanceof SyntaxError) {
      console.error('❌ Error: Invalid JSON format in figma-variables.json');
      console.error(`   ${error.message}`);
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

// Run the analysis
analyzeFigmaVariables();
