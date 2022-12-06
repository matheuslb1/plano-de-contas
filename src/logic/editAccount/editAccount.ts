import { Account } from "../../types";
import { findPositionToInsert } from "../findPositionToInsert/findPositionToInsert";

/**
 * Edits an account, then repositions the account and makes sure that all
 * children of the account are at the right position and have the right code.
 */
function editAccountLogic(accounts: Account[], data: any) {
  const index = accounts.findIndex((x) => x.code === data.code);
  accounts.splice(index, 1);

  const newPosition = findPositionToInsert(accounts, data.account.code);
  accounts.splice(newPosition, 0, data.account);

  const kids = accounts.filter((x) => x.code.startsWith(`${data.code}.`));
  for (const child of kids) {
    child.code = child.code.replace(`${data.code}.`, `${data.account.code}.`);
    child.type = data.account.type;

    const i = accounts.indexOf(child);
    accounts.splice(i, 1);

    const p = findPositionToInsert(accounts, child.code);
    accounts.splice(p, 0, child);
  }
}

export { editAccountLogic };
