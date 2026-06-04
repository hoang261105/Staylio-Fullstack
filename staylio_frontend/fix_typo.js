const fs = require('fs');
const path = require('path');

const dirs = [
    'd:/BookingHotel/staylio_frontend/user/src/pages',
    'd:/BookingHotel/staylio_frontend/user/src/components'
];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    const replacements = [
        [/border-t dark:border-gray-700ransparent/g, 'border-transparent'],
        [/border-b dark:border-gray-700lue-400/g, 'border-blue-400'],
        [/border-t dark:border-gray-700(?![\w-])/g, 'border-t'],
        [/border-b dark:border-gray-700(?![\w-])/g, 'border-b']
    ];

    let original = content;
    for (const [regex, repl] of replacements) {
        content = content.replace(regex, repl);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Fixed typo in', filePath);
    }
}

for (const dir of dirs) {
    processDir(dir);
}
