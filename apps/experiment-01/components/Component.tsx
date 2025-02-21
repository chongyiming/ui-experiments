"use client";

import { useCharacterLimit } from "@/components/ui/use-character-limit";
import { useImageUpload } from "@/components/ui/use-image-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, ImagePlus, X } from "lucide-react";
import { useId, useState, useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import { supabase } from "../app/supabaseClient";

function Component({
  isOpen,
  onClose,
  images,
  username,
  firstName,
  lastName,
  ren,
}: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  username: string;
  firstName: string;
  lastName: string;
  ren: boolean | "indeterminate";
}) {
  const id = useId();

  const maxLength = 180;
  const {
    value: bio,
    characterCount,
    handleChange: handleBioChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
  });

  const [localFirstName, setLocalFirstName] = useState(firstName);
  const [localLastName, setLocalLastName] = useState(lastName);
  const [localUsername, setLocalUsername] = useState(username);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isRenChecked, setIsRenChecked] = useState<boolean | "indeterminate">(
    ren
  );
  const [userId, setUserId] = useState("");

  // Sync local state with props when they change
  useEffect(() => {
    setLocalFirstName(firstName);
    setLocalLastName(lastName);
    setLocalUsername(username);
    setIsRenChecked(ren);
  }, [firstName, lastName, username, ren]);

  useEffect(() => {
    const authToken = localStorage.getItem(
      "sb-velfmvmemrzurdweumyo-auth-token"
    );

    if (authToken) {
      try {
        const parsedToken = JSON.parse(authToken);
        setUserId(parsedToken?.user?.id);
      } catch (error) {
        console.error("Error parsing auth token:", error);
      }
    } else {
      console.error("Auth token not found in localStorage");
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Log image file details
    if (imageFile) {
      console.log("Image File:", imageFile);
      console.log("Image URL:", URL.createObjectURL(imageFile));
    } else {
      console.log("No image uploaded.");
    }

    try {
      // Call uploadInfo to update the agent's data
      await uploadInfo();
      console.log("Data updated successfully.");
    } catch (error) {
      console.error("Error updating data:", error);
    }

    // Optionally, you can close the dialog after submission
    // onClose();
    window.location.reload(); // Refresh the page
  };

  async function uploadInfo() {
    try {
      // Update the existing record where user_id matches
      const { data: updatedData, error: updateError } = await supabase
        .from("Agents")
        .update({
          first_name: localFirstName,
          last_name: localLastName,
          username: localUsername,
          ren: isRenChecked,
        })
        .eq("user_id", userId);

      if (updateError) {
        throw new Error(updateError.message);
      }

      console.log("Data", updatedData);
      return updatedData;
    } catch (error) {
      console.error("Error updating info:", error);
      throw error;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            Edit profile
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your profile here. You can change your photo and set a
          username.
        </DialogDescription>
        <div className="overflow-y-auto">
          <Avatar
            defaultImage={images.length > 0 ? images[0] : "./profile.jpg"}
            onImageChange={(file) => setImageFile(file)}
          />
          <div className="px-6 pb-6 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${id}-first-name`}>First name</Label>
                  <Input
                    id={`${id}-first-name`}
                    placeholder="First Name"
                    value={localFirstName}
                    onChange={(e) => setLocalFirstName(e.target.value)}
                    type="text"
                    required
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`${id}-last-name`}>Last name</Label>
                  <Input
                    id={`${id}-last-name`}
                    placeholder="Last Name"
                    value={localLastName}
                    onChange={(e) => setLocalLastName(e.target.value)}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${id}-username`}>Username</Label>
                <div className="relative">
                  <Input
                    id={`${id}-username`}
                    className="peer pe-9"
                    placeholder="Username"
                    value={localUsername}
                    onChange={(e) => setLocalUsername(e.target.value)}
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${id}-ren-checkbox`}
                    checked={isRenChecked}
                    onCheckedChange={(checked) => setIsRenChecked(checked)}
                    aria-label="REN"
                  />
                  <Label htmlFor={`${id}-ren-checkbox`}>REN</Label>
                </div>
              </div>
              <DialogFooter className="border-t border-border px-6 py-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Avatar({
  defaultImage,
  onImageChange,
}: {
  defaultImage?: string;
  onImageChange: (file: File) => void;
}) {
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } =
    useImageUpload();

  const currentImage = previewUrl || defaultImage;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file); // Pass the uploaded file to the parent component
      handleFileChange(event); // Handle the file upload logic
    }
  };

  return (
    <div className="px-6">
      <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted shadow-sm shadow-black/10">
        {currentImage && (
          <img
            src={currentImage}
            className="h-full w-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <button
          type="button"
          className="absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-offset-2 transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
          onClick={handleThumbnailClick}
          aria-label="Change profile picture"
        >
          <ImagePlus size={16} strokeWidth={2} aria-hidden="true" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}

export { Component };
