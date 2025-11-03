#!/usr/bin/env node

/**
 * Convert Postman Collection to OpenAPI 3.0
 * 
 * Usage:
 *   node convert-to-openapi.js
 * 
 * Or install postman-to-openapi globally:
 *   npm install -g postman-to-openapi
 *   p2o Kitchenly_API.postman_collection.json -f openapi.yaml
 */

const fs = require('fs');
const path = require('path');

console.log('\n📦 Postman to OpenAPI Converter\n');

// Check if postman-to-openapi is installed
try {
  require.resolve('postman-to-openapi');
  console.log('✅ postman-to-openapi is installed\n');
  
  const postmanToOpenApi = require('postman-to-openapi');
  const collectionPath = path.join(__dirname, 'Kitchenly_API.postman_collection.json');
  const outputPath = path.join(__dirname, 'openapi.yaml');
  
  postmanToOpenApi(collectionPath, outputPath, {})
    .then(() => {
      console.log('✅ OpenAPI spec generated successfully!');
      console.log(`📄 Output: ${outputPath}\n`);
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
    });
    
} catch (e) {
  console.log('⚠️  postman-to-openapi is not installed\n');
  console.log('To install and convert:\n');
  console.log('  Option 1 - Install globally:');
  console.log('    npm install -g postman-to-openapi');
  console.log('    p2o Kitchenly_API.postman_collection.json -f openapi.yaml\n');
  
  console.log('  Option 2 - Install locally:');
  console.log('    cd postman');
  console.log('    npm install postman-to-openapi');
  console.log('    node convert-to-openapi.js\n');
  
  console.log('  Option 3 - Use Postman:');
  console.log('    1. Right-click collection in Postman');
  console.log('    2. Select "Export"');
  console.log('    3. Choose "OpenAPI 3.0"');
  console.log('    4. Save file\n');
  
  console.log('  Option 4 - Use online converter:');
  console.log('    https://joolfe.github.io/postman-to-openapi/\n');
}
