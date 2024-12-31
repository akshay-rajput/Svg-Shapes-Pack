const fs = require('fs');
const path = require('path');

// Input and output folder paths
const inputFolder = path.join(__dirname, 'svgs-min');
const outputFile = path.join(__dirname, 'svgMap.ts');

const GenerateSVGMap = () => {
  const svgMap = {};

  // Read all files in the svgs-min folder
  const files = fs.readdirSync(inputFolder).filter((file) => path.extname(file) === '.svg');

  files.forEach((file, index) => {
    const filePath = path.join(inputFolder, file);
    const svgCode = fs.readFileSync(filePath, 'utf8');

    // Add SVG code to the map with key as index + 1
    svgMap[index + 1] = svgCode.trim();
  });

  const tsContent = `export const svgMap: Record<number, string> = ${JSON.stringify(svgMap, null, 2)};`;

  fs.writeFileSync(outputFile, tsContent, 'utf8');
  console.log(`svgMap.ts has been generated!`);
}

// Process all SVG files in the input folder
GenerateSVGMap();