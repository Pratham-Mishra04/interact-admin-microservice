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
import { useState, useMemo } from 'react';

interface PostInput {
  user: {
    username: string;
    name: string;
    profilePic: string;
  };
  caption: string;
}

const emptyPostInput = {
  user: { username: '', name: '', profilePic: '' },
  caption: '',
};

const AddUserSpecificPosts = () => {
  const [posts, setPosts] = useState<PostInput[]>([emptyPostInput]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updatePost = (index: number, key: keyof PostInput, value: string) => {
    setPosts(prev => prev.map((post, i) => (i === index ? { ...post, [key]: value } : post)));
  };

  const removePost = (index: number) => {
    setPosts(prev => prev.filter((_, i) => i !== index));
  };

  const addPost = () => {
    setPosts(prev => [...prev, emptyPostInput]);
  };

  const handleSubmit = async () => {
    const filteredPosts = posts.filter(post => post.user.username.trim() !== '' && post.caption.trim() !== '');

    const formData = {
      users: filteredPosts.map(post => post.user.username),
      captions: filteredPosts.map(post => post.caption),
    };

    if (formData.captions.length !== formData.users.length) {
      Toaster.error('Some posts are missing the user or caption', 'error_toaster');
      return;
    }

    if (formData.captions.length == 0) {
      return;
    }

    const toaster = Toaster.startLoad('Adding the posts');
    const res = await postHandler(`${SUPERUSER_URL}/posts/specific`, formData);

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
        <Button variant="ghost">User Specific Posts</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogTitle>Add User Specific Posts</DialogTitle>

        {posts.map((post, index) => (
          <PostBox key={index} index={index} post={post} updatePost={updatePost} removePost={removePost} />
        ))}

        <Button onClick={addPost} variant="outline">
          Add a Post
        </Button>
        {posts.length > 0 && <Button onClick={handleSubmit}>Submit</Button>}
      </DialogContent>
    </Dialog>
  );
};

const PostBox = ({
  index,
  post,
  updatePost,
  removePost,
}: {
  index: number;
  post: PostInput;
  updatePost: (index: number, key: keyof PostInput, value: any) => void;
  removePost: (index: number) => void;
}) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const noResults = useMemo(() => users.length == 0, [users]);

  const handleCaptionChange = (value: string) => {
    updatePost(index, 'caption', value);
  };

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
    <div className="w-full flex flex-col gap-4 border p-4 rounded-lg shadow">
      <div className="w-full flex items-center justify-between">
        <div className="font-medium text-lg">Post {index + 1}</div>
        <X onClick={() => removePost(index)} className="text-primary_danger cursor-pointer" size={20} />
      </div>
      {post.user?.username ? (
        <div className="w-fit flex items-center gap-2 border-[1px] border-primary_btn rounded-lg py-1 px-2">
          <div className="flex-center gap-1">
            <Image
              crossOrigin="anonymous"
              width={50}
              height={50}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${post.user?.profilePic}`}
              className="w-6 h-6 rounded-full mr-1"
            />
            <div>{post.user.name}</div>
          </div>

          <X
            onClick={() => {
              updatePost(index, 'user', emptyPostInput.user);
            }}
            className="cursor-pointer"
            size={16}
          />
        </div>
      ) : (
        <Command>
          <CommandInput
            className="w-full"
            placeholder="Search for the user"
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
                            updatePost(index, 'user', {
                              username: user.username,
                              name: user.name,
                              profilePic: user.profilePic,
                            });
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
      )}

      <Editor content={post.caption} setContent={handleCaptionChange} limit={5000} className="min-h-[150px]" editable />
    </div>
  );
};

export default AddUserSpecificPosts;
