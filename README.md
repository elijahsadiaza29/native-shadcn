# Shadcn UI "Pro" for React Native & Expo 🚀

A high-fidelity implementation of **Shadcn UI's** most requested "Display" components for the React Native ecosystem. Built with **NativeWind v4**.

> [!NOTE]
> This project is designed to complement existing libraries like **React Native Reusables** by providing the more complex, data-driven components they omit.

##  Features

- ** Modern Charts (Area, Bar, Line, Pie, Radial)**: Fully responsive, theme-aware, and interactive with custom popping tooltips.
- ** Sonner (Toasts)**: High-performance, rich-color toast notifications with responsive mobile layouts.
- ** Drawer (Bottom Sheet)**: Buttery-smooth native bottom sheets using a compositional API.

---

##  Quick Start

### 1. Install Native Dependencies

```bash
npx expo install react-native-gifted-charts gifted-charts-core react-native-svg expo-linear-gradient lucide-react-native sonner-native @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler @rn-primitives/slot @rn-primitives/portal
```

### 2. Configure Design Tokens

Add the HSL variables to your `global.css`. Detailed guide in [Installation Guide](./docs/installation.md).

---

## 🏗️ Components

###  Charts

A responsive wrapper around `gifted-charts` with a Shadcn-like API.

- **File**: `components/ui/chart.tsx`
- **Docs**: [View Chart Documentation](./docs/charts.md)

###  Sonner

Responsive toasts with custom icon support.

- **File**: `components/ui/sonner.tsx`
- **Docs**: [View Sonner Documentation](./docs/sonner.md)

###  Drawer

The native port of the `vaul`-based web drawer.

- **File**: `components/ui/drawer.tsx`
- **Docs**: [View Drawer Documentation](./docs/drawer.md)

---

##  Reusable Setup (CLI-ready)

This repo follows the **Shadcn "copy-paste" philosophy**. Simply grab the files you need from the `components/ui` folder and drop them into your project.

---

 © [Elijah P. Sadiaza]

---

**Built with ❤️ for the React Native Community.**
