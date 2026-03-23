import { useAppDispatch, useAppSelector } from '../app/hooks';
import { decrement, increment, reset } from '../features/counter/counterSlice';

export function StatePage() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold text-npf-charcoal">Redux State Demo</h2>
      <p className="text-npf-muted">
        This page demonstrates connected global state with Redux Toolkit and React Redux.
      </p>

      <div className="inline-flex items-center gap-4 rounded-lg border border-npf-border bg-npf-surface p-5 shadow-sm">
        <button
          className="rounded-md border border-npf-border bg-white px-3 py-2 text-npf-charcoal hover:bg-npf-surface"
          onClick={() => dispatch(decrement())}
          type="button"
        >
          -
        </button>
        <span className="w-8 text-center text-2xl font-bold text-npf-red">{count}</span>
        <button
          className="rounded-md border border-npf-border bg-white px-3 py-2 text-npf-charcoal hover:bg-npf-surface"
          onClick={() => dispatch(increment())}
          type="button"
        >
          +
        </button>
        <button
          className="rounded-md bg-npf-red px-3 py-2 font-medium text-white hover:bg-npf-red-dark"
          onClick={() => dispatch(reset())}
          type="button"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
