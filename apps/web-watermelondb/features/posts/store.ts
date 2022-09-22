import create, { State, StoreApi, UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<State>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

type PostFocusStoreState = {
  postIds: string[];
  setPostIds: (postIds: string[]) => void;
  focusIndex: number | null;
  setFocusIndex: (focusIndex: number | null) => void;
  incrementFocusIndex: () => void;
  decrementFocusIndex: () => void;
};

const usePostStoreBase = create<PostFocusStoreState>()(
  persist((set, get) => ({
    focusIndex: null,
    setFocusIndex: (focusIndex) => set(() => ({ focusIndex })),
    postIds: [],
    setPostIds: (postIds) => set({ postIds }),
    incrementFocusIndex: () => {
      const { focusIndex, setFocusIndex, postIds } = get();
      const isPostWithinRange = focusIndex < postIds.length - 1;
      if (focusIndex == null) {
        setFocusIndex(0);
      } else if (isPostWithinRange) {
        setFocusIndex(focusIndex + 1);
      }
    },
    decrementFocusIndex: () => {
      const { focusIndex, setFocusIndex, postIds } = get();
      const isPostWithinRange =
        focusIndex > 0 && focusIndex <= postIds.length - 1;
      if (focusIndex == null) {
        setFocusIndex(0);
      } else if (isPostWithinRange) {
        setFocusIndex(focusIndex - 1);
      }
    },
  }))
);

export const usePostStore = createSelectors(usePostStoreBase);
