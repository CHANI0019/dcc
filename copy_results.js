const fs = require('fs');
const path = require('path');

const srcDir = "d:\\DCC_maintoken_sucess_indonesia\\results";
const destDir = "d:\\DCC_maintoken_sucess_indonesia\\homepage\\results";

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    
    if (fs.lstatSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file} to ${destDir}`);
    }
});
