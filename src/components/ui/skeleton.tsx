import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-shimmer bg-[linear-gradient(110deg,#334155,45%,#5E728B,55%,#334155)] bg-[length:200%_100%] rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
