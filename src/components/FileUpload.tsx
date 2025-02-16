import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  className?: string;
  children?: React.ReactNode;
}

const FileUpload = ({ onUpload, className, children }: FileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onUpload) {
        onUpload(acceptedFiles);
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-purple-900/20 rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-purple-500 bg-purple-500/5"
          : "hover:border-purple-500/40",
        className,
      )}
    >
      <input {...getInputProps()} />
      {children || (
        <>
          <p className="text-purple-400 mb-2">Click to select file(s)...</p>
          <p className="text-sm text-purple-400/60">OR</p>
          <p className="text-purple-400 mt-2">Drag and drop</p>
        </>
      )}
    </div>
  );
};

export default FileUpload;
