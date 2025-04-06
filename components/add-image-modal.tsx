"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { X, Upload, Link2, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function AddImageModal() {
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [caption, setCaption] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleUrlPreview = () => {
    if (imageUrl) {
      setPreviewUrl(imageUrl)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()])
      }
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSaveImage = async () => {
    setIsLoading(true)

    // Here you would implement the actual API call to save the image
    // Example:
    // const formData = new FormData()
    // if (uploadedFile) {
    //   formData.append('image', uploadedFile)
    // } else {
    //   formData.append('imageUrl', imageUrl)
    // }
    // formData.append('ownerName', ownerName)
    // formData.append('caption', caption)
    // formData.append('tags', JSON.stringify(tags))

    // const response = await fetch('/api/images', {
    //   method: 'POST',
    //   body: formData
    // })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    resetForm()
    setOpen(false)
  }

  const resetForm = () => {
    setImageUrl("")
    setPreviewUrl("")
    setOwnerName("")
    setCaption("")
    setTags([])
    setCurrentTag("")
    setUploadedFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Add New Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Image</DialogTitle>
          <DialogDescription>Add an image from another creator to your collection.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="url" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Image URL</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 pt-4">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="self-end">
                <Button variant="outline" onClick={handleUrlPreview} disabled={!imageUrl}>
                  Preview
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <Input id="image-upload" type="file" accept="image/*" onChange={handleFileUpload} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="owner-name">Original Creator</Label>
              <Input
                id="owner-name"
                placeholder="@username or creator name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Write a caption for this image..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (press Enter to add)</Label>
              <Input
                id="tags"
                placeholder="Add tags..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border rounded-md p-2">
            {previewUrl ? (
              <div className="relative aspect-square w-full">
                <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover rounded-md" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground">
                <Link2 className="h-12 w-12 mb-2" />
                <p>Image preview will appear here</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveImage} disabled={!previewUrl || !ownerName || isLoading}>
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Image
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

