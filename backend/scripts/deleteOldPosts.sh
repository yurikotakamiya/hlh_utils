#!/bin/bash

# Base data directory
BASE_DIR="/home/ubuntu/my-apps/hlh_utils/data"
# Retention period (in days)
RETENTION_DAYS=4

# Iterate over subdirectories (ilbe-comments, ilbe-images, ilbe-meta, ilbe-posts)
for subdir in "$BASE_DIR"/*; do
    if [ -d "$subdir" ]; then
        echo "Processing $subdir..."
        
        # Find and delete folders older than RETENTION_DAYS
        find "$subdir" -mindepth 1 -maxdepth 1 -type d -mtime +$RETENTION_DAYS -exec echo "Deleting: {}" \; -exec rm -rf {} \;
    else
        echo "Skipping $subdir: Not a directory."
    fi
done

echo "Cleanup completed."
