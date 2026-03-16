/* ============================================================
   TABLES REDUX SLICE
   - Stores pagination state for all tables
   - Maintains current page per table
   - Caches page data to avoid refetching
============================================================ */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TableState, TablesState } from "./tables.types";

/* ============================================================
   HELPER: CREATE INITIAL TABLE STATE
============================================================ */

const createInitialTableState = (): TableState<any> => ({
  currentPage: 0,
  cachedPages: {},
});

/* ============================================================
   ROOT INITIAL STATE
============================================================ */

const initialState: TablesState = {
  albums: createInitialTableState(),
  users: createInitialTableState(),
  posts: createInitialTableState(),
  comments: createInitialTableState(),
};

/* ============================================================
   SLICE
============================================================ */

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {

    /* ============================================================
       SET CURRENT PAGE
    ============================================================ */

    setPage: (
      state,
      action: PayloadAction<{ table: keyof TablesState; page: number }>
    ) => {
      const { table, page } = action.payload;
      state[table].currentPage = page;
    },

    /* ============================================================
       CACHE PAGE DATA
    ============================================================ */

    cachePageData: (
      state,
      action: PayloadAction<{
        table: keyof TablesState;
        page: number;
        data: any[];
      }>
    ) => {
      const { table, page, data } = action.payload;
      state[table].cachedPages[page] = data;
    },

    /* ============================================================
       CLEAR CACHE (WHEN PAGE SIZE CHANGES)
    ============================================================ */

    clearTableCache: (
      state,
      action: PayloadAction<keyof TablesState>
    ) => {

      const table = action.payload;

      state[table].cachedPages = {};
      state[table].currentPage = 0;

    },

  },
});

export const {
  setPage,
  cachePageData,
  clearTableCache
} = tablesSlice.actions;

export default tablesSlice.reducer;