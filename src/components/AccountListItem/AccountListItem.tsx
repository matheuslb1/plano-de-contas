import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Account } from "../../types";
import theme from "../../../theme.json";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

/**
 * Props for the AccountListItem component.
 */
interface AccountListItemProps {
  account: Account;
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  searchFocused: SharedValue<boolean>;
}

/**
 * A single item in the list of the Account list.
 */
function AccountListItem(props: AccountListItemProps) {
  const { account, onEdit, onDelete, searchFocused } = props;
  const color =
    account.type === "receita" ? theme.colors.income : theme.colors.expense;

  const onEditItem = () => {
    onEdit(account);
  };

  const onDeleteItem = () => {
    onDelete(account);
  };

  const trashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(searchFocused.value ? 0 : 1, { duration: 200 }),
    right: withTiming(searchFocused.value ? -24 : 0),
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editContainer} onPress={onEditItem}>
        <Text style={[styles.text, { color }]}>
          {account.code} - {account.name}
        </Text>
      </TouchableOpacity>

      <Animated.View style={trashAnimatedStyle}>
        <TouchableOpacity style={styles.deleteContainer} onPress={onDeleteItem}>
          <Feather name="trash" size={20} color={theme.colors.placeholder} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    height: 56,
    flexDirection: "row",
    marginBottom: 12,
    overflow: "hidden",
  },
  editContainer: {
    paddingLeft: 20,
    height: "100%",
    justifyContent: "center",
    flex: 1,
  },
  deleteContainer: {
    paddingHorizontal: 20,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: theme.sizes.medium,
  },
});

export default AccountListItem;
