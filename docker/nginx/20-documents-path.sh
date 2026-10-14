#!/bin/sh
# MAQ_DOCUMENTS_PATH is a path inside the container. /mnt/documents is the host documents directory.
set -eu
mount_dir=${MAQ_DOCUMENTS_PATH:-/mnt/documents}
public_dir=/usr/share/nginx/html/documents
case "$mount_dir" in
  /mnt|/mnt/*) ;;
  *) exit 0 ;;
esac
if [ ! -d "$mount_dir" ]; then
  exit 0
fi
if [ -z "$(find "$mount_dir" -mindepth 1 -print -quit 2>/dev/null)" ]; then
  exit 0
fi
rm -rf "$public_dir"
ln -s "$mount_dir" "$public_dir"
