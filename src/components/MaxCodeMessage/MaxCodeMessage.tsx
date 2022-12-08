import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../../theme.json";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

/**
 * Props for the MaxCodeMessage component.
 */
interface MaxCodeMessageProps {
  onChangeParent: (code: string) => void;
  suggestedParent: string;
}

/**
 * Shows a message that says the parent already has a child with code 999.
 */
function MaxCodeMessage(props: MaxCodeMessageProps) {
  const { suggestedParent, onChangeParent } = props;

  /**
   * We use this value to avoid flickering when the suggested parent is empty.
   */
  const savedSuggestedParent = useRef("");

  const visibleAnimated = useSharedValue(false);
  const idealHeight = useSharedValue(0);

  /**
   * Animated values for the outer container.
   */
  const outerAnimatedStyles = useAnimatedStyle(() => ({
    height: withTiming(visibleAnimated.value ? idealHeight.value : 0),
    opacity: withTiming(visibleAnimated.value ? 1 : 0, { duration: 200 }),
  }));

  /**
   * "Transfers" the prop value to the animated hook.
   */
  useEffect(() => {
    visibleAnimated.value = !!suggestedParent;
    if (suggestedParent) {
      savedSuggestedParent.current = suggestedParent;
    }
  }, [suggestedParent]);

  return (
    <Animated.View style={[styles.container, outerAnimatedStyles]}>
      <View
        style={[styles.inner]}
        onLayout={(e) => (idealHeight.value = e.nativeEvent.layout.height)}
      >
        <Text style={styles.text}>
          <Text>Essa conta já possui um filho com código 999. </Text>
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onChangeParent(suggestedParent)}
        >
          <FontAwesome name="refresh" size={16} color="black" />
          <Text style={styles.buttonText}>
            Utilizar conta {suggestedParent || savedSuggestedParent.current}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -10,
    backgroundColor: theme.colors.disabled,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
    zIndex: -1,
    height: 0,
    overflow: "hidden",
    position: "relative",
  },
  inner: {
    position: "absolute",
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: "row",
  },
  button: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
    flexDirection: "row",
  },
  text: {
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonText: {
    marginLeft: 5,
  },
});

export default MaxCodeMessage;
