import { ReactNode } from "react";

export interface MapProps {
  children?: ReactNode;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export interface UserMarkerProps {
  readonly position: [number, number];
  // รัศมีความแม่นยำของ GPS ในหน่วยเมตร (จาก pos.coords.accuracy)
  readonly accuracy: number;
}
