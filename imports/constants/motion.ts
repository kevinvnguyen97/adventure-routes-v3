import { HTMLMotionProps } from "framer-motion";

export const MOTION_PRESET: HTMLMotionProps<"div"> = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};
