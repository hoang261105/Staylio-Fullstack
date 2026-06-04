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
    
    // Only replace if dark: is not already there
    const replacements = [
        [/bg-slate-50(?!\s+dark:bg-gray-900)/g, 'bg-slate-50 dark:bg-gray-900'],
        [/bg-white(?!\s+dark:bg-gray-800)/g, 'bg-white dark:bg-gray-800'],
        [/text-gray-900(?!\s+dark:text-white)/g, 'text-gray-900 dark:text-white'],
        [/text-gray-800(?!\s+dark:text-gray-100)/g, 'text-gray-800 dark:text-gray-100'],
        [/text-gray-700(?!\s+dark:text-gray-200)/g, 'text-gray-700 dark:text-gray-200'],
        [/text-gray-600(?!\s+dark:text-gray-300)/g, 'text-gray-600 dark:text-gray-300'],
        [/text-gray-500(?!\s+dark:text-gray-400)/g, 'text-gray-500 dark:text-gray-400'],
        [/text-gray-400(?!\s+dark:text-gray-500)/g, 'text-gray-400 dark:text-gray-500'],
        [/border-gray-100(?!\s+dark:border-gray-700)/g, 'border-gray-100 dark:border-gray-700'],
        [/border-gray-200(?!\s+dark:border-gray-600)/g, 'border-gray-200 dark:border-gray-600'],
        [/bg-gray-50(?!\s+dark:bg-gray-700|0)/g, 'bg-gray-50 dark:bg-gray-700'],
        [/bg-gray-100(?!\s+dark:bg-gray-700)/g, 'bg-gray-100 dark:bg-gray-700'],
        [/bg-gray-200(?!\s+dark:bg-gray-600)/g, 'bg-gray-200 dark:bg-gray-600'],
        [/border-b(?!\s+dark:border-gray-700|-)/g, 'border-b dark:border-gray-700'],
        [/border-t(?!\s+dark:border-gray-700|-)/g, 'border-t dark:border-gray-700']
    ];

    let original = content;
    for (const [regex, repl] of replacements) {
        content = content.replace(regex, repl);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated', filePath);
    }
}

for (const dir of dirs) {
    processDir(dir);
}
