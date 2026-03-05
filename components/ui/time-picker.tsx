import { cn } from '@/lib/utils';
import { Clock, Keyboard } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import {
  PanResponder,
  Pressable,
  Text,
  TextInput,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Line as SvgLine, Text as SvgText } from 'react-native-svg';

type Period = 'AM' | 'PM';
type PickerMode = 'dial' | 'input';
type ActiveSelection = 'hour' | 'minute';

export type TimePickerValue = {
  hour: number; // 1–12
  minute: number; // 0–59
  period: Period;
};

export type TimePickerProps = {
  /** Initial hour (1–12). Default 12. */
  initialHour?: number;
  /** Initial minute (0–59). Default 0. */
  initialMinute?: number;
  /** Initial period. Default 'AM'. */
  initialPeriod?: Period;
  /** Initial mode. Default 'dial'. */
  initialMode?: PickerMode;
  /** Called when the user presses OK. */
  onConfirm?: (value: TimePickerValue) => void;
  /** Called when the user presses Cancel. */
  onCancel?: () => void;
  /** Optional container style */
  style?: ViewStyle;
  /** Optional className for the container */
  className?: string;
};

function useTimePickerTheme() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    // Surface colors
    surfaceContainer: isDark ? 'hsl(0 0% 3.9%)' : 'hsl(0 0% 100%)',
    surfaceVariant: isDark ? 'hsl(0 0% 14.9%)' : 'hsl(0 0% 96.1%)',
    // Text
    onSurface: isDark ? 'hsl(0 0% 98%)' : 'hsl(0 0% 3.9%)',
    onSurfaceVariant: isDark ? 'hsl(0 0% 63.9%)' : 'hsl(0 0% 45.1%)',
    // Primary
    primary: isDark ? 'hsl(250 60% 72%)' : 'hsl(250 50% 50%)',
    onPrimary: isDark ? 'hsl(250 30% 15%)' : 'hsl(0 0% 100%)',
    primaryContainer: isDark ? 'hsl(250 40% 25%)' : 'hsl(250 80% 92%)',
    onPrimaryContainer: isDark ? 'hsl(250 80% 90%)' : 'hsl(250 50% 30%)',
    // Outline
    outline: isDark ? 'hsl(0 0% 30%)' : 'hsl(0 0% 75%)',
    outlineVariant: isDark ? 'hsl(0 0% 20%)' : 'hsl(0 0% 85%)',
    outlineVariant2: isDark ? 'hsl(0, 0%, 9%)' : 'hsl(0 0% 100%)',
  };
}

const CLOCK_SIZE = 256;
const CLOCK_RADIUS = CLOCK_SIZE / 2;
const NUMBER_RADIUS = CLOCK_RADIUS - 36;
const CENTER = CLOCK_RADIUS;
const SELECTOR_RADIUS = 20;

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

function angleToValue(angle: number, isHour: boolean): number {
  let normalized = ((angle % 360) + 360) % 360;
  if (isHour) {
    const hour = Math.round(normalized / 30) % 12;
    return hour === 0 ? 12 : hour;
  } else {
    return Math.round(normalized / 6) % 60;
  }
}

function valueToAngle(value: number, isHour: boolean): number {
  if (isHour) {
    return (value % 12) * 30;
  } else {
    return value * 6;
  }
}

function positionToAngle(x: number, y: number): number {
  const dx = x - CENTER;
  const dy = y - CENTER;
  let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
  return ((angle % 360) + 360) % 360;
}

