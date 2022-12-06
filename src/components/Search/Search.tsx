import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import theme from "../../../theme.json";
import { AntDesign } from "@expo/vector-icons";
import { getDefaultHeaderHeight } from "@react-navigation/elements";
import { FontAwesome } from "@expo/vector-icons";
import { useRef } from "react";

/**
 * Props of the search component.
 */
interface SearchProps {
  onBlur: () => void;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  scrollY: SharedValue<number>;
  searchFocused: SharedValue<boolean>;
  value: string;
}

/**
 * Big search component, occupies a lot of space with margins.
 */
function Search(props: SearchProps) {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  const expandedHeight = getDefaultHeaderHeight(frame, false, insets.top) + 10;

  const inputRef = useRef<TextInput>(null);

  const { onFocus, onBlur, searchFocused, scrollY } = props;

  const roundAnimatedStyle = useAnimatedStyle(() => {
    const focused = searchFocused.value;
    const offset = Math.max(Math.min(20 - scrollY.value, 20), 0) / 20;
    const negativeOffset = 1 - offset;
    return {
      borderRadius: withTiming(focused ? 0 : 100),
      height: withTiming(
        focused ? expandedHeight : 56 - (56 / 3) * negativeOffset
      ),
      marginBottom: withTiming(focused ? 0 : 20 * negativeOffset),
      paddingTop: withTiming(focused ? insets.top : 0),
    };
  });

  const innerAnimatedStyle = useAnimatedStyle(() => {
    const focused = searchFocused.value;
    const offset = Math.max(Math.min(20 - scrollY.value, 20), 0) / 20;
    return {
      paddingVertical: withTiming(focused ? 0 : 20 * offset),
      paddingHorizontal: withTiming(focused ? 0 : 20),
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const shadow = searchFocused.value || scrollY.value > 20;
    return {
      height: withTiming(searchFocused.value ? expandedHeight : 110),
      ...(Platform.OS === "ios"
        ? {
            shadowColor: "black",
            shadowOpacity: withTiming(shadow ? 0.15 : 0),
            shadowOffset: {
              width: withTiming(0),
              height: withTiming(shadow ? 2 : 0),
            },
          }
        : {}),
    };
  });

  const clearAnimatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(searchFocused.value ? 1 : 0, { duration: 200 }),
    right: withTiming(searchFocused.value ? 24 : 0),
  }));

  const blurAndClear = () => {
    inputRef.current?.blur?.();
    props.onChangeText("");
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <Animated.View style={[styles.inner, innerAnimatedStyle]}>
        <Animated.View style={[styles.rounded, roundAnimatedStyle]}>
          <TextInput
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="default"
            onBlur={onBlur}
            onChangeText={props.onChangeText}
            onFocus={onFocus}
            placeholder="Pesquisar conta"
            placeholderTextColor={theme.colors.placeholder}
            style={styles.input}
            selectTextOnFocus
            value={props.value}
            ref={inputRef}
          />

          <AntDesign name="search1" size={20} style={styles.icon} />

          <Animated.View
            style={[styles.iconClearContainer, clearAnimatedStyles]}
          >
            <TouchableOpacity
              onPress={blurAndClear}
              hitSlop={{ left: 20, top: 20, right: 20, bottom: 20 }}
            >
              <FontAwesome name="times" size={20} style={styles.iconClear} />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  inner: {
    padding: 20,
    backgroundColor: theme.colors.primary,
  },
  rounded: {
    backgroundColor: theme.colors.background,
    overflow: "hidden",
    position: "relative",
  },
  input: {
    width: "100%",
    height: "100%",
    paddingLeft: 60,
    fontSize: theme.sizes.medium,
  },
  icon: {
    position: "absolute",
    color: theme.colors.placeholder,
    left: 24,
    bottom: "50%",
    transform: [{ translateY: 10 }],
  },
  iconClear: {
    color: theme.colors.dropdownIcon,
  },
  iconClearContainer: {
    position: "absolute",
    right: 24,
    bottom: "50%",
    transform: [{ translateY: 10 }],
  },
});

export default Search;
