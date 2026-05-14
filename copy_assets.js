const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\urban\\.gemini\\antigravity\\brain\\21d04538-742a-4f7e-a4d0-dcfe791e7497\\dcc_hero_bg_1778717337698.png";
const destDir = "d:\\DCC_maintoken_sucess_indonesia\\homepage\\assets";
const dest = path.join(destDir, "hero_bg.png");

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log(`Copied ${src} to ${dest}`);
