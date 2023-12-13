import { Store } from './store';
import { Update } from './update';

describe('Store', () => {
  it('should initialize properly', () => {
    interface TestState {
      value: number;
    }

    const INITIAL_STATE: TestState = {
      value: 0
    };

    class TestStore extends Store<TestState> {
      constructor() {
        super(INITIAL_STATE);
      }
    }

    const store = new TestStore();

    expect(store.state.value).toEqual(0);
  });

  it('allows for using anonymous update functions', () => {
    interface TestState {
      value: number;
    }

    const INITIAL_STATE: TestState = {
      value: 0
    };

    class TestStore extends Store<TestState> {
      constructor() {
        super(INITIAL_STATE);
      }

      increment(): void {
        this.update(({ value }) => ({ value: value + 1 }));
      }
    }

    const store = new TestStore();
    store.increment();

    expect(store.state.value).toEqual(1);
  });

  it('allows for using named update functions', () => {
    interface TestState {
      value: number;
    }

    const INITIAL_STATE: TestState = {
      value: 0
    };

    const increment = (): Update<TestState> => ({ value }) => ({ value: value + 1 });

    class TestStore extends Store<TestState> {
      constructor() {
        super(INITIAL_STATE);
      }

      increment(): void {
        this.update(increment());
      }
    }

    const store = new TestStore();
    store.increment();

    expect(store.state.value).toEqual(1);
  });

  it('allows for chaining update functions', () => {
    interface TestState {
      value: number;
    }

    const INITIAL_STATE: TestState = {
      value: 0
    };

    const increment = (): Update<TestState> => ({ value }) => ({ value: value + 1 });

    class TestStore extends Store<TestState> {
      constructor() {
        super(INITIAL_STATE);
      }

      increment(): void {
        this.update(
          increment(),
          increment(),
          ({ value }) => ({ value: value + 1 })
        );
      }
    }

    const store = new TestStore();
    store.increment();

    expect(store.state.value).toEqual(3);
  });

  it('allows for named update functions with arguments', () => {
    interface TestState {
      value: number;
    }

    const INITIAL_STATE: TestState = {
      value: 2
    };

    const multiply = (x: number): Update<TestState> => ({ value }) => ({ value: value * x });

    class TestStore extends Store<TestState> {
      constructor() {
        super(INITIAL_STATE);
      }

      double(): void {
        this.update(multiply(2));
      }
    }

    const store = new TestStore();
    store.double();

    expect(store.state.value).toEqual(4);
  });
});
