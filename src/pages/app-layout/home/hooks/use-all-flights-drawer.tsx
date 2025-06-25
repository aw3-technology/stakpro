import { proxy, useSnapshot } from 'valtio';

interface AllFlightsDrawerState {
  open: boolean;
}

const state = proxy<AllFlightsDrawerState>({
  open: false,
});

export const useAllFlightsDrawer = () => {
  const snapshot = useSnapshot(state);

  return {
    open: snapshot.open,
    setOpen: (open: boolean) => {
      state.open = open;
    },
  };
};
