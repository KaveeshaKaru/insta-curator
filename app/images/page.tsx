"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, GripVertical, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult, type DroppableProvided, type DraggableProvided } from "@hello-pangea/dnd";

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
    <div className="flex h-screen">
      <Toaster />
      <LoadingDialog isOpen={isPosting} message={loadingMessage} />
      {/* Left sidebar is handled by the layout component */}

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Post to Instagram</h1>

        <div className="grid gap-6 grid-cols-[1fr,350px]">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">1. Upload Images (Max 10)</h2>
                <span className="text-sm text-muted-foreground">
                  {selectedImages.length}/10 images selected
                </span>
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
                  {(provided: DroppableProvided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto p-1"
                    >
                      {selectedImages.map((photo, index) => (
                        <Draggable key={photo.id} draggableId={photo.id.toString()} index={index}>
                          {(provided: DraggableProvided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="relative aspect-square rounded-md overflow-hidden border-2 border-primary group"
                            >
                              <div {...provided.dragHandleProps} className="absolute top-2 left-2 z-10">
                                <GripVertical className="h-5 w-5 text-white opacity-75" />
                              </div>
                              <button
                                onClick={() => handleRemoveImage(photo.id)}
                                className="absolute top-2 right-2 z-10 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">2. Select Series (Optional)</h2>
              <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                <SelectTrigger className="w-[300px]">
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
              <h2 className="text-lg font-medium mb-4">3. Write Caption</h2>
              <div className="relative">
                <Textarea
                  placeholder="Write your caption here..."
                  className="min-h-[120px] max-h-[120px] resize-none w-[600px] pr-24"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={isEnhancing}
                  aria-busy={isEnhancing}
                  aria-label="Instagram caption input"
                />
                {isEnhancing && (
                  <div className="absolute inset-0 bg-gray-100/60 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
                  </div>
                )}
                <button
                  type="button"
                  className={cn(
                    "absolute bottom-2 right-2 flex items-center gap-1 text-sm transition-colors",
                    isEnhancing
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-muted-foreground hover:text-primary cursor-pointer"
                  )}
                  onClick={isEnhancing ? undefined : enhanceCaption}
                  disabled={isEnhancing}
                  aria-label={isEnhancing ? "Enhancing caption" : "Enhance caption with AI"}
                >
                  <span>{isEnhancing ? "Enhancing...😉" : "AI caption"}</span>
                  {isEnhancing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">4. Preview</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <InstagramUsername />
                </div>

                <div className="relative aspect-square mb-2">
                  {selectedImages.length > 0 ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={selectedImages[0].url}
                        alt="First selected image"
                        fill
                        className="object-cover rounded"
                      />
                      {selectedImages.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                          +{selectedImages.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-muted-foreground">Select images</p>
                    </div>
                  )}
                </div>

                {caption && (
                  <p className="text-sm mb-2">{caption}</p>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => router.push('/schedule')} className="flex-1">
                Schedule Instead
              </Button>
              <Button onClick={handlePostNow} disabled={isPosting} className="flex-1">
                {isPosting ? "Posting..." : "Post Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}