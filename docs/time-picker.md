# Time Picker UI component

A beautifully animated Time Picker component for React Native, designed for selecting time in both analog dial and digital input modes.

## Installation

You can install this component via our CLI:

```bash
npx github:elijahsadiaza29/native-shadcn add time-picker
```

### Manual Installation

If you prefer to install it manually:

```bash
npx expo install react-native-reanimated react-native-svg lucide-react-native
```

> [!IMPORTANT]
> Ensure you have configured **React Native Reanimated** properly in your `babel.config.js`.

## Source Code

Copy the source code from `components/ui/time-picker.tsx` into your project.

## Basic Usage

The `TimePicker` component is designed to be easily embedded inside your existing modals, such as an `AlertDialog` or `Drawer`.

```tsx
import * as React from "react";
import { Text } from "react-native";
import { TimePicker, type TimePickerValue } from "@/components/ui/time-picker";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function MyTimePickerForm() {
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  const handleTimeConfirm = (value: TimePickerValue) => {
    console.log("Selected time:", value);
    // { hour: 12, minute: 30, period: 'PM' }
    setIsPickerOpen(false);
  };

  return (
    <AlertDialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full max-w-xs">
          <Text>Set Appointment Time</Text>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-[360px] border-0 bg-transparent p-0 shadow-none">
        <TimePicker
          initialHour={12}
          initialMinute={0}
          initialPeriod="AM"
          onConfirm={handleTimeConfirm}
          onCancel={() => setIsPickerOpen(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

## Features

- **Dual Modes**: Offers both an analog `dial` (clock face) and a digital `input` (keyboard entry) interface.
- **Fluid Animations**: Provides buttery-smooth transitions and gestures powered by `react-native-reanimated`.
- **Accessibility & Theming**: Responds directly to your app's dark or light mode via `nativewind`.
- **Gestures**: Swipe-to-select numbers natively supported by `PanResponder` and math-calculated angles for the selector.
- **Pre-configured Variants**: Includes `TimePickerDial` and `TimePickerInput` exports if you want to explicitly enforce a starting mode..
