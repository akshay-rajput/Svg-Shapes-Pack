import { svgMap } from "./utils/svgMap";

const svgList: Array<string> = [];
let gradientIdCounter = 0; // Keep track of unique gradient IDs

for (const key in svgMap) {
  svgList.push(svgMap[key]);
}

export interface SVGOptions {
  id?: string; // ID for the SVG element
  color?: string; // Single color for the shape
  size?: number; // Size of the SVG (both width and height)
  gradient?: boolean; // Whether to use a gradient
  gradientStartColor?: string; // Start color for the gradient
  gradientStopColor?: string; // Stop color for the gradient
}

export interface MergedSVGOptions
  extends Required<
    Pick<
      SVGOptions,
      "color" | "size" | "gradient" | "gradientStartColor" | "gradientStopColor"
    >
  > {}

export interface SingleSVGOption {
  id?: string; // ID for the SVG element
  color?: string; // Single color for the shape
  size?: number; // Size of the SVG (both width and height)
  gradient?: boolean; // Whether to use a gradient
  gradientStartColor?: string; // Start color for the gradient
  gradientStopColor?: string; // Stop color for the gradient
}

interface GetColorOptions {
  gradient: boolean;
  color: string;
  gradientStartColor: string;
  gradientStopColor: string;
}

const defaultOptions: MergedSVGOptions = {
  color: "blue",
  size: 16,
  gradient: false,
  gradientStartColor: "blue",
  gradientStopColor: "lightblue",
};

/**
 * Adds a viewBox attribute to an SVG template if it does not already exist.
 * This allows for correct scaling and positioning of the SVG content within its container.
 * @param {string} svgTemplate - The original SVG template where the viewBox attribute will be added.
 * @returns {string} The modified SVG template with the viewBox attribute added or the original SVG template if viewBox already exists.
 */
function addViewBox(svgTemplate: string): string {
  const viewBox = "0 0 200 200"; // Adjust based on the original SVG dimensions
  if (!svgTemplate.includes("viewBox")) {
    return svgTemplate.replace(/<svg([^>]*?)>/, `<svg$1 viewBox="${viewBox}">`);
  }
  return svgTemplate;
}

function getMergedOptions(
  options: Partial<MergedSVGOptions>
): MergedSVGOptions {
  const mergedOptions = {
    ...defaultOptions,
    ...Object.fromEntries(
      Object.entries(options).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    ),
  };

  return mergedOptions;
}

/**
 * Adds colors to an SVG element based on the provided options.
 * @param {Object} options - The options object.
 * @param {string} options.color - The fill color for the SVG element.
 * @param {boolean} options.gradient - A flag indicating if a gradient should be applied.
 * @param {string} options.gradientStartColor - The starting color of the gradient.
 * @param {string} options.gradientStopColor - The ending color of the gradient.
 * @returns {Object} An object containing the fill color and the gradient definition.
 */
function addColorsToSvg({
  color,
  gradient,
  gradientStartColor,
  gradientStopColor,
}: GetColorOptions): { fill: string; gradientDefinition: string } {
  const gradientId = `grad-${gradientIdCounter++}`; // Unique ID for each gradient
  // Apply gradient if enabled
  const fill = gradient ? `url(#${gradientId})` : `${color}`;

  const gradientDefinition = gradient
    ? `<defs>
      <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="5%" stop-color="${gradientStartColor}" />
        <stop offset="95%" stop-color="${gradientStopColor}" />
      </linearGradient>
    </defs>`
    : "";

  return { fill, gradientDefinition };
}

/**
 * Generates a random SVG image based on the provided options.
 * @param {SVGOptions} options - An object containing customizable options for the SVG image generation:
 *   - color: The color to be used for the SVG image.
 *   - size: The size of the SVG image.
 *   - gradient: A boolean indicating whether a gradient color effect is applied.
 *   - gradientStartColor: The starting color for the gradient effect.
 *   - gradientStopColor: The ending color for the gradient effect.
 * @returns {string} A string representing the randomly generated SVG image.
 */
export const getRandomSvg = (options: SVGOptions = {}): string => {
  const mergedOptions = getMergedOptions(options);

  const { color, size, gradient, gradientStartColor, gradientStopColor } =
    mergedOptions;

  // Pick a random shape from the list
  let svgTemplate = svgList[Math.floor(Math.random() * svgList.length)];

  const { gradientDefinition, fill } = addColorsToSvg({
    color,
    gradient,
    gradientStartColor,
    gradientStopColor,
  });

  // add viewbox for scaling
  svgTemplate = addViewBox(svgTemplate);

  // Replace placeholders with actual values
  return svgTemplate
    .replace(/<svg([^>]*)>/, `<svg$1>${gradientDefinition}`)
    .replace(/\${color}/g, fill)
    .replace(/\${width}/g, size ? size.toString() : "16")
    .replace(/\${height}/g, size ? size.toString() : "16");
};

