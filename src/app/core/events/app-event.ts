export interface AppEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}
