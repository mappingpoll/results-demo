import { useState } from "preact/hooks";

export default function useAsyncReducer(reducer, initState) {
  const [state, setState] = useState(initState),
    dispatchState = async action => setState(await reducer(state, action));
  return [state, dispatchState];
}
