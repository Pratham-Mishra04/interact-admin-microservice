import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { SERVER_ERROR } from '@/config/errors';
import Loader from '@/components/loader';
import { Opening } from '@/types';
import InfiniteScroll from 'react-infinite-scroll-component';
import OpeningComponent from '@/components/opening';

const Openings = () => {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const getOpenings = () => {
    setLoading(true);
    const URL = `/flags/openings?page=${page}&limit=${10}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const addedOpenings = [...openings, ...(res.data.openings || [])];
          if (addedOpenings.length === openings.length) setHasMore(false);
          setOpenings(addedOpenings);
          setPage(prev => prev + 1);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    getOpenings();
  }, []);

  return (
    <div className="w-full h-full p-4">
      {loading ? (
        <div className="w-[45vw] mx-auto max-lg:w-[85%] max-md:w-full">
          <Loader />
        </div>
      ) : (
        <InfiniteScroll
          className="w-[45vw] mx-auto max-lg:w-[85%] max-md:w-screen flex flex-col gap-2 max-lg:px-4 pb-base_padding"
          dataLength={openings.length}
          next={getOpenings}
          hasMore={hasMore}
          loader={<Loader />}
        >
          {openings.length === 0 ? (
            <div>No Flagged Openings.</div>
          ) : (
            openings.map(opening => <OpeningComponent key={opening.id} opening ={opening} setOpenings={setOpenings} />)
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Openings;