import { Account } from "../../types";

/**
 * Finds the ideal position to insert a new account.
 */
function findPositionToInsert(accounts: Account[], code: string) {
  const split = code.split(".");
  split.pop();

  const parentCode = split.join(".");

  const parentDepth = getAccountDepth(parentCode);
  const children = accounts.filter((x) => {
    const parentMatch = parentCode ? x.code.startsWith(parentCode + ".") : true;
    return parentMatch;
  });

  let base = accounts.find((x) => x.code === parentCode);

  for (const child of children) {
    const childCode = Number(child.code.split(".")[parentDepth]);
    const ourCode = extract(code);
    if (ourCode > childCode) {
      base = child;
    }
  }

  const index = base ? accounts.indexOf(base) + 1 : 0;
  return index;
}

/**
 * Gets the "depth" of an account based on how many DOTS the code has, which in
 * turn indicate the level of the tree that the code is in.
 * - 1.1.1 = 3
 * - 1.2 = 2
 * - 9 = 1
 */
function getAccountDepth(code: string) {
  return code ? code.split(".").length : 0;
}

/**
 * Extracts the last piece of an account's code.
 */
function extract(code: string) {
  const split = code.split(".");
  const level = split[split.length - 1];
  return Number(level);
}

export { findPositionToInsert };
