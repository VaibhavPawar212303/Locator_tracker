import type { CallLog, Mode, Source } from './recorderTypes';
import * as React from 'react';
import { Recorder } from './recorder';
import './recorder.css';

export const Main: React.FC = ({
}) => {
  const [sources, setSources] = React.useState<Source[]>([]);
  const [paused, setPaused] = React.useState(false);
  const [log, setLog] = React.useState(new Map<string, CallLog>());
  const [mode, setMode] = React.useState<Mode>('none');

  window.playwrightSetMode = setMode;
  window.playwrightSetSources = setSources;
  window.playwrightSetPaused = setPaused;
  window.playwrightUpdateLogs = callLogs => {
    const newLog = new Map<string, CallLog>(log);
    for (const callLog of callLogs) {
      callLog.reveal = !log.has(callLog.id);
      newLog.set(callLog.id, callLog);
    }
    setLog(newLog);
  };

  window.playwrightSourcesEchoForTest = sources;
  return <Recorder sources={sources} paused={paused} log={log} mode={mode} />;
};
