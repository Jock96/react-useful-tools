import { useState, useCallback } from "react";

export enum SelectionMode {
  Include = "Include",
  Exclude = "Exclude",
}

// начальные состояния выборки
interface UseSelectionProps {
  initialMode: SelectionMode;
  initialIds?: string[];
}

interface UseSelectionReturns {
  // включаем/исключаем данные из списка
  mode: SelectionMode;
  setMode(mode: SelectionMode): void;
  // список выбранных/исключенных
  selected: string[];
  // элемент выбран?
  checkId(id: string): boolean;
  // выбрать элемент по id
  setSelectedById(id: string, isSelected: boolean): void;
  // сброс в изначальное состояние
  resetAll(): void;
}

// аналог import { uniq } from "lodash";
const uniq = <T>(list: T[]): T[] => Array.from(new Set(Array.from(list)));

export const useSelection = ({
  initialMode,
  initialIds,
}: UseSelectionProps): UseSelectionReturns => {
  const [mode, setMode] = useState<SelectionMode>(initialMode);
  const [selected, setSelected] = useState<string[]>(
    initialIds ? uniq(initialIds) : []
  );

  const resetAll = useCallback(() => {
    setSelected(uniq(initialIds ?? []));
    setMode(initialMode);
  }, [initialMode, initialIds]);

  const handleSetMode = useCallback((currentMode: SelectionMode) => {
    if (currentMode in SelectionMode) {
      setSelected([]);
      setMode(currentMode);
      return;
    }

    throw new Error("Unknown selected mode");
  }, []);

  const checkId = useCallback(
    (id: string): boolean => {
      const isSelectedInclude = selected.includes(id);

      if (mode === SelectionMode.Include) {
        return isSelectedInclude;
      }

      if (mode === SelectionMode.Exclude) {
        return !isSelectedInclude;
      }

      throw new Error("Unknown selected mode");
    },
    [selected, mode]
  );

  const setSelectedById = useCallback(
    (id: string, isSelected: boolean) => {
      setSelected((prevSelected) => {
        if (mode === SelectionMode.Include) {
          return isSelected
            ? uniq([...prevSelected, id])
            : prevSelected.filter((selectedId) => selectedId != id);
        }

        if (mode === SelectionMode.Exclude) {
          return isSelected
            ? prevSelected.filter((selectedId) => selectedId != id)
            : uniq([...prevSelected, id]);
        }

        throw new Error("Unknown selected mode");
      });
    },
    [mode]
  );

  return {
    mode,
    setMode: handleSetMode,
    selected,
    checkId,
    setSelectedById,
    resetAll,
  };
};
