# ngx-mvu

## Angular Model-View-Update architectural pattern

Angular MVU represents an architectural pattern tailored for the development of sophisticated, efficient, and reactive components and applications within the Angular 2+ framework.

Rooted in the foundational principles of [the Elm architecture](https://guide.elm-lang.org/architecture/), Angular MVU seamlessly integrates these concepts into the Angular framework, bringing forth a harmonious fusion of Elm's proven architectural philosophy and the robust capabilities of Angular.

## Core concepts

Let's see how easily we can build component using core concepts of Angular MVU.

### Model

First, we define a model.

```ts
interface IncrementState {
  value: number;
}
```

Next, we define an initial state of the model.

```ts
const INITIAL_STATE: IncrementState = {
  value: 0
};
```

Then, we define a store and pass the initial state to it.

```ts
@Injectable()
class IncrementStore extends Store<IncrementState> {
  constructor() {
    super(INITIAL_STATE);
  }
}
```

### View

Now we are ready to display data from the store in a view.

```ts
@Component({
  selector: 'app-increment',
  templateUrl: './increment.component.html'
})
export class IncrementComponent {
  readonly state$: Observable<IncrementState>;

  constructor(private store: IncrementStore) {
    this.state$ = this.store.state$;
  }
}
```

```html
<ng-container *ngIf="state$ | async; let state">
  <div>{{ state.value }}</div>
</ng-container>
```

### Update

We have Model and View. Now it's time to add an Update part.

First we define updates by defining store methods which call internal store `update` method expecting update function as an argument.

State should be always immutable, so update function is a pure function, which creates a new state object based on a previous one.

```ts
@Injectable()
class IncrementStore extends Store<IncrementState> {
  constructor() {
    super(INITIAL_STATE);
  }

  increment(): void {
    this.update(({ value }) => ({ value: value + 1 }));
  }

  decrement(): void {
    this.update(({ value }) => ({ value: value - 1 }));
  }
}
```

Now, connect store methods with the view.

```ts
@Component({
  selector: 'app-increment',
  template: './increment.component.html'
})
export class IncrementComponent {
  readonly state$: Observable<IncrementState>;

  constructor(private store: IncrementStore) {
    this.state$ = this.store.state$;
  }

  increment(): void {
    this.store.increment();
  }

  decrement(): void {
    this.store.decrement();
  }
}
```

```html
<ng-container *ngIf="state$ | async; let state">
  <div>{{ state.value }}</div>
  <button (click)="increment()">Increment</button>
  <button (click)="decrement()">Decrement</button>
</ng-container>
```

Done! This few steps allowed us for implementing MVU architecture pattern in Angular.

## Why use this architecture?

- **Complete Static Typing**
  - This architecture is fully statically typed, enabling seamless and confident code refactoring. Leverage the power of static typing for easy and secure code modifications.  
- **Elm Architecture Concepts for Angular**
  - Apply Elm architecture concepts to the Angular framework, resulting in a clean, robust, and easily understandable architecture. Enhance the structure of your code for improved maintainability.
- **Utilization of RxJS Power**
  - Harness the full potential of RxJS, treating Observables as first-class citizens. This pattern simplifies the handling of side effects, facilitating the creation of rich and reactive UIs.
- **Reduced Code Verbosity**
  - Experience less code verbosity compared to alternative solutions such as Redux, NgRx or Akita. Streamline your development process while maintaining code clarity.
- **Enhanced Unit Testability**
  - Ensure comprehensive unit test coverage effortlessly. The architecture is designed to make every aspect of your application code easily testable.
- **Functional Programming Practices**
  - Incorporate the best practices of functional programming, including immutability and pure functions, seamlessly into your Angular codebase. Embrace these principles without disrupting the familiarity of the Angular environment.
- **Minimal Code Overhead**
  - Keep code overhead to a minimum with a concise and straightforward implementation. The `ngx-mvu` library consists of fewer than 50 lines of code, allowing you to focus on adhering to best patterns and practices.
- **Versatility for New and Existing Projects**
  - Seamlessly integrate this architecture into both new and existing projects. Whether you are starting fresh or enhancing an established application, the benefits remain consistent.
- **Scalability for Entire Applications or Components**
  - Scale your projects effectively. This architecture is suitable for building entire applications or individual components, offering flexibility in implementation.
- **Battle-Tested in Real-Life Applications**
  - Benefit from a comprehensive and battle-tested solution. This architecture has successfully powered the development of real-life applications, including large forms, interactive tables or hi-res image viewers.

## Advanced concepts

### Named update functions

Example above showed store with anonymous update functions. It is also easy to extract named update functions.

```ts
const increment = (): Update<IncrementState> = ({ value }) => ({ value: value + 1 });

@Injectable()
class IncrementStore extends Store<IncrementState> {
  constructor() {
    super(INITIAL_STATE);
  }

  increment(): void {
    this.update(increment());
  }
}
```

### Update functions piping
It is possible to pipe update functions.

This results in code being easier to understand, more reusable and composable.

Please note that UI repaint is triggered only after all the updates are applied, so it is very fast and guarantees state consistency across repaints.

```ts
const increment = (): Update<IncrementState> = ({ value }) => ({ value: value + 1 });

@Injectable()
class IncrementStore extends Store<IncrementState> {
  constructor() {
    super(INITIAL_STATE);
  }

  incrementTwice(): void {
    this.update(
      increment(),
      increment()
    );
  }
}
```

### Update functions arguments
Named updated functions can also receive arguments for even bigger flexibility.

```ts
const multiply = (x: number): Update<IncrementState> = ({ value }) => ({ value: value * x });

@Injectable()
class IncrementStore extends Store<IncrementState> {
  constructor() {
    super(INITIAL_STATE);
  }

  double(): void {
    this.update(multiply(2));
  }

  triple(): void {
    this.update(multiply(3));
  }
}
```

### Side effects
Store methods that are dealing with side effects (e.g. HTTP requests or timers) should return Observable and use `tap` RxJS operator for updating store state.

```ts
@Injectable()
class IncrementStore extends Store<IncrementState> {
  constructor() {
    super(INITIAL_STATE);
  }

  incrementAfterOneSecond(): Observable<void> {
    return of(null).pipe(delay(1000), tap(() => this.update(increment())));
  }
}

class IncrementComponent {
  constructor(private store: IncrementStore) {}

  incrementAfterOneSecond(): void {
    this.store.incrementAfterOneSecond().subscribe();
  }
}
```

### Data providers and HTTP requests
Data providers are useful abstraction when dealing with HTTP requests or other external data sources.

The idea is that any request performed by store should be performed by it's underlying provider. This allows for separating data access responsibility from store's business logic. It's useful for testing and data mocking.

Below is an example of store that loads data from HTTP API on component initialization.

```ts
interface Article {
  id: string;
  content: string;
}

interface ArticlesState {
  articles: Article[];
  loading: boolean;
}

@Injectable()
class ArticlesProvider {
  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>('/assets/articles.json');
  }
}

const INITIAL_STATE: ArticlesState = {
  articles: undefined,
  loading: false
};

@Injectable()
class ArticlesStore extends Store<ArticlesState> {
  constructor(private provider: ArticlesProvider) {
    super(INITIAL_STATE);
  }

  init(): Observable<void> {
    this.update(state => ({ ...state, loading: true }));

    return this.provider.getArticles()
      .pipe(
        tap(articles => this.update(state => ({ ...state, articles, loading: false }))),
        mapTo(null)
      );
  }
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html'
})
class ArticlesComponent {
  readonly state$: Observable<ArticlesState>;

  constructor(private store: ArticlesStore) {
    this.state$ = this.store.state$;
  }

  ngOnInit(): void {
    this.store.init().subscribe();
  }

  trackById(index: number, article: Article): string {
    return article.id;
  }
}
```
```html
<ng-container *ngIf="state$ | async; let state">
  <div *ngIf="state.loading else loaded">
    Loading data...
  </div>

  <ng-template #loaded>
    <div *ngFor="let article of state.articles; trackBy: trackById">
      {{ article.content }}
    </div>
  </ng-template>
</ng-container>
```

### Performance optimization

For optimal Angular performance, it is recommended to use `ChangeDetectionStrategy.OnPush`. This prevents default dirty detection checks and makes change detection act more accurate and performant.

However, this change detection mode has few limitations. Among them is that data operations should be immutable and that change detection is triggered only in certain circumstances (`@Input()` properties change, component emitting event, zone.js monkey-patched stuff like setTimeout, observable streams and explicit change detection).

In MVU all data updates are immutable, data changes are propagated via observable stream `state$` and data reading is performed by `async` pipe. This allows for using `ChangeDetectionStrategy.OnPush` out of the box, with no additional effort.

## Support & consulting

Are you:

- Seeking expert guidance in constructing highly performant frontend components?
- Engaged in the development of a large and intricate application, and in need of valuable insights?
- Unsure about the application of a particular architecture, or perhaps you've encountered perplexing edge cases?
- Interested in accelerating your team's proficiency in working with MVU architecture?
- Seeking a fresh perspective and an additional set of eyes to scrutinize your ideas?
- Simply looking to say hello or share a suggestion?

Feel free to reach out to me; I am more than happy to assist you in all these scenarios and more!

This architecture is a culmination of years of experience in Angular development, and I am eager to share my expertise with you.

As a seasoned software developer with a background in training both individuals and teams, I am well-equipped to provide comprehensive support.
