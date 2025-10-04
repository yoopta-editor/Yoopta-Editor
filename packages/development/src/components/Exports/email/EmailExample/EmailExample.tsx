import type { ChangeEvent} from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { EmailTemplateOptions, YooptaContentValue } from '@yoopta/editor';
import { YooEditor } from '@yoopta/editor';
import type { YooptaEmailEditor } from '@yoopta/email-builder';
import EmailBuilder, { createYooptaEmailEditor } from '@yoopta/email-builder';
import copy from 'copy-to-clipboard';
import { CopyIcon, ExternalLinkIcon, MailWarningIcon } from 'lucide-react';

import { EMAIL_EDITOR_DEFAULT_VALUE } from './defaultEditorValue';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { uploadToCloudinary } from '@/utils/cloudinary';

const templateEmailOptions: EmailTemplateOptions = {
  head: {
    styles: [
      {
        id: 'font',
        content: `* { font-family: Verdana, sans-serif; } table { border-collapse: collapse; border-spacing: 0; }`,
      },
    ],
    meta: [
      { content: 'width=device-width', name: 'viewport' },
      { charset: 'UTF-8' },
      { content: 'IE=edge', 'http-equiv': 'X-UA-Compatible' },
      { content: 'telephone=no,address=no,email=no,date=no,url=no', name: 'format-detection' },
      { content: 'light', name: 'color-scheme' },
      { content: 'light', name: 'supported-color-schemes' },
    ],
  },
  body: {
    attrs: {
      style: {
        backgroundColor: '#fafafa',
        width: '900px',
        margin: '0 auto',
      },
    },
  },
  container: {
    attrs: {
      style: {
        width: 600,
        margin: '0 auto',
      },
    },
  },
};

const mediaUploaders = {
  onImageUpload: async (file: File) => {
    const response = await uploadToCloudinary(file);
    return {
      src: response.secure_url,
      sizes: {
        width: response.width,
        height: response.height,
      },
    };
  },

  onVideoUpload: async (file: File) => {
    const response = await uploadToCloudinary(file, 'video');
    return {
      src: response.secure_url,
      sizes: {
        width: response.width,
        height: response.height,
      },
    };
  },

  onVideoUploadPoster: async (file: File) => {
    const response = await uploadToCloudinary(file);
    return response.url;
  },

  onFileUpload: async (file: File) => {
    const response = await uploadToCloudinary(file, 'auto');

    return {
      src: response.secure_url,
      format: response.format,
      name: response.name,
      size: response.bytes,
    };
  },
};

type EmailFields = {
  RESEND_API_KEY: string;
  recipientEmail: string;
  subjectEmail: string;
};

const EmailExample = () => {
  const editor: YooptaEmailEditor = useMemo(
    () => createYooptaEmailEditor({ template: templateEmailOptions }),
    [],
  );
  const [value, setValue] = useState<YooptaContentValue>(EMAIL_EDITOR_DEFAULT_VALUE);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFields, setEmailFields] = useState<EmailFields>({
    RESEND_API_KEY: '',
    recipientEmail: '',
    subjectEmail: '',
  });

  const onChange = (data: YooptaContentValue) => setValue(data);

  const onChangeEmailField = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailFields((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onOpenEmailModal = () => setIsMailModalOpen(true);
  const onSendEmail = async () => {
    if (!emailFields.recipientEmail) {
      // toast(<p className="text-red-600">Please enter a recipient email address</p>);
      return;
    }

    setIsLoading(true);
    const emailContent = editor.getEmail(value);

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailFields.recipientEmail,
          subject: emailFields.subjectEmail,
          html: emailContent,
          RESEND_API_KEY: emailFields.RESEND_API_KEY,
        }),
      });

      if (response.ok) {
        // toast(
        //   <p>
        //     Email sent successfully! Check your inbox at <b>{emailFields.recipientEmail}</b> for the email you just
        //     sent.
        //   </p>,
        // );
      } else {
        // toast(<p className="text-red-600">Failed to send email. Please try again.</p>);
      }

      setIsMailModalOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      // toast(<p className="text-red-600">Error sending email. Please try again.</p>);
    } finally {
      setIsLoading(false);
    }
  };

  const onCopy = () => {
    const emailString = editor.getEmail(value);
    copy(emailString);
    console.log('emailString', emailString);
    // toast(<p>Email content copied to clipboard</p>);
  };

  return (
    <div className="w-full p-10">
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-2xl font-bold">Yoopta Email-Builder Playground</h1>
        <p className="text-sm text-gray-500">
          This is live example of how to use the Email Builder from{' '}
          <code>
            <a
              href="https://github.com/Darginec05/Yoopta-Editor/tree/master/packages/core/email-builder"
              target="_blank"
              rel="noreferrer"
              className="underline">
              @yoopta/email-builder
            </a>{' '}
          </code>{' '}
          package.
        </p>
        <div className="w-auto mt-2">
          <Button onClick={onOpenEmailModal} className="mr-1" variant="default">
            Test Email <MailWarningIcon size={16} className="ml-2" />
          </Button>
          <Button onClick={onCopy} className="mr-1 m-1" variant="secondary">
            Copy email html <CopyIcon size={16} className="ml-2" />
          </Button>
          <Button asChild className="ml-1" variant="outline">
            <a
              href="https://yoodocs.space/yoopta-editor/yoopta/email-builder-_hZvTkSNoI?v=1.0.0&lang=en"
              target="_blank"
              rel="noreferrer">
              Full Docs <ExternalLinkIcon size={16} className="ml-2" />
            </a>
          </Button>
        </div>
      </div>
      <Separator />
      <Dialog open={isMailModalOpen} onOpenChange={setIsMailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please fill in these fields to test</DialogTitle>
            <DialogDescription>
              We use <b>Resend</b>, so you will need to get the <u>RESEND_API_KEY</u> for the test.
              You can create token using{' '}
              <a
                className="text-[#007aff] underline"
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noreferrer">
                this link
              </a>
              . Then copy the <u>RESEND_API_KEY</u> and paste it in the field below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col">
            <div className="my-1">
              <Label>Resend key</Label>
              <Input
                type="text"
                name="RESEND_API_KEY"
                value={emailFields.RESEND_API_KEY}
                onChange={onChangeEmailField}
                placeholder="RESEND_API_KEY"
                className="p-2 mb-2"
              />
            </div>
            <div className="my-1">
              <Label>Recipient Email</Label>
              <Input
                type="text"
                name="recipientEmail"
                value={emailFields.recipientEmail}
                onChange={onChangeEmailField}
                placeholder="Your email"
                className="p-2 mb-2"
              />
            </div>
            <div className="my-1">
              <Label>Subject of email</Label>
              <Input
                type="text"
                name="subjectEmail"
                value={emailFields.subjectEmail}
                onChange={onChangeEmailField}
                placeholder="Subject"
                className="p-2 mb-2"
              />
            </div>
            <Button type="button" disabled={isLoading} onClick={onSendEmail}>
              {isLoading ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div>
        <EmailBuilder
          editor={editor}
          value={value}
          onChange={onChange}
          media={{
            image: {
              upload: mediaUploaders.onImageUpload,
            },
            video: {
              upload: mediaUploaders.onVideoUpload,
              uploadPoster: mediaUploaders.onVideoUploadPoster,
            },
            file: {
              upload: mediaUploaders.onFileUpload,
            },
          }}
        />
      </div>
    </div>
  );
};

export { EmailExample };
