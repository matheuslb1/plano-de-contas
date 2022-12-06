import { Account } from "../../types";
import { findPositionToInsert } from "./findPositionToInsert";

test("suggests correct index when array is empty", () => {
  const accounts: Account[] = [];
  const output = findPositionToInsert(accounts, "1");
  expect(output).toEqual(0);
});

test("suggests correct index when there is a higher code sibling", () => {
  const accounts: Account[] = [{ code: "5", name: "Receitas" }];
  const output = findPositionToInsert(accounts, "1");
  expect(output).toEqual(0);
});

test("suggests correct index when there is a lower code sibling", () => {
  const accounts: Account[] = [{ code: "1", name: "Receitas" }];
  const output = findPositionToInsert(accounts, "2");
  expect(output).toEqual(1);
});

test("suggests correct code when there is a nested lower sibling", () => {
  const accounts: Account[] = [
    { code: "1", name: "Receitas" },
    { code: "1.3", name: "Receitas" },
    { code: "1.3.2", name: "Receitas" },
    { code: "2", name: "Receitas" },
  ];
  const output = findPositionToInsert(accounts, "1.2");
  expect(output).toEqual(1);
});

test("suggests correct code when there is a nested heigher sibling", () => {
  const accounts: Account[] = [
    { code: "1", name: "Receitas" },
    { code: "1.3", name: "Receitas" },
    { code: "1.3.2", name: "Receitas" },
    { code: "2", name: "Receitas" },
  ];
  const output = findPositionToInsert(accounts, "1.4");
  expect(output).toEqual(3);
});
