import { renderClock } from './clock';
import './style.css';

const clock = renderClock(
  document.querySelector('#target') as HTMLCanvasElement,
  {
    initialTime: {
      cycle: 0,
      hour: 14,
      minute: 65,
      second: 70,
      millisecond: 0,
    },
    onEvent: (eventType) => console.log({ eventType }),
    // uncomment next line to increase speed
    // loopInterval: 10,
  }
);

clock.play();
