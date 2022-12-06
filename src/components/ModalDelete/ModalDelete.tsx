import { View, StyleSheet, Modal, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import theme from "../../../theme.json";

/**
 * Props for the ModalDelete component.
 */
interface ModalDeleteProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Modal to delete an account from the account list.
 */
function ModalDelete(props: ModalDeleteProps) {
  const { visible, onConfirm, onClose } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.background}>
        <View style={styles.content}>
          <Feather name="trash" size={48} color={theme.colors.danger} />

          <View style={styles.message}>
            <Text style={styles.textNormal}>Deseja excluir a conta</Text>
            <Text style={styles.textNormal}>
              <Text style={styles.textBold}>1.1 - Taxa condominial</Text>
              <Text>?</Text>
            </Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose}>
              <View style={styles.button}>
                <Text style={styles.buttonCancelText}>Não!</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm}>
              <View style={[styles.button, styles.buttonPrimary]}>
                <Text style={styles.buttonConfirmText}>Com certeza</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 50,
  },
  content: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    padding: 30,
  },
  message: {
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  textNormal: {
    color: theme.colors.text,
    fontSize: theme.sizes.medium,
    lineHeight: 25,
  },
  textBold: {
    fontWeight: "700",
  },
  buttons: {
    flexDirection: "row",
  },
  button: {
    borderRadius: 100,
    paddingVertical: 11,
    paddingHorizontal: 24,
  },
  buttonCancelText: {
    fontSize: theme.sizes.medium,
    color: theme.colors.danger,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.danger,
  },
  buttonConfirmText: {
    fontSize: theme.sizes.medium,
    color: theme.colors.background,
  },
});

export default ModalDelete;
