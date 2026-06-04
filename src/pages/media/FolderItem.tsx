import { Folder as FolderIcon, MoreVertical, Edit2, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Folder } from "@/redux/features/folders"

interface FolderItemProps {
  folder: Folder
  onDoubleClick: (folder: Folder) => void
  onRename: (folder: Folder) => void
  onDelete: (folder: Folder) => void
}

export function FolderItem({
  folder,
  onDoubleClick,
  onRename,
  onDelete,
}: FolderItemProps) {
  return (
    <div
      onDoubleClick={() => onDoubleClick(folder)}
      className="group relative flex flex-col items-center justify-center rounded-xl p-4 transition-all hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border/50"
    >
      <div className="relative mb-2">
        <FolderIcon
          className="h-16 w-16 text-yellow-400 fill-yellow-400 drop-shadow-sm transition-transform group-hover:scale-105"
          strokeWidth={1}
        />
        {/* The 3-dot menu */}
        <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="rounded-full bg-background p-1.5 shadow-sm hover:bg-accent border border-border">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onRename(folder)
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(folder)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <span className="w-full truncate text-center text-sm font-medium text-foreground select-none px-2">
        {folder.name}
      </span>
    </div>
  )
}
