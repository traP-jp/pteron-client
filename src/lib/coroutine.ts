import type { Invocable } from "/@/types/entity";

type State<T> =
    | {
          type: "pending";
          promise: Promise<T>;
      }
    | {
          type: "fulfilled";
          result: T;
      }
    | {
          type: "rejected";
          error: Error;
      };

export class Coroutine<T> {
    #state: State<T>;

    constructor(promise: Promise<T>) {
        const p = promise
            .then(result => {
                this.#state = {
                    type: "fulfilled",
                    result: result,
                };
                return result;
            })
            .catch(e => {
                const error = new Error(e);

                this.#state = {
                    type: "rejected",
                    error: error,
                };

                throw error;
            });

        this.#state = {
            type: "pending",
            promise: p,
        };
    }

    get(): T {
        switch (this.#state.type) {
            case "pending": {
                throw this.#state.promise;
            }
            case "fulfilled": {
                return this.#state.result;
            }
            case "rejected": {
                throw this.#state.error;
            }
        }
    }
}

const cache = new WeakMap<Invocable, Map<string, Coroutine<object>>>();

export const suspend = <Fn extends Invocable>(fn: Fn, ...args: Parameters<Fn>) => {
    if (!cache.has(fn)) cache.set(fn, new Map());
    const cached = cache.get(fn) as Map<string, Coroutine<object>>;

    const serialized = JSON.stringify(args);
    if (!cached.has(serialized)) cached.set(serialized, new Coroutine(fn(...args)));

    const coroutine = cached.get(serialized) as Coroutine<Awaited<ReturnType<Fn>>>;
    return coroutine.get();
};
