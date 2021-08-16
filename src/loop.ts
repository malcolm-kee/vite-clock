export interface CreateLoopOptions<Values> {
  /**
   * initial values
   */
  initialValues: Values;
  /**
   * callback to be invoked for every loopInterval.
   *
   * Run any side effects you want here.
   *
   * You must return the values for the next loop.
   */
  onLoop: (currentValues: Values) => Values;
  /**
   * interval between each looop, in millisecond
   */
  loopInterval: number;
}

export function createLoop<Values>(options: CreateLoopOptions<Values>) {
  let values = options.initialValues;
  let intervalId: number;

  function play() {
    values = options.onLoop(values);

    intervalId = window.setInterval(() => {
      values = options.onLoop(values);
    }, options.loopInterval);
  }

  function pause() {
    window.clearInterval(intervalId);
  }

  return {
    play,
    pause,
  };
}
