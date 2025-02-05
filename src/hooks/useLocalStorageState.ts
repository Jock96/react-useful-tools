import { type Dispatch, type SetStateAction, useState } from "react";

const isCallableSetStateAction = <T>(
  setStateAction: SetStateAction<T>
): setStateAction is (prevState: T) => T =>
  typeof setStateAction === "function";

export interface LocalStorageStateProps<T = {}> {
  // ключ для получения состояние из local storage
  key: string;
  // начальное состояние
  initState?: T;
  // отключаем кэширование
  disableLocalStorage?: boolean;
  // реакция на восстановление значение из local storage
  onRestoreItem?: () => void;
}

export const useLocalStorageState = <T>({
  key,
  initState,
  disableLocalStorage,
  onRestoreItem,
}: LocalStorageStateProps<T>): [T, Dispatch<SetStateAction<T>>] => {
  const getStoredItem = () => {
    if (disableLocalStorage) {
      return initState as T;
    }

    const item = window.localStorage.getItem(key);

    if (item) {
      if (onRestoreItem) {
        onRestoreItem();
      }

      return JSON.parse(item) as T;
    } else if (initState) {
      window.localStorage.setItem(key, JSON.stringify(initState));

      return initState;
    }

    // опционально предупреждение, можно удалить, чтобы не спамить логами
    console.warn(
      `Can not find stored item with key: ${key}. Possible problems:\n- Cache cleaned by user;\n- Invalid JSON parse process;\n- Local storage was overflowed;\n - Empty 'key' props was recieved.\nSetted 'undefined' to state as fallback value (\cause init state does not provided).`
    );
    return undefined as unknown as T;
  };

  const setItemToStore = (value: T) => {
    if (value) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(key);
    }
  };

  const [state, setState] = useState<T>(getStoredItem);

  const handleSetState: Dispatch<SetStateAction<T>> = (setStateAction) => {
    if (disableLocalStorage) {
      setState(setStateAction);
      return;
    }

    if (isCallableSetStateAction(setStateAction)) {
      const proxySetStateAction = new Proxy(setStateAction, {
        apply(targetSetStateAction, _this, argumentsList) {
          const [prevState] = argumentsList;

          const newState = setStateAction(prevState);
          setItemToStore(newState);

          return targetSetStateAction(prevState);
        },
      });
      setState(proxySetStateAction);
    } else {
      setItemToStore(setStateAction);
      setState(setStateAction);
    }
  };

  return [state, handleSetState];
};
