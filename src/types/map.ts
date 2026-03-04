export interface UserMarkerProps {
  readonly position: [number, number];
  // รัศมีความแม่นยำของ GPS ในหน่วยเมตร (จาก pos.coords.accuracy)
  readonly accuracy: number;
}

export interface PinMarkerProps {
  readonly position: [number, number];
  readonly selected?: boolean; // false = default (ขาว/ส้ม), true = selected (ส้ม/ขาว)
  readonly popupContent?: React.ReactNode;
  readonly onClick?: () => void;
}