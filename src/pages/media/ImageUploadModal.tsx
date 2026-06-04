import { useState, useRef, useEffect } from "react"
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useFolder } from "@/hooks/data-fetch/use-folder"
import { Image } from "@/components/shared"

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  currentFolderId: string
}

interface FileStatus {
  file: File
  preview: string
  status: "pending" | "uploading" | "success" | "error"
  errorMsg?: string
}

export function ImageUploadModal({ isOpen, onClose, currentFolderId }: ImageUploadModalProps) {
  const { uploadImage } = useFolder()
  const [files, setFiles] = useState<FileStatus[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview)
      })
    }
  }, [files])

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFiles([])
      setIsUploading(false)
    }
  }, [isOpen])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      
      const newFileStatuses: FileStatus[] = selectedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: "pending"
      }))
      
      setFiles((prev) => [...prev, ...newFileStatuses])
      
      // Reset input so the same files can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUpload = async () => {
    const pendingFiles = files.filter(f => f.status === "pending" || f.status === "error")
    if (pendingFiles.length === 0) return

    setIsUploading(true)
    
    let hasError = false;

    // We update the main state directly by referencing indexes
    // Sequential upload ensures we don't spam the server
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending" && files[i].status !== "error") continue

      // Mark as uploading
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "uploading" } : f))
      
      const formData = new FormData()
      formData.append("file", files[i].file)
      if (currentFolderId !== "root") {
        formData.append("folderId", currentFolderId)
      }

      try {
        await uploadImage(formData).unwrap()
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: "success" } : f))
      } catch (err: any) {
        console.error("Upload failed for file", files[i].file.name, err)
        hasError = true;
        setFiles(prev => prev.map((f, idx) => idx === i ? { 
          ...f, 
          status: "error", 
          errorMsg: err?.data?.message || "Upload failed" 
        } : f))
      }
    }
    
    setIsUploading(false)

    // Auto-close if all uploads succeeded
    if (!hasError) {
      setTimeout(() => {
        onClose()
      }, 800) // slight delay to let user see 100% progress
    }
  }

  // Calculate progress
  const totalFiles = files.length
  const completedFiles = files.filter(f => f.status === "success" || f.status === "error").length
  const progressPercentage = totalFiles === 0 ? 0 : Math.round((completedFiles / totalFiles) * 100)

  // Check if everything is successfully uploaded
  const isAllComplete = totalFiles > 0 && files.every(f => f.status === "success")
  
  const handleClose = () => {
    if (isUploading) return // Prevent closing while uploading
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!w-[95vw] !max-w-[95vw] !h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            Select multiple images to upload. They will be uploaded one by one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 flex flex-col flex-1 overflow-hidden">
          {/* File input & Drag drop zone trigger */}
          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isUploading ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'hover:bg-muted/50 border-muted-foreground/30 hover:border-primary/50'
            }`}
          >
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Click to select files</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect} 
              accept="image/*"
              multiple
              disabled={isUploading}
            />
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="border rounded-md flex flex-col min-h-0 flex-1">
              <div className="bg-muted px-4 py-2 flex items-center justify-between text-sm font-medium border-b shrink-0">
                <span>Selected Files ({files.length})</span>
                {totalFiles > 0 && (
                  <span className="text-xs text-muted-foreground">{completedFiles} / {totalFiles} processed</span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {files.map((fileStatus, idx) => (
                    <div key={idx} className="flex items-center gap-3 border p-2 rounded-md">
                      <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                        <Image 
                          src={fileStatus.preview} 
                          alt="preview" 
                          preview={true}
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{fileStatus.file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(fileStatus.file.size)}</p>
                        {fileStatus.status === "error" && (
                          <p className="text-xs text-destructive mt-0.5">{fileStatus.errorMsg}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {fileStatus.status === "pending" && !isUploading && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(idx)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {fileStatus.status === "uploading" && (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        )}
                        {fileStatus.status === "success" && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                        {fileStatus.status === "error" && (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {(isUploading || completedFiles > 0) && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Upload Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose} 
            disabled={isUploading}
          >
            {isAllComplete ? "Close" : "Cancel"}
          </Button>
          
          {!isAllComplete && (
            <Button 
              onClick={handleUpload} 
              disabled={isUploading || files.filter(f => f.status === "pending" || f.status === "error").length === 0}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Start Upload
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
