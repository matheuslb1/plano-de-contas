import { StyleSheet, Text, View } from "react-native";
import theme from "../../../theme.json";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * Big empty message that shows an icon of a waller to show
 * the user that there aren't any accounts added so far.
 */
function EmptyMessage() {
  return (
    <View style={styles.container}>
      <MaterialIcons
        style={styles.icon}
        name="account-balance-wallet"
        size={100}
      />

      <Text style={styles.text}>Nenhuma conta encontrada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.secondary,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    padding: 20,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    color: "rgba(0, 0, 0, 0.2)",
  },
  text: {
    fontSize: theme.sizes.big,
    color: "rgba(0, 0, 0, 0.2)",
    fontWeight: "600",
  },
});

export default EmptyMessage;
