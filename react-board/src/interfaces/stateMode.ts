export enum StateMode {
  Zustand = "zustand",
  Context = "context",
  Local = "local",
}

export const STATE_MODES = Object.values(StateMode);

export const isStateMode = (value: string | null): value is StateMode =>
  STATE_MODES.includes(value as StateMode);

export const getStateMode = (): StateMode => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  if (isStateMode(mode)) return mode;

  return StateMode.Zustand;
};
