/* ============================================================
   POSTS PAGE
============================================================ */

import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

import GenericTable from "../components/GenericTable/GenericTable";
import { postColumns } from "../configs/posts.columns";
import { Post } from "../interfaces/posts.interface";

import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { setPage, cachePageData, clearTableCache } from "../redux/tablesSlice";
import { RootState } from "../../../app/store";

/* ============================================================
   API
============================================================ */

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

/* ============================================================
   COMPONENT
============================================================ */

const PostsPage = () => {

  const dispatch = useAppDispatch();

  const { currentPage, cachedPages } = useAppSelector(
    (state: RootState) => state.tables.posts
  );

  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const pageData = cachedPages[currentPage];

  const fetchedRef = useRef(false);

  /* ============================================================
     FETCH DATA
  ============================================================ */

  const fetchPageData = useCallback(async (pageIndex: number) => {

    try {

      const response = await axios.get(BASE_URL, {
        params: {
          _page: pageIndex + 1,
          _limit: pageSize
        }
      });

      const records = response.data;

      const totalRecords = Number(response.headers["x-total-count"]);

      setTotalPages(Math.ceil(totalRecords / pageSize));

      const pageData: Post[] = records.map((item: any) => ({
        id: item.id,
        title: item.title,
        body: item.body
      }));

      dispatch(
        cachePageData({
          table: "posts",
          page: pageIndex,
          data: pageData
        })
      );

    } catch (error) {

      console.error("API Error:", error);

    }

  }, [dispatch, pageSize]);

  /* ============================================================
     INITIAL FETCH
  ============================================================ */

  useEffect(() => {

    if (!fetchedRef.current && !pageData) {

      fetchedRef.current = true;

      fetchPageData(currentPage);

    }

  }, [currentPage, pageData, fetchPageData]);

  /* ============================================================
     NEXT PAGE
  ============================================================ */

  const handleNext = async () => {

    const nextPage = currentPage + 1;

    if (nextPage >= totalPages) return;

    if (!cachedPages[nextPage]) {
      await fetchPageData(nextPage);
    }

    dispatch(setPage({ table: "posts", page: nextPage }));

  };

  /* ============================================================
     PREVIOUS PAGE
  ============================================================ */

  const handlePrevious = async () => {

    const prevPage = currentPage - 1;

    if (prevPage < 0) return;

    if (!cachedPages[prevPage]) {
      await fetchPageData(prevPage);
    }

    dispatch(setPage({ table: "posts", page: prevPage }));

  };

  /* ============================================================
     PAGE CLICK
  ============================================================ */

  const handlePageChange = async (pageIndex: number) => {

    if (!cachedPages[pageIndex]) {
      await fetchPageData(pageIndex);
    }

    dispatch(setPage({ table: "posts", page: pageIndex }));

  };

  /* ============================================================
     PAGE SIZE CHANGE
  ============================================================ */

  const handlePageSizeChange = (size: number) => {

    setPageSize(size);

    fetchedRef.current = false;

    dispatch(clearTableCache("posts"));

  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (

    <GenericTable<Post>
      data={pageData || []}
      columns={postColumns}
      currentPage={currentPage}
      totalPages={totalPages}
      cachedPages={cachedPages}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onPageChange={handlePageChange}
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
      actions={{
        onView: (row) => console.log("View:", row),
        onEdit: (row) => console.log("Edit:", row),
        onDelete: (row) => console.log("Delete:", row)
      }}
    />

  );

};

export default PostsPage;