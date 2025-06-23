export class ActionWithPayload {
  private _action: string;
  private _payload: unknown;

  constructor(action: string, payload?: unknown) {
    this._action = action;
    this._payload = payload;
  }

  get type(): string {
    return this._action;
  }

  get payload(): unknown {
    return this._payload;
  }
}