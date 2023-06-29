import { create } from "zustand";

type StatesProvider = {
  table: DailyWorkersManagementForm[];
  date: string;
  total: number;
  setTable: (table: DailyWorkersManagementForm[]) => void;
};

const appState = create<StatesProvider>((set, get) => ({
  table: [],
  date: "",
  total: 0,
  setTable: (newTable?: DailyWorkersManagementForm[]) => {
    var sum = 0;
    newTable?.map((current) => {
      if (current.service === "Diária") {
        sum += current.quantity * 80;
      } else {
        sum += current.quantity * 15;
      }
    });
    set(() => ({
      table: newTable,
      total: sum,
    }));
  },
}));

export default () => appState((state) => state);
