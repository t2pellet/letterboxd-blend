import type { MaybeRef } from 'vue';

export function deboxMaybeRef<T>(maybeRef: MaybeRef<T>) {
  if (maybeRef != null && typeof maybeRef === 'object' && 'value' in maybeRef) {
    return maybeRef.value;
  }
  return maybeRef;
}
