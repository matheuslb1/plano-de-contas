import { View, StyleSheet } from "react-native";
import theme from "../../theme.json";
import Header from "../components/Header/Header";
import EditForm from "../components/EditForm/EditForm";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewAccount, editAccount } from "../redux/accountSlice";
import { ReduxState } from "../types";

/**
 * Main screen that shows the list of accounts.
 */
function EditScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const [data, setData] = useState<any>(() => route?.params?.account || {});
  const [errors, setErrors] = useState<any>({});

  const isEditing = !!route?.params?.account;

  const accounts = useSelector((state: ReduxState) => state.value);

  /**
   * Validates the form, sets the error state and returns `true` if everything
   * is good or `false` if there is an error.
   */
  const validate = () => {
    let valid = true;
    const err: any = {};
    const fullCode = data.parentCode
      ? `${data.parentCode}.${data.code}`
      : data.code;

    const codeEmpty = !String(data.code || "").trim();
    if (codeEmpty) {
      err.code = "Código é obrigatório";
      valid = false;
    }

    const nameEmpty = !String(data.name || "").trim();
    if (nameEmpty) {
      err.name = "Nome é obrigatório";
      valid = false;
    }

    const typeEmpty = !String(data.type || "").trim();
    if (typeEmpty) {
      err.type = "Tipo é obrigatório";
      valid = false;
    }

    const entryEmpty = data.entry === undefined;
    if (entryEmpty) {
      err.entry = "Campo é obrigatório";
      valid = false;
    }

    const accountWithCode = accounts.find((x) => x.code === fullCode);
    const sameAccountBeingEdited = accountWithCode?.id === data?.id;
    if (accountWithCode && !sameAccountBeingEdited) {
      err.code = "Esse código já está em uso";
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  /**
   * Saves the record in the redux store.
   * This function will edit or insert, depending on the props/params.
   */
  const save = () => {
    const account = {
      ...data,
      code: data.parentCode ? `${data.parentCode}.${data.code}` : data.code,
    };

    if (route?.params?.account) {
      const original = route?.params?.account;
      const originalCode = original.parentCode
        ? `${original.parentCode}.${original.code}`
        : original.code;
      dispatch(editAccount({ code: originalCode, account } as never));
    } else {
      dispatch(addNewAccount(account));
    }
  };

  /**
   * Validates the form and if everything is valid it automatically
   * saves the record.
   */
  const validateAndSave = () => {
    const valid = validate();
    if (valid) {
      save();
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Header
        onBackPress={() => navigation.goBack()}
        onRightPress={validateAndSave}
        rightIcon="check"
        showBack
        title={isEditing ? "Editar Conta" : "Inserir Conta"}
      />

      <EditForm
        data={data}
        errors={errors}
        onChangeData={setData}
        isEditing={isEditing}
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

export default EditScreen;
