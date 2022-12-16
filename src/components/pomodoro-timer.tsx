import React from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './button-timer';

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.pomodoroTime);
  const [timeCount, setTimeCounting] = React.useState(false);
  const [working, setWorking] = React.useState(false);

  React.useEffect(() => {
    if (working) document.body.classList.add('working')
  }, [working])

  useInterval(() => {
    setMainTime(mainTime - 1);
  }, timeCount ? 1000 : null);

  const configureWork = () => {
    setTimeCounting(true);
    setWorking(true);
  }

  return (
    <div className="pomodoro">
      <h2>You are: working</h2>
      <Timer mainTime={mainTime}/>
      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}/>
        {working && <Button text="Resting" onClick={() => console.log('oi')}/>}
        {working && <Button text={timeCount ? 'Pause' : 'Play'} onClick={() => setTimeCounting(!timeCount)}/>}
      </div>
      <div className="details">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique eligendi excepturi obcaecati fugit ipsam suscipit praesentium, eos nesciunt, iusto porro illum. Ipsum tenetur ad, mollitia maxime nisi impedit nemo asperiores.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique eligendi excepturi obcaecati fugit ipsam suscipit praesentium, eos nesciunt, iusto porro illum. Ipsum tenetur ad, mollitia maxime nisi impedit nemo asperiores.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique eligendi excepturi obcaecati fugit ipsam suscipit praesentium, eos nesciunt, iusto porro illum. Ipsum tenetur ad, mollitia maxime nisi impedit nemo asperiores.</p>
      </div>
    </div>
  )
}
