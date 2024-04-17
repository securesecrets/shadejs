type NodeHealthValidationConfig = {
  minBlockHeight: number,
  maxRetries: number,
  onStaleNodeDetected?: () => void
}

export type {
  NodeHealthValidationConfig,
};
