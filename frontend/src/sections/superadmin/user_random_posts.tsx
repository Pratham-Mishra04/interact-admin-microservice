import { User } from '@/types';
import { X } from '@phosphor-icons/react';
import Editor from '@/components/editor';
import { Command, CommandEmpty, CommandInput, CommandList } from '@/components/ui/command';
import { CommandLoading } from 'cmdk';
import Loader from '@/components/loader';
import Image from 'next/image';
import { MAIN_EXPLORE_URL, SUPERUSER_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { SERVER_ERROR } from '@/config/errors';
import Toaster from '@/utils/toaster';
import postHandler from '@/handlers/post_handler';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState, useMemo, Dispatch, SetStateAction } from 'react';

const AddUserRandomPosts = () => {
  const [captions, setCaptions] = useState<string[]>(['']);
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updatePost = (index: number, value: string) => {
    setCaptions(prev => prev.map((post, i) => (i === index ? value : post)));
  };

  const removePost = (index: number) => {
    setCaptions(prev => prev.filter((_, i) => i !== index));
  };

  const addPost = () => {
    setCaptions(prev => [...prev, '']);
  };

  const handleSubmit = async () => {
    const formData = {
      users: users.map(user => user.username),
      captions: captions.filter(caption => caption.length > 0),
    };

    if (formData.captions.length == 0) {
      return;
    }

    if (formData.users.length == 0) {
      Toaster.error('Select users to proceed', 'error_toaster');
      return;
    }

    const toaster = Toaster.startLoad('Adding the posts');
    const res = await postHandler(`${SUPERUSER_URL}/posts/random`, {
      users: users.map(user => user.username),
      captions,
    });

    if (res.statusCode === 201) {
      Toaster.stopLoad(toaster, 'Posts Added!', 1);
      setIsDialogOpen(false);
    } else {
      Toaster.stopLoad(toaster, SERVER_ERROR || res.data.message, 0);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button variant="ghost">User Random Posts</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogTitle>Add User Random Posts</DialogTitle>

        <UsersBox selectedUsers={users} setSelectedUsers={setUsers} />

        {captions.map((caption, index) => (
          <PostBox key={index} index={index} caption={caption} updatePost={updatePost} removePost={removePost} />
        ))}

        <Button onClick={addPost} variant="outline">
          Add a Post
        </Button>
        {captions.length > 0 && <Button onClick={handleSubmit}>Submit</Button>}
      </DialogContent>
    </Dialog>
  );
};

const PostBox = ({
  index,
  caption,
  updatePost,
  removePost,
}: {
  index: number;
  caption: string;
  updatePost: (index: number, value: any) => void;
  removePost: (index: number) => void;
}) => {
  const handleCaptionChange = (value: string) => {
    updatePost(index, value);
  };

  return (
    <div className="w-full flex flex-col gap-4 border p-4 rounded-lg shadow">
      <div className="w-full flex items-center justify-between">
        <div className="font-medium text-lg">Post {index + 1}</div>
        <X onClick={() => removePost(index)} className="text-primary_danger cursor-pointer" size={20} />
      </div>

      <Editor content={caption} setContent={handleCaptionChange} limit={5000} className="min-h-[150px]" editable />
    </div>
  );
};

const UsersBox = ({
  selectedUsers,
  setSelectedUsers,
}: {
  selectedUsers: User[];
  setSelectedUsers: Dispatch<SetStateAction<User[]>>;
}) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const noResults = useMemo(() => users.length == 0, [users]);
  const fetchUsers = async (search?: string) => {
    setLoading(true);
    const URL = `${MAIN_EXPLORE_URL}/quick?${'search=' + search}&limit=10`;
    const res = await getHandler(URL, undefined, true);

    if (res.statusCode === 200) {
      setUsers(res.data.users || []);
    } else {
      Toaster.error(res.data.message || SERVER_ERROR, 'error_toaster');
    }

    setLoading(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="w-full flex items-center flex-wrap gap-2">
        {selectedUsers.map(user => (
          <div
            key={user.id}
            className="w-fit flex items-center gap-2 border-[1px] border-primary_btn rounded-lg py-1 px-2"
          >
            <div className="flex-center gap-1">
              <Image
                crossOrigin="anonymous"
                width={50}
                height={50}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                className="w-6 h-6 rounded-full mr-1"
              />
              <div>{user.name}</div>
            </div>

            <X
              onClick={() => setSelectedUsers(prev => prev.filter(u => u.id !== user.id))}
              className="cursor-pointer"
              size={16}
            />
          </div>
        ))}
      </div>
      <Command>
        <CommandInput
          className="w-full"
          placeholder="Search for a user"
          value={search}
          onValueChange={value => {
            if (value) fetchUsers(value);
            else setUsers([]);
            setSearch(value);
          }}
        />
        <CommandList>
          {loading ? (
            <CommandLoading className="loader-container">
              <Loader />
            </CommandLoading>
          ) : (
            <>
              {noResults
                ? search && <CommandEmpty> No results found for &quot;{search}&quot;</CommandEmpty>
                : users.map(user => {
                    return (
                      <div
                        key={user.id}
                        onClick={() => {
                          setSelectedUsers(prev => [...prev, user]);
                          setUsers([]);
                          setSearch('');
                        }}
                        className="w-full flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-dark_primary_comp_hover p-1 rounded-sm transition-ease-300 cursor-pointer"
                      >
                        <Image
                          crossOrigin="anonymous"
                          width={50}
                          height={50}
                          alt={'User Pic'}
                          src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                          placeholder="blur"
                          blurDataURL={user.profilePicBlurHash || 'no-hash'}
                          className="w-6 h-6 rounded-full mr-1"
                        />
                        <div className="text-sm">{user.username}</div>
                      </div>
                    );
                  })}
            </>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default AddUserRandomPosts;
