import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { Option } from "../Select/Select";
import { FontAwesome } from "@expo/vector-icons";
import theme from "../../../theme.json";

/**
 * Props for the ModalPicker component.
 */
interface ModalPickerProps {
  onClose: () => void;
  onGetOptionText?: (option: Option) => string;
  onGetOptionColor?: (option: Option) => string;
  onSelectOption: (item: Option) => void;
  options: Option[];
  title: string;
  visible: boolean;
}

/**
 * Modal that shows a list of all options passed as parameter.
 */
function ModalPicker(props: ModalPickerProps) {
  const { visible, title, onClose, onGetOptionText, onGetOptionColor } = props;

  /**
   * Renders a single option in the list.
   */
  const renderOption = (option: Option) => {
    const text = onGetOptionText?.(option) || option.name;
    const color = onGetOptionColor?.(option);
    return (
      <TouchableOpacity
        key={option.code}
        onPress={() => props.onSelectOption(option)}
        style={styles.option}
      >
        <Text style={[styles.optionText, { color }]}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.background}>
        <View style={styles.content}>
          <View style={styles.titleBar}>
            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity onPress={onClose}>
              <FontAwesome
                name="times-circle"
                size={24}
                style={styles.titleIcon}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {props.options.map(renderOption)}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: theme.colors.modalBackground,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  content: {
    maxHeight: 500,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: theme.colors.secondary,
  },
  titleBar: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleIcon: {
    color: theme.colors.background,
  },
  title: {
    fontSize: theme.sizes.big,
    fontWeight: "bold",
    color: theme.colors.background,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBorder,
  },
  optionText: {
    fontSize: theme.sizes.medium,
  },
  scrollView: {
    width: "100%",
  },
});

export default ModalPicker;
