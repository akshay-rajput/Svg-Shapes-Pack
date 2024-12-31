import { svgMap } from "./utils/svgMap";

const svgList: Array<string> = [];

for (const key in svgMap) {
  svgList.push(svgMap[key]);
}

export interface GetRandomSVGOptions {
  color?: string; // Single color for the shape
  size?: number; // Size of the SVG (both width and height)
  gradient?: boolean; // Whether to use a gradient
  gradientStartColor?: string; // Start color for the gradient
  gradientStopColor?: string; // Stop color for the gradient
}

const defaultOptions: GetRandomSVGOptions = {
  color: "blue",
  size: 16,
  gradient: false,
  gradientStartColor: "blue",
  gradientStopColor: "lightblue",
};

function addViewBox(svgTemplate: string): string {
  const viewBox = "0 0 200 200"; // Adjust based on the original SVG dimensions
  if (!svgTemplate.includes("viewBox")) {
    return svgTemplate.replace(/<svg([^>]*?)>/, `<svg$1 viewBox="${viewBox}">`);
  }
  return svgTemplate;
}

export const getRandomSvg = (options: GetRandomSVGOptions = {}): string => {
  const mergedOptions = { ...defaultOptions, ...options };
  Object.keys(mergedOptions).forEach((key) => {
    if (mergedOptions[key] === undefined || mergedOptions[key] === "") {
      mergedOptions[key] = defaultOptions[key];
    }
  });
  const { color, size, gradient, gradientStartColor, gradientStopColor } =
    mergedOptions;

  // Pick a random shape from the list
  let svgTemplate = svgList[Math.floor(Math.random() * svgList.length)];

  // Apply gradient if enabled
  const fill = gradient ? `url(#grad)` : `${color}`;

  const gradientDefinition = gradient
    ? `<defs>
      <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="5%" stop-color="${gradientStartColor}" />
        <stop offset="95%" stop-color="${gradientStopColor}" />
      </linearGradient>
    </defs>`
    : "";

  // add viewbox for scaling
  svgTemplate = addViewBox(svgTemplate);

  // Replace placeholders with actual values
  return svgTemplate
    .replace(/<svg([^>]*)>/, `<svg$1>${gradientDefinition}`)
    .replace(/\${color}/g, fill)
    .replace(/\${width}/g, size ? size.toString() : "16")
    .replace(/\${height}/g, size ? size.toString() : "16");
};
