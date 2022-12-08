import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import theme from "../../../theme.json";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import AccountListItem from "../AccountListItem/AccountListItem";
import { useDispatch } from "react-redux";
import ModalDelete from "../ModalDelete/ModalDelete";
import { useCallback, useState } from "react";
import { deleteAccount } from "../../redux/accountSlice";
import { useNavigation } from "@react-navigation/native";
import { Account } from "../../types";
import EmptyMessage from "../EmptyMessage/EmptyMessage";

/**
 * Props for the AccountList component.
 */
interface AccountListProps {
  scrollY: SharedValue<number>;
  searchFocused: SharedValue<boolean>;
  accounts: Account[];
}

/**
 * Component that shows a list of all accounts currently in the store.
 */
function AccountList(props: AccountListProps) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [accountToBeDeleted, setAccountToBeDeleted] =
    useState<Account | null>();

  const { searchFocused, scrollY, accounts } = props;

  /**
   * Handles the scroll of the scrollview to set the shared value and perform
   * the scroll animation.
   */
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  /**
   * Animation of the gray background to engulf everything and make the
   * search transition seamless.
   */
  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(searchFocused.value ? 1 : 0),
  }));

  /**
   * Called when the user clicks on an item. This function will make some
   * adjustments and navigate to the edit screen.
   */
  const onEditItem = useCallback((account: Account) => {
    const split = account.code.split(".");
    const code = split.splice(-1, 1)[0]; // erase last

    const parentCode = split.join(".");
    navigation.navigate(
      "Edit" as never,
      { account: { ...account, code, parentCode } } as never
    );
  }, []);

  /**
   * Renders a single account item in this component.
   */
  const renderAccountItem = (item: Account) => {
    return (
      <AccountListItem
        account={item}
        key={item.code}
        onDelete={() => setAccountToBeDeleted(item)}
        onEdit={onEditItem}
        searchFocused={searchFocused}
      />
    );
  };

  /**
   * Confirms the deletion of an item and dispatches an action to remove it
   * from the redux store.
   */
  const confirmDeletion = () => {
    dispatch(deleteAccount(accountToBeDeleted as never));
    setAccountToBeDeleted(null);
    alert("As contas filhas também foram deletadas.");
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "android" ? undefined : "padding"}
        enabled
      >
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={[styles.container]}
          keyboardShouldPersistTaps="always"
        >
          {accounts.length === 0 ? (
            <EmptyMessage />
          ) : (
            <Animated.View style={styles.list}>
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderTitle}>Listagem</Text>
                <Text style={styles.listHeaderSubtitle}>
                  {accounts.length} registros
                </Text>
              </View>
              {accounts.map(renderAccountItem)}
            </Animated.View>
          )}
        </Animated.ScrollView>
      </KeyboardAvoidingView>

      <Animated.View style={[styles.background, backgroundAnimatedStyle]} />

      <ModalDelete
        onClose={() => setAccountToBeDeleted(null)}
        onConfirm={confirmDeletion}
        visible={!!accountToBeDeleted}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "visible",
  },
  kav: {
    backgroundColor: theme.colors.secondary,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  list: {
    backgroundColor: theme.colors.secondary,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    padding: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  listHeaderTitle: {
    fontSize: theme.sizes.big,
    fontWeight: "400",
    color: theme.colors.listTitle,
  },
  listHeaderSubtitle: {
    fontSize: theme.sizes.medium,
    fontWeight: "400",
    lineHeight: 18,
    color: theme.colors.listSubtitle,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.secondary,
    zIndex: -1,
    bottom: -100,
  },
});

export default AccountList;
