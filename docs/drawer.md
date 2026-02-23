# Drawer UI component

A robust, accessible Drawer (Bottom Sheet) component for React Native, inspired by Shadcn UI and built on top of `@gorhom/bottom-sheet`.

## Installation

This component requires the foundation specified in the [Installation Guide](./installation.md).

```bash
npx expo install @gorhom/bottom-sheet react-native-reanimated react-native-gesture-handler @rn-primitives/slot @rn-primitives/portal
```

> [!IMPORTANT]
> Ensure you have configured **React Native Reanimated** and wrapped your app in `GestureHandlerRootView` and `BottomSheetModalProvider`.

## Source Code

Copy the source from `components/ui/drawer.tsx` into your project.

## Basic Usage

```tsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function MySheet() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <View className="p-4">
          <Text>Your content here...</Text>
        </View>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

## Features

- **Slot/Portal Integration**: Uses `@rn-primitives` to ensure the drawer renders above navigation elements.
- **Trigger/Content Logic**: Handles its own state management, but can be controlled via `open` and `onOpenChange` props.
- **Native Experience**: Powered by `@gorhom/bottom-sheet` for buttery-smooth native gestures.
- **Compositional API**: Matches the Shadcn UI "Sub-component" pattern for maximum flexibility.
