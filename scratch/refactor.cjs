const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function findFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, filesList);
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        filesList.push(filePath);
      }
    }
  }
  return filesList;
}

const allFiles = findFiles(srcDir);

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // We want to replace "AIC Happy Valley" and "AIC"
  // If the file contains AIC, we might need to add the import
  if (content.includes('AIC Happy Valley') || content.includes('AIC')) {
    
    // Replace text in strings or jsx
    // Let's just do simple string replacement for now to replace the church name directly
    // Using CHURCH_CONFIG everywhere might be tricky to inject if we don't know the exact syntax (e.g. inside a string vs JSX text).
    // Let's replace 'AIC Happy Valley' with 'Zion Baptist Church'
    // and 'AIC' with 'Zion Baptist'
    
    // If we want to use the config, we would need to add import and use {CHURCH_CONFIG.name}
    // But since this is a quick mass replace, we'll replace the hardcoded strings directly first to get rid of 'AIC'
    content = content.replace(/AIC Happy Valley/g, 'Zion Baptist Church');
    content = content.replace(/AIC/g, 'Zion Baptist');

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
}
