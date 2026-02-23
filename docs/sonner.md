# Sonner UI component

A beautiful, responsive toast notification system for React Native, inspired by Shadcn UI and built on top of `sonner-native`.

## Installation

This component requires the foundation specified in the [Installation Guide](./installation.md).

```bash
npx expo install sonner-native lucide-react-native
```

## Source Code

Copy the source from `components/ui/sonner.tsx` into your project.

## Basic Usage

### 1. Register the Toaster

Place the `<Toaster />` component at the root of your application.

```tsx
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout() {
  return (
    <>
      <Stack />
      <Toaster />
    </>
  );
}
```

### 2. Triggering Toasts

Use the standard `toast` function from the library.

```tsx
import { toast } from "@/components/ui/sonner";

toast.success("Profile updated!", {
  description: "Changes have been saved successfully.",
});

toast.error("An error occurred", {
  description: "Please try again later.",
});
```

## Features

- **Rich Icons**: Automatically comes with Lucide icons for Success, Error, Warning, Info, and Loading.
- **Micro-Animations**: Features a built-in spinning loader for the "loading" state.
- **Responsive Width**: Optimized for mobile screens with a fixed 300px width and properly centered labels.
- **Theme Aware**: Supports automatic light/dark mode transitions out of the box.
