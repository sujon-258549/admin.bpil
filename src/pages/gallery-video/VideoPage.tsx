import { useState } from "react";
import { Play, Plus, Trash2, Video as VideoIcon } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Can,
  ConfirmDialog,
  DataTable,
  DataTableColumnsButton,
  DataTableToolbar,
  EmptyState,
  IconBadge,
  Image,
  PageHeader,
  Text,
  type Column,
  PageMeta,
} from "@/components/shared";
import { useDebounce } from "@/hooks/use-debounce";
import { useVideo } from "@/hooks/data-fetch/use-video";
import type { Video } from "@/redux/features/videos";
import { getErrorMessage } from "@/lib/errors";
import { shortId } from "@/lib/format";
import { VideoFormModal } from "./components/VideoFormModal";
import { VideoPreviewModal } from "./components/VideoPreviewModal";

export default function VideoPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 350);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { videos, meta, isFetching, isLoading, deleteVideo, toggleVideoStatus } =
    useVideo({ page, limit, searchTerm: debounced || undefined });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Video | null>(null);
  const [previewing, setPreviewing] = useState<Video | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (v: Video) => {
    setEditing(v);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const res = await deleteVideo(pendingDelete.id).unwrap();
      if (res?.success) {
        toast.success(res.message || "Video deleted");
      }
      setPendingDelete(null);
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to delete video"));
    }
  };

  const onToggle = async (id: string) => {
    try {
      const res = await toggleVideoStatus(id).unwrap();
      if (res?.success) {
        toast.success(res.message || "Status updated");
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err, "Failed to update status"));
    }
  };

  const columns: Column<Video>[] = [
    {
      key: "title",
      header: "Title",
      cell: (v) => (
        <div className="flex items-center gap-3">
          {v.posterId ? (
            <Image
              imageId={v.posterId}
              alt={v.title}
              preview
              className="h-10 w-16 flex-shrink-0 rounded-md object-cover ring-1 ring-border shadow-sm"
            />
          ) : (
            <IconBadge icon={VideoIcon} />
          )}
          <div className="min-w-0">
            <div className="truncate font-medium">{v.title}</div>
            <Text size="xs" tone="muted">
              {shortId(v.id)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "youtubeId",
      header: "YouTube ID",
      cell: (v) => (
        <a
          href={`https://youtube.com/watch?v=${v.youtubeId}`}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline font-mono text-sm"
        >
          {v.youtubeId}
        </a>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (v) => v.category || "—",
    },
    {
      key: "duration",
      header: "Duration",
      cell: (v) => v.duration || "—",
    },
    {
      key: "status",
      header: "Status",
      cell: (v) => (
        <Switch
          checked={v.isActive}
          onCheckedChange={() => onToggle(v.id)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (v) => (
        <div className="flex justify-end gap-1">
          <Button
            size="icon-sm"
            variant="default"
            onClick={() => setPreviewing(v)}
            aria-label="Preview"
            className="border border-gray-300"
          >
            <Play className="ml-0.5" />
          </Button>
          <Can module="gallery_video.video" action="update">
            <Button
              size="icon-sm"
              variant="default"
              onClick={() => openEdit(v)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="gallery_video.video" action="delete">
            <Button
              size="icon-sm"
              variant="destructive"
              onClick={() => setPendingDelete(v)}
              aria-label="Delete"
              className="border border-gray-300"
            >
              <Trash2 />
            </Button>
          </Can>
        </div>
      ),
    },
  ];

  const [visibleColumns, setVisibleColumns] =
    useState<Column<Video>[]>(columns);

  return (
    <div className="space-y-6">
      <PageMeta title="Videos" description="Manage Videos" />
      <PageHeader
        title="Videos"
        description="Manage YouTube videos shown in the gallery."
        actions={
          <Can module="gallery_video.video" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4 mr-2" /> Add Video
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search videos..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="videos"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<Video>
        data={videos}
        columns={visibleColumns}
        isLoading={isLoading && videos.length === 0}
        isFetching={isFetching}
        meta={meta}
        onPageChange={setPage}
        onPageSizeChange={(newSize) => {
          setLimit(newSize);
          setPage(1);
        }}
        empty={
          <EmptyState
            icon={VideoIcon}
            title="No videos yet."
            action={
              <Can module="gallery_video.video" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4 mr-2" /> Add Video
                </Button>
              </Can>
            }
          />
        }
      />

      <VideoFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete video?"
        description={`This will permanently remove "${pendingDelete?.title ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />

      {previewing && (
        <VideoPreviewModal
          video={previewing}
          onClose={() => setPreviewing(null)}
        />
      )}
    </div>
  );
}
