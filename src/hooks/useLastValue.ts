import { useRef } from "react";

export const useLastValue = <T>(value: T) => {
  const ref = useRef(value);

  if (ref.current !== value) ref.current = value;

  return ref.current;
};
