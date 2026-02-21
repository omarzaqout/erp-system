const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.component.ts')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Basic regex to find inline template
  const templateRegex = /template\s*:\s*`([\s\S]*?)`/g;
  const matchTemplate = templateRegex.exec(content);
  
  const stylesRegex = /styles\s*:\s*\[\s*`([\s\S]*?)`\s*\]/g;
  const matchStyles = stylesRegex.exec(content);

  let modified = false;

  const componentName = path.basename(filePath, '.component.ts');
  const htmlFilePath = path.join(path.dirname(filePath), `${componentName}.component.html`);
  const scssFilePath = path.join(path.dirname(filePath), `${componentName}.component.scss`);

  if (matchTemplate) {
    let htmlContent = matchTemplate[1];
    
    // Quick heuristic: If it's a page component (header-actions, page-header etc.), let's see if we can convert it to app-page-wrapper
    // Wait, replacing it with `app-page-wrapper` programmatically might be risky due to varying structures.
    // The prompt says "ما تخلي ولا ملف يكون فه ال تصميم وال ts , html بملف واحد افصلهم كلهم على ملفات html, ts,scss" (Do not leave any file having design and ts, html in one file, separate them all).
    // And "واذا في اشي بزبط نعدل عليه ليصير resusble اعمله" (If something can be made reusable, do it).
    // For now, let's at least extract them to files.

    fs.writeFileSync(htmlFilePath, htmlContent.trim() + '\n', 'utf8');
    content = content.replace(matchTemplate[0], `templateUrl: './${componentName}.component.html'`);
    modified = true;
  }

  if (matchStyles) {
    let scssContent = matchStyles[1];
    fs.writeFileSync(scssFilePath, scssContent.trim() + '\n', 'utf8');
    content = content.replace(matchStyles[0], `styleUrls: ['./${componentName}.component.scss']`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
  }
}

processDirectory('e:/Kimi/Kimi_Agent_Angular ERP Mock Site/erp-system/src/app');
