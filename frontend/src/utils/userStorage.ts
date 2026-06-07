export const userStorageKey = (baseKey: string, userId?: string) =>
  userId ? `${baseKey}:${userId}` : `${baseKey}:anonymous`
