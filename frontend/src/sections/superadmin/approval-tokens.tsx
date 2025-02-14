import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Buildings } from '@phosphor-icons/react';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import postHandler from '@/handlers/post_handler';
import isEmail from 'validator/lib/isEmail';
import { Input } from '@/components/ui/input';
import moment from 'moment';
import deleteHandler from '@/handlers/delete_handler';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export interface ApprovalToken {
  email: string;
  code: string;
  expiry: string;
}

const ApprovalTokens = () => {
  const [approvalTokens, setApprovalTokens] = useState<ApprovalToken[]>([]);
  const [clickedOnNewToken, setClickedOnNewToken] = useState(false);

  useEffect(() => {
    const getApprovalTokens = async () => {
      const res = await getHandler('/superuser/approval-code');
      if (res.statusCode == 200) {
        setApprovalTokens(res.data.codes || []);
      } else {
        Toaster.error(res.data.message || 'Internal Server Error', 'error_toaster');
      }
    };

    getApprovalTokens();
  }, []);

  const generateNewToken = async (email: string) => {
    if (!isEmail(email)) {
      Toaster.error('Invalid Email Address', 'error_toaster');
      return;
    }

    const res = await postHandler('/superuser/approval-code', { email });
    if (res.statusCode == 201) {
      setApprovalTokens([...approvalTokens, res.data.token]);
      setClickedOnNewToken(false);
    } else {
      Toaster.error(res.data.message || 'Internal Server Error', 'error_toaster');
    }
  };

  const revokeToken = async (email: string) => {
    const res = await deleteHandler(`/superuser/approval-code/${email}`);
    if (res.statusCode == 204) {
      setApprovalTokens(approvalTokens.filter(token => token.email !== email));
    } else {
      Toaster.error(res.data.message || 'Internal Server Error', 'error_toaster');
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          Organisation Approval Tokens <Buildings size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Organisation Approval Tokens</DialogTitle>
          <DialogDescription>Manage the Organisation Approval Tokens from here.</DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="line-clamp-1">Email</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="w-1/6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvalTokens &&
              approvalTokens.map((token, i) => (
                <TableRow key={i}>
                  <TableCell>{token.email}</TableCell>
                  <TableCell>{token.code}</TableCell>
                  <TableCell>{moment(token.expiry).format('HH:mm:ss DD-MMM, YYYY')}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <div className="text-primary_danger text-xs font-medium cursor-pointer">Revoke</div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the token and the user won&apos;t
                            be able to use it to create a new organisation.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => revokeToken(token.email)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {clickedOnNewToken ? (
          <form
            onSubmit={el => {
              el.preventDefault();
              const email = (el.target as HTMLFormElement).email.value;
              generateNewToken(email);
            }}
            className="w-full flex items-center space-x-2"
          >
            <Input type="email" name="email" placeholder="Email" required />
            <Button type="submit">Generate</Button>
          </form>
        ) : (
          <Button className="w-full" onClick={() => setClickedOnNewToken(true)}>
            Generate New Token
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalTokens;
