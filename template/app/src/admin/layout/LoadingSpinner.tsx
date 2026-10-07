export function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center py-16"
      role="status"
      aria-label="Loading"
    >
      <div className="border-muted border-t-foreground size-7 animate-spin rounded-full border-2" />
    </div>
  );
}
