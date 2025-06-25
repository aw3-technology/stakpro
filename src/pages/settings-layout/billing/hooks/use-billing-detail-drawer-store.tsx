import { proxy, useSnapshot } from 'valtio';

interface BillingDetailsDrawerState {
  open: boolean;
}

const state = proxy<BillingDetailsDrawerState>({
  open: false,
});

export const useBillingDetailsDrawer = () => {
  const snapshot = useSnapshot(state);

  return {
    open: snapshot.open,
    setOpen: (open: boolean) => {
      state.open = open;
    },
  };
};
