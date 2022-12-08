import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import theme from "../../../theme.json";
import { findAvailableParent } from "../../logic/findAvailableParent/findAvailableParent";
import { findSuggestedCode } from "../../logic/findSuggestedCode/findSuggestedCode";
import { Account, ReduxState } from "../../types";
import Input from "../Input/Input";
import MaxCodeMessage from "../MaxCodeMessage/MaxCodeMessage";
import Select, { Option } from "../Select/Select";

/**
 * Props for the EditForm component.
 */
interface EditFormProps {
  data: any;
  errors: any;
  onChangeData: (data: any) => void;
  isEditing?: boolean;
}

/**
 * Main component of the edit page. It displays all fields to add/edit
 * an account, with validation.
 */
function EditForm(props: EditFormProps) {
  const { data, onChangeData, errors, isEditing } = props;
  const initialParent = useRef<string>(data.parentCode);
  const codeRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);
  const typeRef = useRef<TextInput>(null);
  const entryRef = useRef<TextInput>(null);

  const accounts = useSelector((state: ReduxState) => state.value);
  const fullCode = data.parentCode
    ? `${data.parentCode}.${data.code || ""}`
    : data.code;

  /**
   * Suggested parent in case the current parent already has a child
   * with code 999.
   */
  const [suggestedParent, setSuggestedParent] = useState("");

  /**
   * Contains all VALID parents for this account.
   */
  const [parentAccounts] = useState(() => {
    return accounts.filter((x) => {
      const sameID = x.id === data.id;
      const entry = x.entry;
      const isChildOf = x.code.startsWith(`${fullCode}.`);
      return !sameID && !entry && !isChildOf;
    });
  });

  /**
   * Indicates if this accounth as children or not.
   * We use this to disable the entry (lançamento) to maintain consistency.
   */
  const [hasChildren] = useState(() => {
    return isEditing && accounts.some((x) => x.code.startsWith(`${fullCode}.`));
  });

  const typeDisabled = !!data.parentCode;
  const entryDisabled = hasChildren;

  /**
   * Called when fields of the form change. We use this to make some adjustments
   * to the fields and update the state to re-render.
   */
  const onChange = (key: string, value: string) => {
    if (key === "code") {
      const sanitized = value.replace(/[^0-9]/g, "");
      const trimmed = sanitized ? Math.min(Number(sanitized), 999) : "";
      onChangeData({ ...data, [key]: String(trimmed) });
    } else if (key === "parentCode") {
      const parent = accounts.find((x) => x.code === value) as Account;
      const code = findSuggestedCode(accounts, value);

      const availableParent = findAvailableParent(accounts, value);

      if (
        availableParent &&
        availableParent !== value &&
        value !== initialParent.current
      ) {
        setSuggestedParent(availableParent);
      } else {
        setSuggestedParent("");
      }

      setImmediate(() => codeRef.current?.focus());
      onChangeData({ ...data, [key]: value, type: parent?.type, code });
    } else {
      if (key === "parentCode") {
        setImmediate(() => codeRef.current?.focus());
      }
      onChangeData({ ...data, [key]: value });
    }
  };

  /**
   * Renders the <input> component with a label.
   */
  const renderInput = (label: string, key: string, options?: any) => {
    return (
      <View style={styles.group}>
        <Text style={styles.label}>{label}</Text>

        <Input
          value={data[key]}
          style={styles.input}
          onChangeText={(value) => onChange(key, value)}
          prefix={options?.prefix}
          keyboardType={options?.keyboardType}
          error={!!errors[key]}
          inputRef={options?.ref}
          onSubmitEditing={options?.onSubmitEditing}
          autoFocus={options?.autoFocus}
        />

        {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
      </View>
    );
  };

  /**
   * Renders the <select> component with a label.
   */
  const renderSelect = (label: string, key: string, options?: any) => {
    return (
      <View style={styles.group}>
        <Text style={styles.label}>{label}</Text>

        <Select
          disabled={options.options.length === 0 || options?.disabled}
          disabledReason={
            options?.disabledReason ||
            "Não há registros disponiveis para seleção"
          }
          error={errors?.[key]}
          onGetOptionColor={options?.onGetOptionColor}
          onGetOptionText={options?.onGetOptionText}
          onSelectOption={(value) => onChange(key, value)}
          options={options.options}
          ref={options?.ref}
          title={label}
          value={data[key]}
        />

        {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior="padding"
      enabled={Platform.OS === "ios"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderSelect("Conta pai", "parentCode", {
          options: parentAccounts,
          disabledReason:
            "Nenhuma conta que não aceita lançamento foi encontrada",
          onGetOptionText: (opt: Option) => `${opt.code} - ${opt.name}`,
          onGetOptionColor: (opt: Account) =>
            `${
              opt.type === "receita"
                ? theme.colors.income
                : theme.colors.expense
            }`,
        })}

        <MaxCodeMessage
          suggestedParent={suggestedParent}
          onChangeParent={(e) => onChange("parentCode", e)}
        />

        {renderInput("Código", "code", {
          autoFocus: true,
          keyboardType: "numeric",
          onSubmitEditing: () => nameRef.current?.focus(),
          prefix: data.parentCode ? `${data.parentCode}.` : "",
          ref: codeRef,
        })}

        {renderInput("Nome", "name", {
          ref: nameRef,
          onSubmitEditing: () => !typeDisabled && typeRef.current?.focus(),
        })}

        {renderSelect("Tipo", "type", {
          ref: typeRef,
          disabled: typeDisabled,
          disabledReason:
            "Você não pode alterar esse campo pois o tipo deve ser igual ao da conta pai.",
          options: [
            { code: "receita", name: "Receita" },
            { code: "despesa", name: "Despesa" },
          ],
        })}

        {renderSelect("Aceita lançamentos", "entry", {
          ref: entryRef,
          disabled: entryDisabled,
          disabledReason:
            "Você não pode alterar esse campo pois essa conta possui filhos.",
          options: [
            { code: true, name: "Sim" },
            { code: false, name: "Não" },
          ],
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: {
    marginTop: 20,
    backgroundColor: theme.colors.secondary,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  input: {
    borderRadius: 10,
    height: 43,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  group: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "500",
    fontSize: theme.sizes.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  error: {
    fontWeight: "bold",
    color: theme.colors.danger,
    marginTop: 5,
    fontSize: theme.sizes.small,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
  },
});

export default EditForm;
