// allows specified optional keys on the base type
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;