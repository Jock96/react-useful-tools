import { useMemo, useState } from "react";

enum SORT_DIRECTION {
  ASC = "asc",
  DESC = "desc",
}

const defaultComparator =
  (sortKey: string) =>
  <T>(first: T, second: T) =>
    first[<keyof T>sortKey]
      ?.toString()
      .localeCompare(second[<keyof T>sortKey]?.toString() ?? "") ?? 0;

// передаём список и каррированную функцию сравнения по ключу
export const useSort = <T>(list: T[], comparatorByKey = defaultComparator) => {
  const [sortKey, setSortKey] = useState<string>();
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(
    SORT_DIRECTION.ASC
  );

  const onSortChange = (key: string, direction: SORT_DIRECTION) => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const sortedList = useMemo(() => {
    const copy = [...list];
    const prepared = sortKey ? copy.sort(comparatorByKey(sortKey)) : copy;

    return sortDirection === SORT_DIRECTION.ASC ? prepared : prepared.reverse();
  }, [list, sortDirection, sortKey]);

  return { sortedList, onSortChange };
};
