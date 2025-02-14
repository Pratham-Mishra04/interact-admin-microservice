import Sidebar from '@/components/common/sidebar';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AddUserSpecificPosts from '@/sections/superadmin/user_specific_posts';
import AddUserRandomPosts from '@/sections/superadmin/user_random_posts';
import ApprovalTokens from '@/sections/superadmin/approval-tokens';

const SuperAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <BaseWrapper>
      <Sidebar index={11} />
      <MainWrapper>
        <div className="w-full h-full p-4 flex items-center gap-4">
          <DropdownMenu open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DropdownMenuTrigger>
              <Button>Add Posts</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2">
              <AddUserSpecificPosts />
              <AddUserRandomPosts />
            </DropdownMenuContent>
          </DropdownMenu>
          <ApprovalTokens />
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default SuperAdmin;
