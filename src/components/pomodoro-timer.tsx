import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './button-timer';
import Start from '../assets/src_sounds_bell-start.mp3';
import Finish from '../assets/src_sounds_bell-finish.mp3';
import { secondsToTime } from '../utils/seconds-to-time';

const audioStartWorking = new Audio(Start);
const audioStopWorking = new Audio(Finish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCount, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
      new Array(props.cycles - 1).fill(true)
    );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(() => {
    setMainTime(mainTime - 1);
    if (working) setFullWorkingTime(fullWorkingTime + 1);
  }, timeCount ? 1000 : null);

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  },
  [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.pomodoroTime
  ])

  const configureRest = useCallback((long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true);

    long ? setMainTime(props.longRestTime) :
    setMainTime(props.shortRestTime);
    audioStopWorking.play();
  },
  [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.longRestTime,
    props.shortRestTime
  ]);

    useEffect(() => {
    if (working) document.body.classList.add('working');
    if (working) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();

  },
  [
    working,
    resting,
    mainTime,
    cyclesQtdManager,
    numberOfPomodoros,
    completedCycles,
    configureRest,
    setCyclesQtdManager,
    configureWork,
    props.cycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>Você está: {working ? 'Trabalhando' : 'Descansando'}</h2>
      <Timer mainTime={mainTime}/>
      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}/>
        <Button text="Resting" onClick={() => configureRest(false)}/>
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCount ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCount)}/>
      </div>
      <div className="details">
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Horas Trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  )
}
