/**
 * K2 time system has
 * - 1 day has 2 cycle, day and night
 * - 1 cycle has 15 hrs
 * - 1 hr has 75 mins
 * - 1 min has 75 sec
 * - 1 sec has 1000 ms
 */
export const CONVERSION = {
  cycleInDay: 2,
  hourInCycle: 15,
  minuteInHour: 75,
  secondInMinute: 75,
};

const msInSec = 1000;
const msInMinute = CONVERSION.secondInMinute * msInSec;
const msInHour = CONVERSION.minuteInHour * msInMinute;
const msInCycle = CONVERSION.hourInCycle * msInHour;
const msInDay = CONVERSION.cycleInDay * msInCycle;

export const getMsForToday = (timeValue: number) => timeValue % msInDay;

export interface Time {
  /**
   * 0: day
   * 1: night
   */
  cycle: number;
  /**
   * 0 - 14
   */
  hour: number;
  /**
   * 0 - 74
   */
  minute: number;
  /**
   * 0 - 74
   */
  second: number;
  /**
   * 0 - 999
   */
  millisecond: number;
}

export const formatTime = (value: number): Time => {
  const todayValue = getMsForToday(value);

  const cycle = Math.floor(todayValue / msInCycle);

  const msInCurrentCycle = todayValue % msInCycle;
  const hour = Math.floor(msInCurrentCycle / msInHour);

  const msInCurrentHour = msInCurrentCycle % msInHour;
  const minute = Math.floor(msInCurrentHour / msInMinute);

  const msInCurrentMinute = msInCurrentHour % msInMinute;
  const second = Math.floor(msInCurrentMinute / msInSec);

  const msInCurrentSecond = msInCurrentMinute % msInSec;

  return {
    cycle,
    hour,
    minute,
    second,
    millisecond: msInCurrentSecond,
  };
};

export const timeToValue = (time: Time): number => {
  return (
    time.cycle * msInCycle +
    time.hour * msInHour +
    time.minute * msInMinute +
    time.second * msInSec +
    time.millisecond
  );
};
