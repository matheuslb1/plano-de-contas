import { Account } from "../../types";
import { removeAccount } from "./removeAccount";

test("works in empty array", () => {
  const accounts: Account[] = [];
  const output = removeAccount(accounts, "1.1");
  expect(output).toEqual([]);
});

test("works with a single record", () => {
  const accounts: Account[] = [{ code: "1", name: "Salário" }];
  const output = removeAccount(accounts, "1");
  expect(output).toEqual([]);
});

test("works with multiple records", () => {
  const accounts: Account[] = [
    { code: "1", name: "Salário" },
    { code: "1.1", name: "Taxa 1" },
    { code: "1.1.1", name: "Taxa 2" },
    { code: "1.2", name: "Taxa 3" },
  ];
  const output = removeAccount(accounts, "1");
  expect(output).toEqual([]);
});

test("removes only accounts that match the criteria", () => {
  const accounts: Account[] = [
    { code: "1", name: "Salário" },
    { code: "1.1", name: "Taxa 1" },
    { code: "1.1.1", name: "Taxa 2" },
    { code: "1.2", name: "Taxa 3" },
    { code: "2", name: "Taxa 10" },
  ];
  const output = removeAccount(accounts, "1");
  expect(output).toEqual([{ code: "2", name: "Taxa 10" }]);
});

test("removes children without removing the parent", () => {
  const accounts: Account[] = [
    { code: "1", name: "Salário" },
    { code: "1.1", name: "Taxa 1" },
    { code: "1.1.1", name: "Taxa 2" },
  ];
  const output = removeAccount(accounts, "1.1.1");
  expect(output).toEqual([
    { code: "1", name: "Salário" },
    { code: "1.1", name: "Taxa 1" },
  ]);
});
