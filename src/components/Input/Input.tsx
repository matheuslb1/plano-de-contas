import { LegacyRef, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  KeyboardTypeOptions,
  StyleProp,
} from "react-native";
import theme from "../../../theme.json";

/**
 * Props for the Input component.
 */
interface InputProps {
  error?: boolean;
  keyboardType: KeyboardTypeOptions;
  onChangeText: (text: string) => void;
  prefix?: string;
  style: Partial<StyleProp<TextInput>>;
  value: string;
  inputRef: LegacyRef<TextInput>;
  autoFocus?: boolean;
  onSubmitEditing: () => void;
}

/**
 * Simple text input with a couple of additional properties. Allows you to
 * set a prefix and a validation error.
 */
function Input(props: InputProps) {
  const [focused, setFocused] = useState(false);
  const { error, prefix } = props;

  return (
    <View
      style={[
        styles.container,
        focused ? styles.focused : null,
        error ? styles.error : null,
      ]}
    >
      <Text style={styles.prefix}>{prefix}</Text>
      <TextInput
        blurOnSubmit
        keyboardType={props.keyboardType}
        onBlur={() => setFocused(false)}
        onChangeText={props.onChangeText}
        onFocus={() => setFocused(true)}
        onSubmitEditing={props.onSubmitEditing}
        ref={props.inputRef}
        returnKeyType="next"
        style={styles.input}
        value={props.value}
        autoFocus={props.autoFocus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: theme.colors.background,
    height: 43,
    borderWidth: 1,
    borderColor: "transparent",
  },
  error: {
    borderColor: theme.colors.danger,
  },
  focused: {
    borderColor: theme.colors.primary,
  },
  input: {
    width: "100%",
    justifyContent: "center",
    flex: 1,
    height: "100%",
    fontSize: theme.sizes.medium,
  },
  prefix: {
    paddingLeft: 20,
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: theme.sizes.medium,
    top: 0.5,
  },
});

export default Input;
