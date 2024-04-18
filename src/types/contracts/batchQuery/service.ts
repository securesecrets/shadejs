type MinBlockHeightValidationOptions = {
  minBlockHeight: number,
  maxRetries: number,
  onStaleNodeDetected?: () => void
}

export type {
  MinBlockHeightValidationOptions,
};
