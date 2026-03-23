import { useAppDispatch, useAppSelector } from '../app/hooks';
import { decrement, increment, reset } from '../features/counter/counterSlice';

export function StatePage() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-semibold text-white">Redux State Demo</h2>
      <p className="text-slate-300">
        This page demonstrates connected global state with Redux Toolkit and React Redux.
      </p>

      <div className="inline-flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900 p-5">
        <button
          className="rounded-md bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
          onClick={() => dispatch(decrement())}
          type="button"
        >
          -
        </button>
        <span className="w-8 text-center text-2xl font-bold text-cyan-300">{count}</span>
        <button
          className="rounded-md bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
          onClick={() => dispatch(increment())}
          type="button"
        >
          +
        </button>
        <button
          className="rounded-md bg-cyan-500/20 px-3 py-2 text-cyan-300 hover:bg-cyan-500/30"
          onClick={() => dispatch(reset())}
          type="button"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
