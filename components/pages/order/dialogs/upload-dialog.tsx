'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUploadFiles } from '@/hooks/api/useOrderData';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Description } from '@radix-ui/react-dialog';

import ui from '@/app/data/ui.json';

interface FormValues {
  file: FileList | null;
  imageFromClipboard: string | null;
  category: string;
  number: string;
}

interface UploadDialogProps {
  dialog: boolean;
  trigger: () => void;
  fetchSalesData: () => void;
  number: string;
}

export function UploadDialog({
  dialog,
  trigger,
  fetchSalesData,
  number,
}: UploadDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      file: null,
      imageFromClipboard: null,
      category: 'sale',
      number,
    },
  });

  const file = watch('file');
  const imageFromClipboard = watch('imageFromClipboard');
  const hasImage = !!file || !!imageFromClipboard;

  const uploadMutation = useUploadFiles(Number(number));

  // Form submission handling
  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const formDataToSend = new FormData();

    if (selectedFile) {
      formDataToSend.append('file', selectedFile);
    }

    if (formData.imageFromClipboard) {
      formDataToSend.append('imageFromClipboard', formData.imageFromClipboard);
    }

    formDataToSend.append('category', formData.category);
    formDataToSend.append('number', formData.number);

    // Check if there is anything to upload
    if (!selectedFile && !formData.imageFromClipboard) {
      return;
    }

    uploadMutation.mutate(formDataToSend, {
      onSuccess: () => {
        trigger();
        fetchSalesData();
        handleClearForm();
      },
    });
  };

  // Handle file change through input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    processImageFile(file);
  };

  // Handle pasting image from clipboard
  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          processImageFile(file, true);
          break;
        }
      }
    }
  };

  // Function to read and process image file
  const processImageFile = (file: File, isFromClipboard = false) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);

      if (isFromClipboard) {
        setValue('imageFromClipboard', result);
        setSelectedFile(null);
        setValue('file', null);
      } else {
        setSelectedFile(file);
        setValue('imageFromClipboard', null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle paste button click
  const handlePasteButtonClick = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const item of clipboardItems) {
        if (
          item.types.includes('image/png') ||
          item.types.includes('image/jpeg')
        ) {
          const imageType =
            item.types.find((type) => type.startsWith('image/')) || 'image/png';
          const blob = await item.getType(imageType);
          processImageFile(
            new File([blob], 'clipboard-image.png', { type: imageType }),
            true
          );
          break;
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  };

  // Clear form
  const handleClearForm = () => {
    reset({
      file: null,
      imageFromClipboard: null,
      category: 'sale',
      number,
    });
    setImagePreview(null);
    setSelectedFile(null);
  };

  return (
    <Dialog open={dialog} onOpenChange={trigger}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent onPaste={handlePaste} className="max-w-md">
        <DialogHeader>
          <DialogTitle>{ui.global.upload_files}</DialogTitle>
          <Description />
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('category')} value="sale" />
          <input type="hidden" {...register('number')} value={number} />

          {!hasImage && (
            <div className="space-y-2">
              <Label htmlFor="file-upload">
                {ui.global.select_file_to_upload} *
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                {...register('file', { required: !imageFromClipboard })}
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {errors.file && (
                <span className="text-red-500 text-sm">
                  {ui.global.field_required}
                </span>
              )}
            </div>
          )}

          {imagePreview && (
            <div className="space-y-2">
              <Label>{ui.global.image_preview}</Label>
              <div className="border rounded-md p-2 bg-gray-50">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-w-full h-auto mx-auto"
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 justify-between">
            {!hasImage && (
              <Button
                type="button"
                onClick={handlePasteButtonClick}
                variant="outline">
                {ui.global.paste_from_clipboard}
              </Button>
            )}

            {hasImage && (
              <Button type="button" onClick={handleClearForm} variant="outline">
                {ui.global.clear_form}
              </Button>
            )}

            <Button
              type="submit"
              disabled={!hasImage || uploadMutation.isPending}>
              {uploadMutation.isPending
                ? ui.global.uploading || 'Uploading...'
                : ui.global.upload}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
