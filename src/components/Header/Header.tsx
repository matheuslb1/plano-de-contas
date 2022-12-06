import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import theme from "../../../theme.json";
import { getDefaultHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";

/**
 * Props of the header component.
 */
interface HeaderProps {
  hidden?: SharedValue<boolean>;
  onBackPress?: () => void;
  onRightPress?: () => void;
  rightIcon: string;
  showBack?: boolean;
  title: string;
}

/**
 * Main navbar/header of the app. Has the ability to be hidden by passing a
 * reanimated shared value. It can also have its right icon be customized
 * by props.
 */
function Header(props: HeaderProps) {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();
  const defaultHeight = getDefaultHeaderHeight(frame, false, insets.top);

  const { title, hidden, showBack, rightIcon, onBackPress, onRightPress } =
    props;

  const animatedStyle = useAnimatedStyle(() => ({
    height: withTiming(hidden?.value ? 0 : defaultHeight),
    paddingTop: withTiming(hidden?.value ? 0 : insets.top),
  }));

  const hitSlop = { left: 20, right: 20, bottom: 20, top: 20 };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity hitSlop={hitSlop} onPress={onBackPress}>
            <Ionicons
              style={styles.leftIcon}
              name="ios-chevron-back"
              size={30}
            />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>
      </View>

      {rightIcon && (
        <TouchableOpacity hitSlop={hitSlop} onPress={onRightPress}>
          {rightIcon === "check" ? (
            <Ionicons
              style={styles.rightIcon}
              name="ios-checkmark-sharp"
              size={30}
            />
          ) : rightIcon === "plus" ? (
            <AntDesign style={styles.rightIcon} name={rightIcon} size={24} />
          ) : null}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: theme.colors.primary,
    zIndex: 1,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: theme.sizes.bigger,
    fontWeight: "700",
    color: theme.colors.background,
  },
  leftIcon: {
    color: theme.colors.background,
    marginRight: 10,
    marginLeft: -10,
  },
  rightIcon: {
    color: theme.colors.background,
  },
});

export default Header;
