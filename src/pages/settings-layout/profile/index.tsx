import { ContentHeader } from '@/components/custom/content-header';
import { Divider } from '@/components/custom/divider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRoundIcon } from 'lucide-react';
import { ProfileForm } from './components/profile-form';
import { Button } from '@/components/ui/button';
import { ChangePasswordModal } from './components/change-password-modal';
import { CircleUserRoundIcon, XIcon } from "lucide-react"

import { useFileUpload } from "@/hooks/use-file-upload"

export const Profile = () => {
  const [
    { files, isDragging },
      {
        removeFile,
        openFileDialog,
        getInputProps,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
      },
    ] = useFileUpload({
      accept: "image/*",
    })

    const previewUrl = files[0]?.preview || "/images/avatar-content.jpg"


  return (
    <>
      <ChangePasswordModal />
      <ContentHeader
        title="Profile"
        description="Edit personal details, and account security"
      />
      <div className="flex flex-col">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-1 w-full">
            <span className="text-base font-medium text-popover-foreground">
              Profile Picture
            </span>
            <span className="text-sm text-muted-foreground">
              We only support PNGs, JPEGs and GIFs under 5MB
            </span>
          </div>

          <div className="relative inline-flex">
            {/* Drop area */}
            <button
              className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-12 items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none"
              onClick={openFileDialog}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              data-dragging={isDragging || undefined}
              aria-label={previewUrl ? "Change image" : "Upload image"}
            >
              {previewUrl ? (
                <img
                  className="size-full object-cover"
                  src={previewUrl}
                  alt={files[0]?.file?.name || "Uploaded image"}
                  width={32}
                  height={32}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div aria-hidden="true">
                  <CircleUserRoundIcon className="size-4 opacity-60" />
                </div>
              )}
            </button>
            {previewUrl && (
              <Button
                onClick={() => removeFile(files[0]?.id)}
                size="icon"
                className="border-background focus-visible:border-background absolute -top-1 -right-1 size-5 rounded-full border-2 shadow-none"
                aria-label="Remove image"
              >
                <XIcon className="size-3" />
              </Button>
            )}
            <input
              {...getInputProps()}
              className="sr-only"
              aria-label="Upload image file"
              tabIndex={-1}
            />
          </div>

         


        </div>
        <Divider size="large" />
        <ProfileForm />
        <Divider size="large" />
        <div className="flex pt-14">
          <div className="flex flex-col md:flex-row p-4 gap-4 items-start md:items-center bg-card-solid rounded-2xl">
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium text-destructive">
                Delete Account
              </span>
              <span className="text-base font-normal text-foreground/70">
                Deleting your account is permanent. You will no longer be able
                to create an account with this email.
              </span>
            </div>
            <Button variant="destructive" className="cursor-pointer">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
