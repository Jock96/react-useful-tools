import { Base64 } from "js-base64";
import { useEffect, useState, useRef } from "react";

interface UseUrlStatePramsProps<T> {
  initialState: T;
  paramsName: string;
  serialize?: (data: T | undefined) => string | undefined;
  deserialize?: (data: string) => T;
}

const defaultSerialize = <T>(data?: T) =>
  data ? Base64.encode(JSON.stringify(data)) : undefined;

const defaultDeserialize = <T>(data: string): T =>
  JSON.parse(Base64.decode(data));

export function usePureQueryParamsState<T>({
  initialState,
  paramsName,
  serialize = defaultSerialize,
  deserialize = defaultDeserialize,
}: UseUrlStatePramsProps<T>): [T | undefined, (data?: T) => void] {
  const search = new URLSearchParams(window.location.search);

  const existingValue = search.get(paramsName);
  const prevExistingValue = useRef<string | null>(null);

  const [state, setState] = useState<T | undefined>(
    existingValue ? deserialize(existingValue) : initialState
  );

  useEffect(() => {
    if (existingValue !== prevExistingValue.current) {
      setState(existingValue ? deserialize(existingValue) : undefined);
    }

    prevExistingValue.current = existingValue;
  }, [deserialize, existingValue, initialState]);

  const onChange = (value: T | undefined) => {
    const url = new URL(window.location.href);
    const serialized = serialize(value);

    if (serialized) {
      url.searchParams.set(paramsName, serialized);
    } else {
      url.searchParams.delete(paramsName);
    }

    setState(value);

    window.history.replaceState({}, "", url);
  };

  return [state, onChange];
}
