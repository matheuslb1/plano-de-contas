interface Account {
  id?: string;
  code: string;
  name: string;
  type?: "receita" | "despesa";
  entry?: boolean;
}

interface ReduxState {
  value: Account[];
}

interface ReduxPayload {
  payload: any;
}

export { ReduxPayload, ReduxState, Account };
