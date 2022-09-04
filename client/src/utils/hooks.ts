// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { useLocation } from "react-router";

/**
 * Allows us to get url query parameters. best used with `queryURLBuilder`
 *
 * @example {
 *  const query = useQuery();
 *  const success = query.get("success");
 * }
 */
export const useQuery = () => new URLSearchParams(useLocation().search);
