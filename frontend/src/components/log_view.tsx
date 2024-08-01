import { Log } from '@/types';
import { getLogColor } from '@/utils/log';
import ModalWrapper from '@/wrappers/modal';
import moment from 'moment';
import React from 'react';

interface Props {
  log: Log;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogView = ({ log, setShow }: Props) => {
  return (
    <ModalWrapper top={'1/2'} setShow={setShow}>
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 text-gray-600">
        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-gray-700">Timestamp:</div>
          <div className="text-gray-600">{moment(log.timestamp).format('HH:mm:ss')}</div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-gray-700">Date:</div>
          <div className="text-gray-600">{moment(log.timestamp).format('DD MMMM YYYY')}</div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-gray-700">Title:</div>
          <div className="text-gray-600">{log.title}</div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-gray-700">Resource:</div>
          <div className="text-gray-600">{log.resource}</div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-gray-700">Level:</div>
          <div
            style={{ backgroundColor: getLogColor(log) }}
            className="w-20 rounded-lg p-1 text-center text-sm font-medium"
          >
            {log.level}
          </div>
        </div>

        <div className="flex flex-col text-sm">
          <div className="font-semibold text-gray-700">Description:</div>
          <div className="text-gray-600 whitespace-pre-wrap">{log.description}</div>
        </div>

        <div className="flex flex-col text-sm">
          <div className="font-semibold text-gray-700">Path:</div>
          <div className="text-gray-600">{log.path}</div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default LogView;
