const fs = require('fs');
const files = [
    'app/dashboard-restaurante/mercado/page.tsx',
    'app/dashboard-restaurante/faturamento/page.tsx',
    'app/dashboard-restaurante/cardapio/page.tsx',
    'app/dashboard-restaurante/operacional/page.tsx',
    'app/dashboard-restaurante/clientes/page.tsx',
];

files.forEach(f => {
    let c = fs.readFileSync(f, 'utf-8');
    // Fix mojibake (UTF-8 read as Latin-1 then re-encoded)
    const replacements = [
        ['Ã©', 'é'], ['Ã£', 'ã'], ['Ã§', 'ç'], ['Ãµ', 'õ'], ['Ã¡', 'á'],
        ['Ãª', 'ê'], ['Ã­', 'í'], ['Ã³', 'ó'], ['Ãº', 'ú'], ['Ã¢', 'â'],
        ['Ã‡', 'Ç'], ['Ãƒ', 'Ã'], ['Ã¶', 'ö'], ['Ã¼', 'ü'],
    ];
    replacements.forEach(([from, to]) => {
        c = c.split(from).join(to);
    });
    fs.writeFileSync(f, c, 'utf-8');
    console.log('Fixed:', f);
});
console.log('Done!');
