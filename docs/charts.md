# Charts UI component

A high-fidelity charting system for React Native, inspired by Shadcn UI and built on top of `react-native-gifted-charts`.

## Installation

This component requires the foundation specified in the [Installation Guide](./installation.md).

```bash
npx expo install react-native-gifted-charts gifted-charts-core
```

## Source Code

Copy the source from `components/ui/chart.tsx` into your project.

## Basic Usage

```tsx
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import { BarChart } from "react-native-gifted-charts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const data = [
  { value: 10, label: "Jan" },
  { value: 20, label: "Feb" },
];

export default function App() {
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        data={data}
        pointerConfig={{
          showPointerStrip: false,
          pointerLabelComponent: (items) => (
            <ChartTooltip active payload={items} />
          ),
        }}
      />
      <ChartLegend />
    </ChartContainer>
  );
}
```

## Key Components

### `<ChartContainer />`

The parent wrapper that provides context and responsiveness.

- **Auto-width**: Measures its own layout and injects width into chart children.
- **Theme bridging**: Automatically resolves `hsl(var(--chart-x))` based on light/dark mode.

### `<ChartTooltip />`

A popover component for interactive charts.

- **Pointer support**: Works with `pointerConfig` in Bar, Line, and Area charts.
- **Segment support**: Works with `tooltipComponent` in Pie and Radial charts.

### `<ChartLegend />`

A responsive row of indicator dots and labels derived from your `chartConfig`.

## API Reference

| Prop        | Type          | Description                                      |
| :---------- | :------------ | :----------------------------------------------- |
| `config`    | `ChartConfig` | Object mapping keys to labels and colors.        |
| `children`  | `ReactNode`   | The Gifted Charts component and optional Legend. |
| `className` | `string`      | Optional Tailwind classes for the container.     |
