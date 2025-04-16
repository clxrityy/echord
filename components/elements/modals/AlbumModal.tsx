import { DialogProps, Dialog } from "@/components/ui/Dialog";
import { Suspense } from "react";


interface AlbumModalProps extends DialogProps {
  albumId: string;
}

export function AlbumModal({
  onClose,
  open,
  albumId,
}: AlbumModalProps) {

  return (
    <Suspense>
        <Dialog
          open={open}
          onClose={onClose}
          title={"Album"}
        >
          {albumId}
        </Dialog>
    </Suspense>
  )
}
