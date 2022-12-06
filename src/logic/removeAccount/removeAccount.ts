import { Account } from "../../types";

/**
 * Removes an account from the list of accounts.
 */
function removeAccount(accounts: Account[], code: string) {
  const newArray = accounts.filter((x) => {
    const matchCode = x.code === code;
    const isChildOf = x.code.startsWith(code + ".");
    return !matchCode && !isChildOf;
  });
  return newArray;
}

export { removeAccount };
