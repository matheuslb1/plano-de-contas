import { View, StyleSheet } from "react-native";
import theme from "../../theme.json";
import { useSharedValue } from "react-native-reanimated";
import Header from "../components/Header/Header";
import Search from "../components/Search/Search";
import AccountList from "../components/AccountList/AccountList";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { Account, ReduxState } from "../types";
import { useEffect, useRef, useState } from "react";

/**
 * Main screen that shows the list of accounts.
 */
function HomeScreen() {
  const navigation = useNavigation();
  const searchFocused = useSharedValue(false); // animated variable
  const scrollY = useSharedValue(0); // animated variable
  const [search, setSearch] = useState("");

  const storeAccounts = useSelector((state: ReduxState) => state.value);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[] | null>();

  const timeout = useRef<any>(null);

  /**
   * Navigates to the edit screen and clears the search in the background.
   */
  const navigateToEditScreen = () => {
    setTimeout(() => setSearch(""), 500);
    navigation.navigate("Edit" as never);
  };

  /**
   * Applies the search state and puts the results into a
   */
  const applySearch = () => {
    if (!search) {
      setFilteredAccounts(null);
      return;
    }
    const filtered = storeAccounts.filter(
      (x) => x.code.includes(search) || x.name.toLowerCase().includes(search)
    );
    setFilteredAccounts(filtered);
  };

  /**
   * Effect used to improve performance by batching text changes and only
   * invoking the prop when the changes settle.
   */
  useEffect(() => {
    timeout.current = setTimeout(() => applySearch(), 500);
    return () => clearTimeout(timeout.current);
  }, [search]);

  return (
    <View style={styles.container}>
      <Header
        onRightPress={navigateToEditScreen}
        hidden={searchFocused}
        rightIcon="plus"
        title="Plano de contas"
      />

      <Search
        onBlur={() => (searchFocused.value = false)}
        onFocus={() => (searchFocused.value = true)}
        scrollY={scrollY}
        searchFocused={searchFocused}
        value={search}
        onChangeText={setSearch}
      />

      <AccountList
        scrollY={scrollY}
        searchFocused={searchFocused}
        accounts={filteredAccounts || storeAccounts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    flex: 1,
  },
});

export default HomeScreen;
