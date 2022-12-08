import { Account } from "../../types";

/**
 * Finds the next available parent recursively that DOESN'T contain a child
 * that has a code 999.
 */
function findAvailableParent(accounts: Account[], parentCode: string) {
  if (!parentCode) {
    return "";
  }

  const split = parentCode.split(".").reverse();

  while (split[0]) {
    const fullCode = [...split].reverse().join(".");
    const hasChild999 = accounts.some((x) => x.code === `${fullCode}.999`);
    if (hasChild999) {
      // remove the entry to check for the next parent
      split.shift();
    } else {
      return fullCode;
    }
  }

  return "";
}

export { findAvailableParent };