function padZero(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function TimePicker({
  initialHour = 12,
  initialMinute = 0,
  initialPeriod = 'AM',
  initialMode = 'dial',
  onConfirm,
  onCancel,
  style,
  className,
}: TimePickerProps) {
  const [hour, setHour] = React.useState(initialHour);
  const [minute, setMinute] = React.useState(initialMinute);
  const [period, setPeriod] = React.useState<Period>(initialPeriod);
  const [mode, setMode] = React.useState<PickerMode>(initialMode);
  const [activeSelection, setActiveSelection] = React.useState<ActiveSelection>('hour');
  const theme = useTimePickerTheme();

  const handleConfirm = React.useCallback(() => {
    onConfirm?.({ hour, minute, period });
  }, [hour, minute, period, onConfirm]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  // Animation values for the clock dial
  const clockScale = useSharedValue(initialMode === 'dial' ? 1 : 0.8);
  const clockOpacity = useSharedValue(initialMode === 'dial' ? 1 : 0);

  // We need local state to manage the mounting/unmounting of the clock dial *after* the animation finishes
  const [shouldRenderClock, setShouldRenderClock] = React.useState(initialMode === 'dial');

  const toggleMode = React.useCallback(() => {
    if (mode === 'dial') {
      // Switch TO input mode
      setMode('input');
      clockScale.value = withTiming(0.8, { duration: 250, easing: Easing.out(Easing.ease) });
      clockOpacity.value = withTiming(0, { duration: 200, easing: Easing.linear }, () => {
        runOnJS(setShouldRenderClock)(false);
      });
    } else {
      // Switch TO dial mode
      setMode('dial');
      setShouldRenderClock(true);
      // Reset values before animating in
      clockScale.value = 0.8;
      clockOpacity.value = 0;

      clockScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.5)) });
      clockOpacity.value = withTiming(1, { duration: 250, easing: Easing.linear });
    }
  }, [mode, clockScale, clockOpacity]);

  const animatedClockStyle = useAnimatedStyle(() => {
    return {
      opacity: clockOpacity.value,
      transform: [{ scale: clockScale.value }],
    };
  });

  return (
    <View
      className={cn('w-full max-w-[328px] rounded-3xl p-6 shadow-lg', className)}
      style={[{ backgroundColor: theme.outlineVariant2 }, style]}>
      <Text className="mb-5 mr-4 text-xs font-medium text-muted-foreground">
        {mode === 'dial' ? 'Select time' : 'Enter time'}
      </Text>

      <TimeSelectionHeader
        hour={hour}
        minute={minute}
        period={period}
        activeSelection={activeSelection}
        onHourChange={setHour}
        onMinuteChange={setMinute}
        onPeriodChange={setPeriod}
        onActiveSelectionChange={setActiveSelection}
      />

      <Animated.View layout={LinearTransition.duration(300)}>
        {shouldRenderClock && (
          <Animated.View style={animatedClockStyle} key={activeSelection}>
            <ClockDial
              value={activeSelection === 'hour' ? hour : minute}
              isHour={activeSelection === 'hour'}
              onChange={(v) => {
                if (activeSelection === 'hour') {
                  setHour(v);
                } else {
                  setMinute(v);
                }
              }}
              onSelectionComplete={() => {
                if (activeSelection === 'hour') {
                  setActiveSelection('minute');
                }
              }}
            />
          </Animated.View>
        )}
      </Animated.View>

      <View className="mt-4 flex-row items-center justify-between">
        <Pressable onPress={toggleMode} className="p-2">
          {mode === 'dial' ? (
            <Keyboard size={24} color={theme.outline} />
          ) : (
            <Clock size={24} color={theme.outline} />
          )}
        </Pressable>

        <View className="flex-row items-center gap-2">
          <Pressable onPress={handleCancel} className="px-4 py-2">
            <Text style={{ fontSize: 14, fontWeight: '500', color: theme.primary }}>Cancel</Text>
          </Pressable>
          <Pressable onPress={handleConfirm} className="px-4 py-2">
            <Text style={{ fontSize: 14, fontWeight: '500', color: theme.primary }}>OK</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type TimeBoxProps = {
  value: number;
  onValueChange: (v: number) => void;
  isActive: boolean;
  onPress: () => void;
  label: string;
};

function TimeBox({ value, onValueChange, isActive, onPress, label }: TimeBoxProps) {
  const theme = useTimePickerTheme();
  const [text, setText] = React.useState(padZero(value));

  // Sync internal text when the external value changes (e.g. from dial movement)
  React.useEffect(() => {
    setText(padZero(value));
  }, [value]);

  const handleBlur = React.useCallback(() => {
    let val = parseInt(text, 10);
    const isHour = label === 'Hour';
    if (isNaN(val)) val = isHour ? 1 : 0;
    if (isHour) {
      if (val < 1) val = 1;
      if (val > 12) val = 12;
    } else {
      if (val < 0) val = 0;
      if (val > 59) val = 59;
    }
    setText(padZero(val));
    onValueChange(val);
  }, [text, label, onValueChange]);

  const handleTextChange = React.useCallback(
    (newText: string) => {
      setText(newText);
      const val = parseInt(newText, 10);
      if (!isNaN(val)) {
        const isHour = label === 'Hour';
        if (isHour) {
          if (val >= 1 && val <= 12) {
            onValueChange(val);
          }
        } else {
          if (val >= 0 && val <= 59) {
            onValueChange(val);
          }
        }
      }
    },
    [label, onValueChange]
  );

  return (
    <View className="items-center">
      <TextInput
        value={text}
        onChangeText={handleTextChange}
        onBlur={handleBlur}
        onFocus={onPress}
        keyboardType="number-pad"
        maxLength={2}
        selectTextOnFocus
        style={{
          fontSize: 44,
          fontWeight: '500',
          color: isActive ? theme.onPrimaryContainer : theme.onSurfaceVariant,
          backgroundColor: isActive ? theme.primaryContainer : theme.surfaceVariant,
          borderRadius: 8,
          borderWidth: isActive ? 2 : 0,
          borderColor: theme.primary,
          paddingHorizontal: 12,
          minWidth: 88,
          height: 80,
          textAlign: 'center',
        }}
      />
      <Text
        style={{
          fontSize: 11,
          color: theme.onSurfaceVariant,
          marginTop: 4,
        }}>
        {label}
      </Text>
    </View>
  );
}

type TimeSelectionHeaderProps = {
  hour: number;
  minute: number;
  period: Period;
  activeSelection: ActiveSelection;
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
  onPeriodChange: (p: Period) => void;
  onActiveSelectionChange: (s: ActiveSelection) => void;
};

function TimeSelectionHeader({
  hour,
  minute,
  period,
  activeSelection,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  onActiveSelectionChange,
}: TimeSelectionHeaderProps) {
  const theme = useTimePickerTheme();

  return (
    <View className="mb-6 flex-row items-start justify-center gap-3">
      <TimeBox
        label="Hour"
        value={hour}
        onValueChange={onHourChange}
        isActive={activeSelection === 'hour'}
        onPress={() => onActiveSelectionChange('hour')}
      />

      <View style={{ height: 80, justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: 44,
            fontWeight: '500',
            color: theme.onSurface,
            marginHorizontal: 0,
            paddingBottom: 4,
          }}>
          :
        </Text>
      </View>

      <TimeBox
        label="Minute"
        value={minute}
        onValueChange={onMinuteChange}
        isActive={activeSelection === 'minute'}
        onPress={() => onActiveSelectionChange('minute')}
      />

      <View className="flex-1" />

      <PeriodToggle period={period} onPeriodChange={onPeriodChange} />
    </View>
  );
}

type ClockDialProps = {
  value: number;
  isHour: boolean;
  onChange: (value: number) => void;
  onSelectionComplete?: () => void;
};

function ClockDial({ value, isHour, onChange, onSelectionComplete }: ClockDialProps) {
  const theme = useTimePickerTheme();

  const currentAngle = valueToAngle(value, isHour);
  const selectorAngleRad = (currentAngle - 90) * (Math.PI / 180);
  const selectorX = CENTER + NUMBER_RADIUS * Math.cos(selectorAngleRad);
  const selectorY = CENTER + NUMBER_RADIUS * Math.sin(selectorAngleRad);

  const numbers = isHour ? HOURS : MINUTES;

  const handleTouch = React.useCallback(
    (x: number, y: number) => {
      const angle = positionToAngle(x, y);
      const newValue = angleToValue(angle, isHour);
      onChange(newValue);
    },
    [isHour, onChange]
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          const { locationX, locationY } = evt.nativeEvent;
          handleTouch(locationX, locationY);
        },
        onPanResponderMove: (
          _evt: GestureResponderEvent,
          _gestureState: PanResponderGestureState
        ) => {
          const { locationX, locationY } = _evt.nativeEvent;
          handleTouch(locationX, locationY);
        },
        onPanResponderRelease: () => {
          onSelectionComplete?.();
        },
      }),
    [handleTouch, onSelectionComplete]
  );

  return (
    <View
      style={{
        width: CLOCK_SIZE,
        height: CLOCK_SIZE,
        alignSelf: 'center',
      }}
      {...panResponder.panHandlers}>
      <Svg width={CLOCK_SIZE} height={CLOCK_SIZE}>
        {/* Background circle */}
        <Circle cx={CENTER} cy={CENTER} r={CLOCK_RADIUS - 2} fill={theme.surfaceVariant} />

        {/* Selector line */}
        <SvgLine
          x1={CENTER}
          y1={CENTER}
          x2={selectorX}
          y2={selectorY}
          stroke={theme.primary}
          strokeWidth={2}
        />

        {/* Center dot */}
        <Circle cx={CENTER} cy={CENTER} r={4} fill={theme.primary} />

        {/* Selector circle */}
        <Circle cx={selectorX} cy={selectorY} r={SELECTOR_RADIUS} fill={theme.primary} />

        {/* Numbers */}
        {numbers.map((num, index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const x = CENTER + NUMBER_RADIUS * Math.cos(angle);
          const y = CENTER + NUMBER_RADIUS * Math.sin(angle);

          // More precise: exact match for the selector position
          const isExactlySelected = isHour ? num === value : num === value;

          return (
            <SvgText
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="central"
              fontSize={14}
              fontWeight={isExactlySelected ? '700' : '400'}
              fill={isExactlySelected ? theme.onPrimary : theme.onSurface}>
              {isHour ? num.toString() : padZero(num)}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

function PeriodToggle({
  period,
  onPeriodChange,
}: {
  period: Period;
  onPeriodChange: (p: Period) => void;
}) {
  const theme = useTimePickerTheme();

  return (
    <View
      style={{
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.outline,
        overflow: 'hidden',
        height: 80,
        width: 52,
      }}>
      <Pressable
        onPress={() => onPeriodChange('AM')}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: period === 'AM' ? theme.primaryContainer : 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: theme.outline,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: period === 'AM' ? theme.onPrimaryContainer : theme.onSurfaceVariant,
          }}>
          AM
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onPeriodChange('PM')}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: period === 'PM' ? theme.primaryContainer : 'transparent',
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: period === 'PM' ? theme.onPrimaryContainer : theme.onSurfaceVariant,
          }}>
          PM
        </Text>
      </Pressable>
    </View>
  );
}

/** Pre-configured TimePicker that starts in Dial mode */
export function TimePickerDial(props: Omit<TimePickerProps, 'initialMode'>) {
  return <TimePicker {...props} initialMode="dial" />;
}

/** Pre-configured TimePicker that starts in Input mode */
export function TimePickerInput(props: Omit<TimePickerProps, 'initialMode'>) {
  return <TimePicker {...props} initialMode="input" />;
}
