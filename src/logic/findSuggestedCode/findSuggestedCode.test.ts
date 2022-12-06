import { Account } from "../../types";
import { findSuggestedCode } from "./findSuggestedCode";

test("suggests correct code when array is empty", () => {
  const accounts: Account[] = [];
  const output = findSuggestedCode(accounts);
  expect(output).toEqual("1");
});

test("suggests correct code when there is a lower sibling", () => {
  const accounts: Account[] = [{ code: "1", name: "Receitas" }];
  const output = findSuggestedCode(accounts, "");
  expect(output).toEqual("2");
});

test("suggests correct code when there are multiple lower siblings", () => {
  const accounts: Account[] = [
    { code: "1", name: "Receitas" },
    { code: "2", name: "Item 1" },
    { code: "5", name: "Item 2" },
    { code: "10", name: "Item 3" },
  ];
  const output = findSuggestedCode(accounts);
  expect(output).toEqual("11");
});

test("suggests correct code when a parent is informed", () => {
  const accounts: Account[] = [
    { code: "1", name: "Receitas" },
    { code: "1.1", name: "Taxa 1" },
    { code: "2", name: "Despesas" },
  ];
  const output = findSuggestedCode(accounts, "1.1");
  expect(output).toEqual("1");
});

test("suggests correct code when in deep tree", () => {
  const accounts: Account[] = [
    { code: "1", name: "Receitas" },
    { code: "1.1", name: "Taxa 1" },
    { code: "1.1.1", name: "Node 1" },
    { code: "1.1.1.1", name: "Node 2" },
    { code: "1.2", name: "Taxa 2" },
    { code: "1.3", name: "Taxa 3" },
  ];
  const output = findSuggestedCode(accounts, "1.1.1");
  expect(output).toEqual("2");
});

test("always picks highest code + 1", () => {
  const accounts: Account[] = [
    { code: "1", name: "Receitas" },
    { code: "1.1", name: "Taxa 1" },
    { code: "1.1.150", name: "Node 1" },
    { code: "1.1.321", name: "Node 2" },
    { code: "1.1.554", name: "Node 3" },
  ];
  const output = findSuggestedCode(accounts, "1.1");
  expect(output).toEqual("555");
});

test("returns empty code when limit is reached in parent", () => {
  const accounts: Account[] = [
    { code: "9", name: "Receitas" },
    { code: "9.9", name: "Taxa 9" },
    { code: "9.9.999", name: "Node 3" },
  ];
  const output = findSuggestedCode(accounts, "9.9");
  expect(output).toEqual("");
});

test("returns empty code when limit is reached in root", () => {
  const accounts: Account[] = [{ code: "999", name: "Receitas" }];
  const output = findSuggestedCode(accounts);
  expect(output).toEqual("");
});

test("allows parent selection that already has children", () => {
  const accounts: Account[] = [
    { code: "9", name: "Receitas" },
    { code: "9.9", name: "Taxa 9" },
    { code: "9.9.999", name: "Node 3" },
  ];
  const output = findSuggestedCode(accounts, "9");
  expect(output).toEqual("10");
});
