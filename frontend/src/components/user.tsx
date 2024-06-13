import React from 'react';
import Image from 'next/image';
import { User } from '@/types';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Link from 'next/link';
import Toaster from '@/utils/toaster';
import { Buildings } from '@phosphor-icons/react';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import postHandler from '@/handlers/post_handler';
import { SERVER_ERROR } from '@/config/errors';
import { X } from '@phosphor-icons/react/dist/ssr';

interface Props {
    user : User ;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserComponent = ({ user, setUsers }: Props) => {
  const removeFlag = () => {
    const toaster = Toaster.startLoad('Removing Flag', user.id);
    const URL = `/flags/users/${user.id}`;
    postHandler(URL, {})
      .then(res => {
        if (res.statusCode === 200) {
          setUsers(prev => prev.filter(p => p.id != user.id));
          Toaster.stopLoad(toaster, 'Flag Removed', 1);
        } else {
          if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
          else {
            Toaster.stopLoad(toaster, SERVER_ERROR, 0);
          }
        }
      })
      .catch(err => {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      });
  };
  return (
    <div className="w-full">
      <div className="w-full relative bg-white font-primary flex gap-1 rounded-lg rounded-b-none p-2 text-primary_black border-gray-300 border-b-0 border-[1px]">
        <div className="h-full">
          <Link href={`${`/explore/user/${user.username}`}`} className="rounded-full">
            <Image
              crossOrigin="anonymous"
              width={100}
              height={100}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
              className={'rounded-full w-8 h-8'}
            />
          </Link>
        </div>
        <div className="w-[calc(100%-32px)] flex flex-col gap-1">
          <div className="w-full h-fit flex justify-between">
            <Link href={`${`/explore/user/${user.username}`}`} className="font-medium flex items-center gap-1">
              {user.name}
              {user.isOrganization ? <Buildings weight="duotone" /> : <></>}
              <div className="text-xs font-normal text-gray-500">@{user.username}</div>
              <div className="text-xs font-normal text-gray-500">@{user.title}</div>
            </Link>
          </div>
        </div>
      </div>
      <X onClick={removeFlag} className="w-full bg-red-100 rounded-b-lg cursor-pointer h-4" />
    </div>
  );
};

export default UserComponent;