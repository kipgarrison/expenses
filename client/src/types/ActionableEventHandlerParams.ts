export type ActionableEventHandlerParams<T> = {
  onAction: (item: T) => void,
  item: T
}