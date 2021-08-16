import { createLoop } from './loop';
import { formatTime, Time, timeToValue, CONVERSION } from './time';

export interface RenderClockOptions {
  initialTime: Time;
  onEvent: (eventType: 'hourComplete' | 'cycleComplete') => void;
  loopInterval?: number;
}

type ClockValue = [undefined | Time, number];

export function renderClock(
  target: HTMLCanvasElement,
  { initialTime, onEvent, loopInterval = 1000 }: RenderClockOptions
) {
  const ctx = target.getContext('2d') as CanvasRenderingContext2D;
  const canvasWidth = target.width;
  const canvasHeight = target.height;
  const xCenter = canvasWidth / 2;
  const yCenter = canvasHeight / 2;
  const radius = canvasWidth / 2 - 50;

  return createLoop({
    initialValues: [undefined, timeToValue(initialTime)] as ClockValue,
    loopInterval,
    onLoop: ([prevTime, timeValue]): ClockValue => {
      clearCanvas();
      const time = formatTime(timeValue);
      drawSetup(time.cycle);

      drawTime(time);

      if (prevTime) {
        if (prevTime.hour !== time.hour) {
          onEvent('hourComplete');
        }
        if (prevTime.cycle !== time.cycle) {
          onEvent('cycleComplete');
        }
      }

      return [time, timeValue + 1000];
    },
  });

  function drawSetup(cycle: number) {
    const isNight = cycle === 1;
    ctx.save();

    ctx.beginPath();
    ctx.arc(xCenter, yCenter, radius, 0, 2 * Math.PI);

    if (isNight) {
      ctx.fill();
    } else {
      ctx.stroke();
    }

    // draw marking
    ctx.translate(xCenter, yCenter);
    ctx.rotate(Math.PI);
    for (let hr = 0; hr < CONVERSION.hourInCycle; hr++) {
      const angle = ((2 * Math.PI) / CONVERSION.hourInCycle) * hr;
      const sAngle = Math.sin(angle);
      const cAngle = Math.cos(angle);

      const startX = sAngle * (radius - 20);
      const startY = cAngle * (radius - 20);
      const endX = sAngle * (radius - 5);
      const endY = cAngle * (radius - 5);

      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = isNight ? '#EEE' : '#111';
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawTime(time: Time) {
    const isNight = time.cycle === 1;

    ctx.save();
    ctx.lineWidth = 6;
    ctx.translate(xCenter, yCenter);

    // draw hour
    ctx.save();
    ctx.rotate(
      ((Math.PI * 2) / CONVERSION.hourInCycle) *
        (time.hour +
          (time.minute + time.second / CONVERSION.secondInMinute) /
            CONVERSION.minuteInHour)
    );
    ctx.strokeStyle = isNight ? '#FFF' : '#000';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, -(radius - 90));
    ctx.stroke();
    ctx.restore(); // restore rotate

    // draw minute
    ctx.save();
    ctx.rotate(
      ((Math.PI * 2) / CONVERSION.minuteInHour) *
        (time.minute + time.second / CONVERSION.secondInMinute)
    );
    ctx.strokeStyle = isNight ? '#E5E7EB' : '#4B5563';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, -(radius - 50));
    ctx.stroke();
    ctx.restore(); // restore rotate

    // draw second
    ctx.save();
    ctx.rotate(((Math.PI * 2) / CONVERSION.secondInMinute) * time.second);
    ctx.strokeStyle = '#E33';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, -(radius - 15));
    ctx.stroke();
    ctx.restore(); // restore rotate

    ctx.restore(); // restore translate
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }
}
