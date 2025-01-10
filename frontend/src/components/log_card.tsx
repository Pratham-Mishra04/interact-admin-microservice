import { Log } from '@/types';
import React, { Dispatch, SetStateAction, useState } from 'react';
import moment from 'moment';
import { X } from '@phosphor-icons/react';
import Toaster from '@/utils/toaster';
import deleteHandler from '@/handlers/delete_handler';
import ConfirmDelete from './common/confirm_delete';
import Cookies from 'js-cookie';
import { getLogColor } from '@/utils/log';

interface Props {
  log: Log;
  setLogs: Dispatch<SetStateAction<Log[]>>;
  setClickedLog: React.Dispatch<React.SetStateAction<Log | null>>;
  setClickedOnLog: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogCard = ({ log, setLogs, setClickedLog, setClickedOnLog }: Props) => {
  const [clickedOnDelete, setClickedOnDelete] = useState(false);

  const handleDelete = async () => {
    const toaster = Toaster.startLoad('Deleting this log...');
    const URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/logs/${log.id}`;
    const res = await deleteHandler(URL);
    if (res.statusCode === 204) {
      setLogs(prev => prev.filter(l => l.id != l.id));
      setClickedOnDelete(false);
      Toaster.stopLoad(toaster, 'Log Deleted', 1);
    } else {
      Toaster.stopLoad(toaster, 'Internal Server Error', 0);
    }
  };

  const userRole = Cookies.get('role');

  return (
    <>
      {clickedOnDelete ? <ConfirmDelete handleDelete={handleDelete} setShow={setClickedOnDelete} /> : <></>}
      <div
        onClick={() => {
          setClickedLog(log);
          setClickedOnLog(true);
        }}
        className="w-[95%] h-16 hover:bg-gray-100 mx-auto border-b-[1px] border-gray-200 rounded-lg flex text-base text-gray-600 cursor-pointer transition-ease-300"
      >
        <div className="w-1/12 flex-center max-md:hidden">{moment(log.timestamp).format('HH:mm:ss')}</div>
        <div className="w-1/12 flex-center max-md:w-2/6 max-md:text-xs">
          {moment(log.timestamp).format('DD MMM YY')}
        </div>
        <div className={`${userRole == 'Manager' ? 'w-2/12' : 'w-3/12'} flex-center max-md:w-3/6 max-md:text-xs`}>
          {log.title.length > 30 ? log.title.substring(0, 30) + '...' : log.title}
        </div>
        <div className="w-1/12 flex-center max-md:w-3/6 max-md:text-xs">{log.resource}</div>
        <div className="w-1/12 flex-center max-md:w-1/6 max-md:text-xs">
          <div
            style={{ backgroundColor: getLogColor(log) }}
            className="w-20 rounded-lg p-1 flex-center text-sm font-medium"
          >
            {log.level}
          </div>
        </div>
        <div className="w-3/12 flex-center max-md:hidden text-xs">
          {log.description.length > 75 ? log.description.substring(0, 75) + '...' : log.description}
        </div>
        <div className="w-2/12 flex-center max-md:hidden text-sm">{log.path}</div>
        {userRole == 'Manager' && (
          <div className="w-1/12 flex-center">
            <X onClick={() => setClickedOnDelete(true)} className="cursor-pointer" size={20} />
          </div>
        )}
      </div>
    </>
  );
};

export default LogCard;
