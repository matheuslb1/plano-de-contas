import { Account } from "../../types";

/**
 * Finds the next suggested code based on a parent. If the parent is falsy then
 * the root will be considered the parent and the root accounts will be
 * considered the siblings.
 */
function findSuggestedCode(accounts: Account[], parentCode = "") {
  const parentDepth = getAccountDepth(parentCode);

  const children = accounts.filter((x) => {
    const parentMatch = parentCode ? x.code.startsWith(parentCode + ".") : true;
    const childDepth = getAccountDepth(x.code);
    return parentMatch && childDepth === parentDepth + 1;
  });

  const lastCode = children[children.length - 1]?.code;
  if (lastCode) {
    const split = lastCode.split(".");
    const last = split[split.length - 1];
    const code = Number(last) + 1;
    return code >= 1000 ? "" : String(code);
  }

  return "1";
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

export { findSuggestedCode };
