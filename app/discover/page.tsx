import { ImageDiscovery } from "@/components/image-discovery"

export default function DiscoverPage() {
  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
      </div>

      <ImageDiscovery />
    </div>
  )
}

