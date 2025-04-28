"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function ImagesPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [photos, setPhotos] = useState<{ id: number; url: string; alt: string }[]>([]);
  const [seriesList, setSeriesList] = useState<{ id: number; name: string }[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch user's series and photos on mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch series
        const seriesResponse = await fetch("/api/series");
        const seriesData = await seriesResponse.json();
        if (seriesData.series) {
          setSeriesList(seriesData.series);
        }

        // Fetch photos
        const photosResponse = await fetch("/api/photos");
        const photosData = await photosResponse.json();
        if (photosData.photos) {
          setPhotos(
            photosData.photos.map((photo: any) => ({
              id: photo.id,
              url: photo.url,
              alt: photo.caption || `Photo ${photo.id}`,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load series or photos.");
      }
    }
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setError(null);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.url) {
        // Create a Photo record
        const photoResponse = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: data.url, caption: "Uploaded photo" }),
        });
        const photoData = await photoResponse.json();
        if (photoData.photo) {
          setPhotos((prev) => [
            ...prev,
            {
              id: photoData.photo.id,
              url: photoData.photo.url,
              alt: photoData.photo.caption || `Photo ${photoData.photo.id}`,
            },
          ]);
        } else {
          setError(photoData.error || "Failed to save photo.");
        }
      } else {
        setError(data.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("An error occurred while uploading the image.");
    }
  };

  const handlePostNow = async () => {
    if (!selectedImage) {
      setError("Please select an image.");
      return;
    }
    if (!caption.trim()) {
      setError("Please enter a caption.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsPosting(true);

    try {
      const photo = photos.find((p) => p.id === selectedImage);
      if (!photo || photo.url.includes("placeholder.svg")) {
        setError("Please upload a valid image.");
        return;
      }

      const response = await fetch("/api/instagram/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          imageUrl: photo.url,
          seriesId: selectedSeries || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Post published successfully!");
        // Reset form
        setCaption("");
        setSelectedImage(null);
        setSelectedSeries("");
      } else {
        setError(data.error || "Failed to publish post.");
      }
    } catch (err) {
      console.error("Error publishing post:", err);
      setError("An error occurred while publishing the post.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Post to Instagram</h1>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">1. Upload and Select Image</h2>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} className="mb-4">
              Upload Image
            </Button>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={cn(
                    "relative aspect-square cursor-pointer rounded-md overflow-hidden border-2",
                    selectedImage === photo.id ? "border-primary" : "border-transparent"
                  )}
                  onClick={() => setSelectedImage(photo.id)}
                >
                  <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">2. Select Series (Optional)</h2>
            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger>
                <SelectValue placeholder="Select a series" />
              </SelectTrigger>
              <SelectContent>
                {seriesList.map((series) => (
                  <SelectItem key={series.id} value={series.id.toString()}>
                    {series.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">3. Write Caption</h2>
            <Textarea
              placeholder="Write your caption here..."
              className="min-h-[120px]"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">4. Preview</h2>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=32&width=32"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <span className="font-medium">your_instagram_handle</span>
                </div>

                <div className="relative aspect-square mb-3">
                  {selectedImage ? (
                    <Image
                      src={photos.find(p => p.id === selectedImage)?.url || "/placeholder.svg"}
                      alt="Selected image"
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-muted-foreground">Select an image</p>
                    </div>
                  )}
                </div>

                {caption && (
                  <p className="text-sm mb-2">{caption}</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => router.push('/schedule')}>
              Schedule Instead
            </Button>
            <Button onClick={handlePostNow} disabled={isPosting}>
              {isPosting ? "Posting..." : "Post Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}