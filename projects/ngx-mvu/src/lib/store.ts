import { BehaviorSubject, Observable } from 'rxjs';
import { Update } from './update';

export abstract class Store<T> {
  readonly state$: Observable<T>;

  get state(): T {
    return this._state$.getValue();
  }

  private readonly _state$: BehaviorSubject<T>;

  constructor(initialState: T) {
    this._state$ = new BehaviorSubject(initialState);
    this.state$ = this._state$.asObservable();
  }

  protected update(...updates: Update<T>[]): void {
    const updatedState = updates.reduce((x, f) => f(x), this.state);

    if (updatedState === this.state) {
      return;
    }

    this._state$.next(updatedState);
  }
}
