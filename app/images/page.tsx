"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, GripVertical, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import InstagramUsername from "@/components/InstagramUsername";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { LoadingDialog } from "@/components/ui/loading-dialog";

export default function ImagesPage() {
  const [selectedImages, setSelectedImages] = useState<{ id: number; url: string; alt: string }[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [sessionPhotos, setSessionPhotos] = useState<{ id: number; url: string; alt: string }[]>([]);
  const [seriesList, setSeriesList] = useState<{ id: number; name: string }[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Function to enhance caption
  const enhanceCaption = useCallback(async () => {
    if (!caption.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a caption to enhance."
      });
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch("/api/enhance-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });

      const data = await response.json();
      if (data.enhancedCaption) {
        setCaption(data.enhancedCaption);
        toast({
          title: "Success",
          description: "Caption enhanced successfully!"
        });
      }
    } catch (err) {
      console.error("Error enhancing caption:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while enhancing the caption."
      });
    } finally {
      setIsEnhancing(false);
    }
  }, [caption, toast]);

  // Only fetch series on mount, not photos
  useEffect(() => {
    async function fetchSeries() {
      try {
        const seriesResponse = await fetch("/api/series");
        const seriesData = await seriesResponse.json();
        if (seriesData.series) {
          setSeriesList(seriesData.series);
        }
      } catch (err) {
        console.error("Error fetching series:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load series."
        });
      }
    }
    fetchSeries();
  }, [toast]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the 10 image limit
    if (selectedImages.length + files.length > 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You can only upload up to 10 images for a carousel post."
      });
      return;
    }

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (data.url) {
          const photoResponse = await fetch("/api/photos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: data.url, caption: "Uploaded photo" }),
          });
          const photoData = await photoResponse.json();

          if (photoData.photo) {
            const newPhoto = {
              id: photoData.photo.id,
              url: photoData.photo.url,
              alt: photoData.photo.caption || `Photo ${photoData.photo.id}`,
            };
            setSessionPhotos((prev) => [...prev, newPhoto]);
            setSelectedImages((prev) => [...prev, newPhoto]);
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: photoData.error || "Failed to save photo."
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.error || "Failed to upload image."
          });
        }
      } catch (err) {
        console.error("Error uploading image:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while uploading the image."
        });
      }
    }
  };

  const handleRemoveImage = (imageId: number) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedImages(items);
  };

  const handlePostNow = async () => {
    if (selectedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one image.🥹"
      });
      return;
    }
    if (!caption.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a caption.🤓"
      });
      return;
    }

    setIsPosting(true);
    setLoadingMessage("Publishing your post to Instagram... 📱✨");

    try {
      const response = await fetch("/api/instagram/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          images: selectedImages.map(img => img.url),
          seriesId: selectedSeries || null,
          isCarousel: selectedImages.length > 1
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Post published successfully 🥰 !"
        });
        // Reset form and remove the posted images
        setCaption("");
        setSelectedImages([]);
        setSelectedSeries("");
        setSessionPhotos(prev => prev.filter(p => !selectedImages.some(si => si.id === p.id)));
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to publish post 😔."
        });
      }
    } catch (err) {
      console.error("Error publishing post:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while publishing the post 🤕 ."
      });
    } finally {
      setIsPosting(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <Toaster />
      <LoadingDialog isOpen={isPosting} message={loadingMessage} />

      <h1 className="text-3xl font-bold tracking-tight mb-8">Post to Instagram</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upload */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">1. Upload Images (Max 10)</h2>
              <span className="text-sm text-muted-foreground">{selectedImages.length}/10 selected</span>
            </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
                variant="secondary"
                disabled={selectedImages.length >= 10}
              >
              Upload Images
            </Button>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="images" direction="horizontal">
                {provided => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {selectedImages.map((photo, index) => (
                      <Draggable key={photo.id} draggableId={photo.id.toString()} index={index}>
                        {provided => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="relative aspect-square rounded-md overflow-hidden border group"
                          >
                            <div {...provided.dragHandleProps} className="absolute top-1 left-1 z-10">
                              <GripVertical className="h-4 w-4 text-white opacity-75" />
                            </div>
                            <button
                              onClick={() => handleRemoveImage(photo.id)}
                              className="absolute top-1 right-1 z-10 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="h-4 w-4 text-white" />
                            </button>
                            <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </section>

          {/* Series */}
          <section>
            <h2 className="text-lg font-semibold mb-2">2. Select Series (Optional)</h2>
            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a series" />
              </SelectTrigger>
              <SelectContent>
                {seriesList.map(series => (
                  <SelectItem key={series.id} value={series.id.toString()}>
                    {series.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* Caption */}
          <section>
            <h2 className="text-lg font-semibold mb-2">3. Write Caption</h2>
            <div className="relative w-full max-w-3xl">
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption here..."
                className="min-h-[120px] resize-none pr-24"
                disabled={isEnhancing}
              />
              {isEnhancing && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                </div>
              )}
              <button
                type="button"
                className={cn(
                  "absolute bottom-2 right-2 text-sm flex items-center gap-1",
                  isEnhancing ? "text-muted-foreground cursor-not-allowed" : "hover:text-primary"
                )}
                onClick={isEnhancing ? undefined : enhanceCaption}
                disabled={isEnhancing}
              >
                <span>{isEnhancing ? "Enhancing...😉" : "AI caption"}</span>
                  {isEnhancing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
              </button>
            </div>
          </section>
        </div>

        {/* Right section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">4. Preview</h2>
          <Card>
            <CardContent className="p-4 space-y-2">
              <InstagramUsername />
              <div className="relative aspect-square">
                {selectedImages.length ? (
                  <Image src={selectedImages[0].url} alt="Preview" fill className="rounded object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                    <p className="text-sm text-muted-foreground">No image selected</p>
                  </div>
                )}
                {selectedImages.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    +{selectedImages.length - 1}
                  </div>
                )}
              </div>
              {caption && <p className="text-sm">{caption}</p>}
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/schedule")} className="flex-1">
              Schedule Instead
            </Button>
            <Button onClick={handlePostNow} disabled={isPosting} className="flex-1">
              {isPosting ? "Posting..." : "Post Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
