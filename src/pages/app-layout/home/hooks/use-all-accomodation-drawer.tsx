import { proxy, useSnapshot } from 'valtio';

interface AllAccomodationDrawerState {
  open: boolean;
}

const state = proxy<AllAccomodationDrawerState>({
  open: false,
});

export const useAllAccomodationDrawer = () => {
  const snapshot = useSnapshot(state);

  return {
    open: snapshot.open,
    setOpen: (open: boolean) => {
      state.open = open;
    },
  };
};
