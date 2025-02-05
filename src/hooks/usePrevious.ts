import { useRef } from "react";

export const usePrevious = <T>(value: T) => {
  const ref = useRef(value);

  ref.current = value;

  return ref.current;
};
