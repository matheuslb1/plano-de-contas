import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ModalPicker from "../ModalPicker/ModalPicker";
import theme from "../../../theme.json";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

/**
 * Single option for the select.
 */
interface Option {
  code: string;
  name: string;
}

/**
 * Props for the Select component.
 */
interface SelectProps {
  disabled?: boolean;
  error?: boolean;
  onSelectOption: (value: string) => void;
  onGetOptionText?: (option: Option) => string;
  onGetOptionColor?: (option: Option) => string;
  options: Array<Option>;
  title: string;
  value: string;
  disabledReason?: string;
}

/**
 * Component that simulates the HTML <select> tag by rendering a dropdown-like
 * field that shows a modal when clicked.
 */
const Select = forwardRef((props: SelectProps, ref) => {
  const [visible, setVisible] = useState(false);
  const hasItem = useSharedValue(false);

  const {
    value,
    title,
    options,
    error,
    disabled,
    onSelectOption,
    onGetOptionColor,
    onGetOptionText,
  } = props;

  const item = options.find((x) => x.code === value);
  const text = item?.name || "";

  useImperativeHandle(ref, () => ({
    focus: () => setVisible(true),
  }));

  const clearAnimatedStyles = useAnimatedStyle(() => ({
    opacity: withTiming(hasItem.value ? 1 : 0, { duration: 200 }),
  }));

  useEffect(() => {
    hasItem.value = !!item;
  }, [item]);

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setVisible(true)}
        disabled={disabled}
      >
        <View
          style={[
            styles.input,
            error ? styles.error : null,
            visible ? styles.focused : null,
            disabled ? styles.disabled : null,
          ]}
        >
          <Text style={[styles.text, disabled ? styles.disabledText : null]}>
            {text}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          {disabled ? (
            <TouchableOpacity
              hitSlop={{ left: 10, top: 10, right: 10, bottom: 10 }}
              onPress={() => alert(props.disabledReason)}
            >
              <FontAwesome name="info-circle" size={20} style={styles.icon} />
            </TouchableOpacity>
          ) : (
            <>
              <Animated.View
                style={[clearAnimatedStyles]}
                pointerEvents={item ? "auto" : "none"}
              >
                <TouchableOpacity
                  style={styles.timesContainer}
                  hitSlop={{ left: 10, top: 10, right: 10, bottom: 10 }}
                  onPress={() => onSelectOption("")}
                >
                  <FontAwesome name="times" size={20} style={styles.icon} />
                </TouchableOpacity>
              </Animated.View>

              <FontAwesome style={styles.icon} name="caret-down" size={24} />
            </>
          )}
        </View>
      </TouchableOpacity>

      <ModalPicker
        visible={visible}
        options={options}
        title={title}
        onClose={() => setVisible(false)}
        onGetOptionText={onGetOptionText}
        onGetOptionColor={onGetOptionColor}
        onSelectOption={(option) => {
          onSelectOption(option.code);
          setVisible(false);
        }}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
  disabled: {
    backgroundColor: theme.colors.disabled,
  },
  disabledText: {
    color: theme.colors.disabledText,
  },
  focused: {
    borderColor: theme.colors.primary,
  },
  text: {
    fontSize: theme.sizes.medium,
  },
  input: {
    borderRadius: 10,
    height: 43,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  error: {
    borderColor: theme.colors.danger,
  },
  icon: {
    color: theme.colors.dropdownIcon,
  },
  iconContainer: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
  },
  timesContainer: {
    marginRight: 15,
    paddingTop: 2,
    borderRightWidth: 1,
    borderRightColor: theme.colors.lightBorder,
    paddingRight: 15,
  },
});

export default Select;
export { Option };
