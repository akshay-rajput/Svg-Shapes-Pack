# Svg-Shapes-Pack

Svg-Shapes-Pack is a utility library for getting random SVG shape icons. It allows you to generate random or customized SVG icons based on provided options.

---
Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Importing the Library](#importing-the-library)
  - [Generating a Random SVG](#generating-a-random-svg)
  - [Getting an SVG by ID](#getting-an-svg-by-id)
  - [Getting All SVGs](#getting-all-svgs)
- [Examples](#examples)
  - [Reactjs - Basic example](#reactjs---basic-example)
  - [Reactjs - Dynamic svg](#reactjs---dynamic-svg)
  - [Reactjs - Performance optimization (memoization)](#reactjs---performance-optimization-memoization)
  - [Nextjs with App router](#nextjs-with-app-router)
- [API](#api)
- [License](#license)

## Installation

To install the package, use npm:

```sh
npm install svg-shapes-pack
```

## Usage

### Importing the Library

```typescript
import { getRandomSvg, getSvgById, getAllSvgs } from 'svg-shapes-pack';
```

### Generating a Random SVG

You can generate a random SVG with customizable options:

```typescript
const options: SVGOptions = {
  color: 'red',
  size: 24,
  gradient: true,
  gradientStartColor: 'red',
  gradientStopColor: 'yellow',
};

const randomSvg = getRandomSvg(options);
console.log(randomSvg);
```

### Getting an SVG by ID

You can get a specific SVG by its ID and customize it. Useful if you need same svg everytime you call this function.

```typescript
const options: SingleSVGOption = {
  id: '1',
  color: 'blue',
  size: 32,
  gradient: true,
  gradientStartColor: 'blue',
  gradientStopColor: 'green',
};

const svgById = getSvgById(options);
console.log(svgById);
```

### Getting All SVGs

You can get all SVGs with customizable options:

```typescript
const options: SVGOptions = {
  color: 'purple',
  gradient: true,
  gradientStartColor: 'purple',
  gradientStopColor: 'pink',
};

const allSvgs = getAllSvgs(options);
console.log(allSvgs);
```

---

## Examples

### Reactjs - Basic example

```jsx
import { useState, useEffect } from 'react'
import { getRandomSvg } from "svg-shapes-pack"

function RandomIcon() {
  const [svg, setSvg] = useState('')
  
  useEffect(() => {
    setSvg(getRandomSvg({
      color: "orange",
      size: 32,
      gradient: true,
      gradientStartColor: "red",
      gradientStopColor: "white"
    }))
  }, [])
  
  if (!svg) return null // or loading state
  
  return <span dangerouslySetInnerHTML={{ __html: svg }} />
}
```

### Reactjs - Dynamic svg

```jsx
function DynamicSvg({ color, size }) {
  const [svg, setSvg] = useState('')
  
  useEffect(() => {
    setSvg(getRandomSvg({ color, size }))
  }, [color, size]) // SVG updates when props change
  
  return <span dangerouslySetInnerHTML={{ __html: svg }} />
}

// Usage:
<DynamicSvg color="blue" size={24} />
```

### Reactjs - Performance optimization (memoization)

```jsx
const CachedSvg = memo(function CachedSvg({ id, options }) {
  const [svg, setSvg] = useState('')
  
  useEffect(() => {
    setSvg(getSvgById({ id, ...options }))
  }, [id, JSON.stringify(options)])
  
  return <span dangerouslySetInnerHTML={{ __html: svg }} />
})
```

### Nextjs with App router
Note - Direct usage without useEffect will cause hydration mismatches. Also initialize state with empty string to avoid hydration errors.

```jsx
'use client'
import { useState, useEffect } from 'react'
import { getRandomSvg, getSvgById, getAllSvgs } from "svg-shapes-pack"

// As a reusable component
export function ShuffleSvg({ color = "blue", size = 32 }) {
  const [svg, setSvg] = useState('')
  
  useEffect(() => {
    setSvg(getRandomSvg({ color, size }))
  }, [color, size])
  
  return <span dangerouslySetInnerHTML={{ __html: svg }} />
}

// Usage with getAllSvgs
export function SvgGallery({ options = {} }) {
  const [svgs, setSvgs] = useState<string[]>([])
  
  useEffect(() => {
    setSvgs(getAllSvgs(options))
  }, [options])
  
  return (
    <div className="flex gap-2">
      {svgs.map((svg, i) => (
        <span key={i} dangerouslySetInnerHTML={{ __html: svg }} />
      ))}
    </div>
  )
}

// Usage with getSvgById
export function SpecificSvg({ id, options = {} }) {
  const [svg, setSvg] = useState('')
  
  useEffect(() => {
    setSvg(getSvgById({ id, ...options }))
  }, [id, options])
  
  return <span dangerouslySetInnerHTML={{ __html: svg }} />
}
```

---

## API

`getRandomSvg(options: SVGOptions): string` - 
Generates a random SVG image based on the provided options.

- `options (optional)`: An object containing customizable options for the SVG image generation:
  - `color`: The color (**string**) of the SVG icon. (Optional).
  - `size`: A **number** used for size of the SVG icon. (Optional).
  - `gradient`: A **boolean** indicating if gradient is applied to the SVG icon. (Optional)
  - `gradientStartColor`: The start color (**string**) of the gradient. (Optional)
  - `gradientStopColor`: The stop color (**string**) of the gradient. (Optional)

---
`getSvgById(options: SingleSVGOption): string | null` -
Processes an SVG template based on provided options to generate a customized SVG icon.

- `options`: An object containing customization options for the SVG icon:
  - `id`: The unique identifier (**string between 1 to 120**) of the SVG icon.
  - `color`: The color (**string**) of the SVG icon. (Optional)
  - `size`: A **number** used for size of the SVG icon. (Optional)
  - `gradient`: A **boolean** indicating if gradient is applied to the SVG icon. (Optional)
  - `gradientStartColor`: The start color (**string**) of the gradient. (Optional)
  - `gradientStopColor`: The stop color (**string**) of the gradient. (Optional)

---

`getAllSvgs(options?: SVGOptions): string[]`
Takes an optional `SVGOptions` object and returns an array of modified SVG strings based on the provided options. If no color option is provided, it randomly selects colors and applies gradients to the SVGs.

- `options` (optional): An object containing customizable options for the SVG image generation:
  - `color`: The color (**string**) of the SVG icon. (Optional)
  - `size`: A **number** used for size of the SVG icon. (Optional)
  - `gradient`: A **boolean** indicating if gradient is applied to the SVG icon. (Optional)
  - `gradientStartColor`: The start color (**string**) of the gradient. (Optional)
  - `gradientStopColor`: The stop color (**string**) of the gradient. (Optional)

---

## License

This project is licensed under the MIT License.