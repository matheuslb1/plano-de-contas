import { createSlice } from "@reduxjs/toolkit";
import { editAccountLogic } from "../logic/editAccount/editAccount";
import { findPositionToInsert } from "../logic/findPositionToInsert/findPositionToInsert";
import { removeAccount } from "../logic/removeAccount/removeAccount";
import { ReduxState } from "../types";
import { customAlphabet } from "nanoid/non-secure";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    value: [],
  },
  reducers: {
    /**
     * Adds a new account into the redux array.
     */
    addNewAccount: (state: ReduxState, action) => {
      const index = findPositionToInsert(state.value, action.payload.code);
      const id = nanoid();
      state.value.splice(index, 0, { ...action.payload, id });
    },
    /**
     * Deletes an account and all its children from the redux array.
     */
    deleteAccount: (state: ReduxState, action) => {
      state.value = removeAccount(state.value, action.payload.code);
    },
    /**
     * Edits an account.
     */
    editAccount: (state: ReduxState, action) => {
      editAccountLogic(state.value, action.payload);
    },
  },
});

export const { addNewAccount, deleteAccount, editAccount } =
  accountSlice.actions;
