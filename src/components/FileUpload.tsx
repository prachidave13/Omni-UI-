import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Check, AlertCircle } from "lucide-react";
import { validateFileType } from "@/lib/utils/file";
import { ALLOWED_FILE_TYPES } from "@/lib/constants/file";

interface FileUploadProps {
  onUpload?: (files: File[]) => void;
  className?: string;
  children?: React.ReactNode;
  allowedTypes?: Array<keyof typeof ALLOWED_FILE_TYPES>;
}

const FileUpload = ({
  onUpload,
  className,
  children,
  allowedTypes = ["model"],
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const allowedExtensions = allowedTypes.flatMap(
        (type) => ALLOWED_FILE_TYPES[type],
      );

      const invalidFiles = acceptedFiles.filter(
        (file) => !validateFileType(file, allowedExtensions),
      );

      if (invalidFiles.length > 0) {
        setError(
          `Unsupported file type. Allowed types: ${allowedExtensions.join(", ")}`,
        );
        return;
      }

      setError("");
      setUploadedFiles(acceptedFiles);
      if (onUpload) {
        onUpload(acceptedFiles);
      }
    },
    [onUpload, allowedTypes],
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
          : error
            ? "border-red-500/40 bg-red-500/5"
            : uploadedFiles.length > 0
              ? "border-green-500/40 bg-green-500/5"
              : "hover:border-purple-500/40",
        className,
      )}
    >
      <input {...getInputProps()} />
      {error ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-red-500">{error}</p>
          <p className="text-sm text-red-500/60">
            Try again with supported file types
          </p>
        </div>
      ) : uploadedFiles.length > 0 ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-green-500">
            {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}{" "}
            uploaded
          </p>
          <p className="text-sm text-green-500/60">Click or drag to replace</p>
        </div>
      ) : (
        children || (
          <>
            <p className="text-purple-400 mb-2">Click to select file(s)...</p>
            <p className="text-sm text-purple-400/60">OR</p>
            <p className="text-purple-400 mt-2">Drag and drop</p>
          </>
        )
      )}
    </div>
  );
};

export default FileUpload;
