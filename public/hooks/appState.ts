import { create } from "zustand";

type StatesProvider = {
  table: DailyWorkersManagementForm[];
  date: string;
  total: number;
  setTable: (table: DailyWorkersManagementForm[]) => void;
  deleteInput: (index: number) => void;
};

const appState = create<StatesProvider>((set, get) => ({
  table: [],
  date: "",
  total: 0,
  setTable: (newTable?) => {
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
  deleteInput: (index) => {
    var newArray = get().table;
    newArray.splice(index, 1);
    get().setTable(newArray);
  },
}));

export default () => appState((state) => state);
