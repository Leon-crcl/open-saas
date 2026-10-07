import { FormEvent, useEffect, useState } from "react";
import {
  addFileToDb,
  createFileUploadUrl,
  deleteFile,
  getAllFilesByUser,
  getDownloadFileSignedURL,
  useQuery,
} from "wasp/client/operations";
import type { File } from "wasp/entities";

import { Download, FileText, Trash2, UploadCloud } from "lucide-react";
import { Alert, AlertDescription } from "../client/components/ui/alert";
import { Button } from "../client/components/ui/button";
import { EmptyState } from "../client/components/layout/EmptyState";
import { PageHeader } from "../client/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { Skeleton } from "../client/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../client/components/ui/dialog";
import { Input } from "../client/components/ui/input";
import { Label } from "../client/components/ui/label";
import { Progress } from "../client/components/ui/progress";
import { toast } from "../client/hooks/use-toast";
import { cn } from "../client/utils";
import { uploadFileWithProgress, validateFile } from "./fileUploading";
import { ALLOWED_FILE_TYPES } from "./validation";

export function FileUploadPage() {
  const [fileKeyForS3, setFileKeyForS3] = useState<File["s3Key"]>("");
  const [uploadProgressPercent, setUploadProgressPercent] = useState<number>(0);
  const [fileToDelete, setFileToDelete] = useState<Pick<
    File,
    "id" | "s3Key" | "name"
  > | null>(null);

  const allUserFiles = useQuery(getAllFilesByUser, undefined, {
    // We disable automatic refetching because otherwise files would be refetched after `createFile` is called and the S3 URL is returned,
    // which happens before the file is actually fully uploaded. Instead, we manually (re)fetch on mount and after the upload is complete.
    enabled: false,
  });
  const { isLoading: isDownloadUrlLoading, refetch: refetchDownloadUrl } =
    useQuery(
      getDownloadFileSignedURL,
      { s3Key: fileKeyForS3 },
      { enabled: false },
    );

  useEffect(() => {
    allUserFiles.refetch();
  }, [allUserFiles]);

  useEffect(() => {
    if (fileKeyForS3.length > 0) {
      refetchDownloadUrl()
        .then((urlQuery) => {
          switch (urlQuery.status) {
            case "error":
              console.error("Error fetching download URL", urlQuery.error);
              toast({
                title: "Error fetching download link",
                description: "Please try again later.",
                variant: "destructive",
              });
              return;
            case "success":
              window.open(urlQuery.data, "_blank");
              return;
          }
        })
        .finally(() => {
          setFileKeyForS3("");
        });
    }
  }, [fileKeyForS3, refetchDownloadUrl]);

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const formElement = e.target;
      if (!(formElement instanceof HTMLFormElement)) {
        throw new Error("Event target is not a form element");
      }

      const formData = new FormData(formElement);
      const formDataFileUpload = formData.get("file-upload");

      if (
        !formDataFileUpload ||
        !(formDataFileUpload instanceof File) ||
        formDataFileUpload.size === 0
      ) {
        toast({
          title: "No file selected",
          description: "Please select a file to upload.",
          variant: "destructive",
        });
        return;
      }

      const file = validateFile(formDataFileUpload);

      const { s3UploadUrl, s3UploadFields, s3Key } = await createFileUploadUrl({
        fileType: file.type,
        fileName: file.name,
      });

      await uploadFileWithProgress({
        file,
        s3UploadUrl,
        s3UploadFields,
        setUploadProgressPercent,
      });

      await addFileToDb({
        s3Key,
        fileType: file.type,
        fileName: file.name,
      });

      formElement.reset();
      allUserFiles.refetch();
      toast({
        title: "File uploaded",
        description: "Your file has been successfully uploaded.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error uploading file.";
      toast({
        title: "Error uploading file",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploadProgressPercent(0);
    }
  };

  const handleDelete = async ({ id, name }: Pick<File, "id" | "name">) => {
    try {
      await deleteFile({ id });
      toast({
        title: "File deleted",
        description: (
          <span>
            File <strong>{name}</strong> deleted.
          </span>
        ),
      });
      allUserFiles.refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting file.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setFileToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="Documents"
          description="Keep contracts, certificates and quotes next to your supplier analysis. Files are stored privately and only you can access them."
        />
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Upload a file</CardTitle>
              <p className="text-muted-foreground text-sm">
                Choose a file from your device.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="file-upload"
                    className="text-foreground text-sm font-medium"
                  >
                    Select a file
                  </Label>
                  <Input
                    type="file"
                    id="file-upload"
                    name="file-upload"
                    accept={ALLOWED_FILE_TYPES.join(",")}
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={uploadProgressPercent > 0}
                    className="w-full"
                  >
                    <UploadCloud />
                    {uploadProgressPercent > 0
                      ? `Uploading ${uploadProgressPercent}%`
                      : "Upload"}
                  </Button>
                  {uploadProgressPercent > 0 && (
                    <Progress
                      value={uploadProgressPercent}
                      className="w-full"
                    />
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Your files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allUserFiles.isLoading && (
                <div
                  className="space-y-2"
                  role="status"
                  aria-label="Loading files"
                >
                  <Skeleton className="h-14" />
                  <Skeleton className="h-14" />
                </div>
              )}
              {allUserFiles.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Error: {allUserFiles.error.message}
                  </AlertDescription>
                </Alert>
              )}
              {!!allUserFiles.data &&
              allUserFiles.data.length > 0 &&
              !allUserFiles.isLoading ? (
                <ul className="space-y-2">
                  {allUserFiles.data.map((file: File) => (
                    <li
                      key={file.s3Key}
                      className={cn(
                        "border-border bg-background flex items-center gap-3 rounded-lg border px-3 py-2.5",
                        {
                          "opacity-70":
                            file.s3Key === fileKeyForS3 && isDownloadUrlLoading,
                        },
                      )}
                    >
                      <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
                        <FileText className="size-4" aria-hidden="true" />
                      </span>
                      <p className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => setFileKeyForS3(file.s3Key)}
                          disabled={
                            file.s3Key === fileKeyForS3 && isDownloadUrlLoading
                          }
                          variant="ghost"
                          size="icon"
                          aria-label={`Download ${file.name}`}
                        >
                          <Download />
                        </Button>
                        <Button
                          onClick={() => setFileToDelete(file)}
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${file.name}`}
                          className="hover:text-destructive"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                !allUserFiles.isLoading && (
                  <EmptyState
                    icon={FileText}
                    title="No files yet"
                    description="Files you upload will show up here."
                  />
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {fileToDelete && (
        <Dialog
          open={!!fileToDelete}
          onOpenChange={(isOpen) => !isOpen && setFileToDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete file</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <strong>{fileToDelete.name}</strong>? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFileToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(fileToDelete)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