/**
 * Processes SVG template based on provided options to generate a customized SVG icon.
 * @param {SingleSVGOption} options - An object containing customization options for the SVG icon.
 * @param {string} options.id - The unique identifier of the SVG icon.
 * @param {string} options.color - The color of the SVG icon. (Optional)
 * @param {number} options.size - The size of the SVG icon. (Optional)
 * @param {boolean} options.gradient - A boolean indicating if gradient is applied to the SVG icon. (Optional)
 * @param {string} options.gradientStartColor - The start color of the gradient. (Optional)
 * @param {string} options.gradientStopColor - The stop color of the gradient. (Optional)
 * @returns {string | null} The customized SVG icon as a string, or null if an error occurs.
 */
export const getSvgById = function (
  options: SingleSVGOption = {}
): string | null {
  try {
    if (options.id) {
      const mergedOptions = getMergedOptions(options);

      const { color, size, gradient, gradientStartColor, gradientStopColor } =
        mergedOptions;
      let svgTemplate = svgList[parseInt(options.id)];
      const { gradientDefinition, fill } = addColorsToSvg({
        color,
        gradient,
        gradientStartColor,
        gradientStopColor,
      });

      // add viewbox for scaling
      svgTemplate = addViewBox(svgTemplate);

      // Replace placeholders with actual values
      return svgTemplate
        .replace(/<svg([^>]*)>/, `<svg$1>${gradientDefinition}`)
        .replace(/\${color}/g, fill)
        .replace(/\${width}/g, size ? size.toString() : "16")
        .replace(/\${height}/g, size ? size.toString() : "16");
    } else {
      throw new Error("ID is required");
    }
  } catch (error) {
    throw new Error("Invalid ID");
  }
};

// color pairing map for random colors
const ColorPairingMap: Record<string, Array<string>> = {
  red: ["red", "pink"],
  pink: ["pink", "purple"],
  purple: ["purple", "blue"],
  blue: ["blue", "cyan"],
  cyan: ["cyan", "green"],
  green: ["green", "yellow"],
  yellow: ["yellow", "orange"],
  orange: ["orange", "red"],
};

/**
 * Takes an optional SVGOptions object and returns an array of modified SVG strings based on the provided options.
 * it modifies each SVG by adding specified colors or gradients.
 * If no color option is provided, it randomly selects colors from ColorPairingMap and applies gradients to the SVGs.
 * @param {SVGOptions} [options] - Optional options object that can include color, gradient, gradientStartColor, and gradientStopColor.
 * @returns {string[]} An array of modified SVG strings based on the provided or randomly selected colors and gradients.
 */
export const getAllSvgs = (options?: SVGOptions): string[] => {
  // if user provides color option, use that color
  if (
    options?.color ||
    (options?.gradient &&
      options.gradientStartColor &&
      options.gradientStopColor)
  ) {
    return svgList.map((svg) => {
      const { color, size, gradient, gradientStartColor, gradientStopColor } =
        getMergedOptions(options);
      const { gradientDefinition, fill } = addColorsToSvg({
        color,
        gradient,
        gradientStartColor,
        gradientStopColor,
      });

      // add viewbox for scaling
      let svgTemplate = addViewBox(svg);

      // Replace placeholders with actual values
      return svgTemplate
        .replace(/<svg([^>]*)>/, `<svg$1>${gradientDefinition}`)
        .replace(/\${color}/g, fill)
        .replace(/\${width}/g, size ? size.toString() : "16")
        .replace(/\${height}/g, size ? size.toString() : "16");
    });
  } else {
    // use random colors
    return svgList.map((svg) => {
      const randomColor =
        Object.keys(ColorPairingMap)[
          Math.floor(Math.random() * Object.keys(ColorPairingMap).length)
        ];
      const { color, size, gradient, gradientStartColor, gradientStopColor } =
        getMergedOptions({
          color: randomColor,
          size: options?.size || 16,
          gradient: true,
          gradientStartColor: ColorPairingMap[randomColor][0],
          gradientStopColor: ColorPairingMap[randomColor][1],
        });
      const { gradientDefinition, fill } = addColorsToSvg({
        color,
        gradient,
        gradientStartColor,
        gradientStopColor,
      });

      // add viewbox for scaling
      let svgTemplate = addViewBox(svg);

      // Replace placeholders with actual values
      return svgTemplate
        .replace(/<svg([^>]*)>/, `<svg$1>${gradientDefinition}`)
        .replace(/\${color}/g, fill)
        .replace(/\${width}/g, size ? size.toString() : "16")
        .replace(/\${height}/g, size ? size.toString() : "16");
    });
  }
};
