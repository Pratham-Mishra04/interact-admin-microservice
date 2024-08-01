import { Log } from '@/types';

export const getLogColor = (log: Log) => {
  switch (log.level) {
    case 'info':
      return '#DCF9FD';
    case 'fatal':
    case 'error':
      return '#FFBABA';
    case 'debug':
      return '#DAE0FF';
    case 'warn':
    case 'warning':
      return '#FEFFDB';
    case 'success':
      return '#DBFFDD';
    default:
      return '#fff';
  }
};
