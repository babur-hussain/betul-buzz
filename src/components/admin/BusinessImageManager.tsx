import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Image as ImageIcon, X, Eye, Star, Trash2, Download, RotateCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BusinessImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  is_primary: boolean;
  is_featured: boolean;
  uploaded_at: string;
  alt_text?: string;
}

interface BusinessImageManagerProps {
  businessId: string;
  businessName: string;
  onImagesChange?: (images: BusinessImage[]) => void;
}

const BusinessImageManager: React.FC<BusinessImageManagerProps> = ({
  businessId,
  businessName,
  onImagesChange
}) => {
  const [images, setImages] = useState<BusinessImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<BusinessImage | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages: BusinessImage[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.error(`File ${file.name} is not an image`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          console.error(`File ${file.name} is too large (max 5MB)`);
          continue;
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${businessId}_${Date.now()}_${i}.${fileExt}`;
        const filePath = `business-images/${businessId}/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('business-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error(`Error uploading ${file.name}:`, error);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('business-images')
          .getPublicUrl(filePath);

        // Create image record
        const newImage: BusinessImage = {
          id: `img_${Date.now()}_${i}`,
          url: urlData.publicUrl,
          filename: fileName,
          size: file.size,
          type: file.type,
          is_primary: images.length === 0, // First image becomes primary
          is_featured: false,
          uploaded_at: new Date().toISOString(),
          alt_text: file.name.replace(/\.[^/.]+$/, '') // Remove extension for alt text
        };

        uploadedImages.push(newImage);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Update images state
      const updatedImages = [...images, ...uploadedImages];
      setImages(updatedImages);
      onImagesChange?.(updatedImages);

      // Save to database
      await saveImagesToDatabase(uploadedImages);

    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const saveImagesToDatabase = async (newImages: BusinessImage[]) => {
    try {
      const { error } = await supabase
        .from('business_images')
        .insert(newImages.map(img => ({
          business_id: businessId,
          url: img.url,
          filename: img.filename,
          size: img.size,
          type: img.type,
          is_primary: img.is_primary,
          is_featured: img.is_featured,
          alt_text: img.alt_text
        })));

      if (error) throw error;
    } catch (error) {
      console.error('Error saving images to database:', error);
    }
  };

  const setPrimaryImage = async (imageId: string) => {
    try {
      const updatedImages = images.map(img => ({
        ...img,
        is_primary: img.id === imageId
      }));

      setImages(updatedImages);
      onImagesChange?.(updatedImages);

      // Update in database
      await supabase
        .from('business_images')
        .update({ is_primary: false })
        .eq('business_id', businessId);

      await supabase
        .from('business_images')
        .update({ is_primary: true })
        .eq('id', imageId);

    } catch (error) {
      console.error('Error setting primary image:', error);
    }
  };

  const toggleFeaturedImage = async (imageId: string) => {
    try {
      const updatedImages = images.map(img => ({
        ...img,
        is_featured: img.id === imageId ? !img.is_featured : img.is_featured
      }));

      setImages(updatedImages);
      onImagesChange?.(updatedImages);

      // Update in database
      const image = images.find(img => img.id === imageId);
      if (image) {
        await supabase
          .from('business_images')
          .update({ is_featured: !image.is_featured })
          .eq('id', imageId);
      }

    } catch (error) {
      console.error('Error toggling featured image:', error);
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const image = images.find(img => img.id === imageId);
      if (!image) return;

      // Delete from storage
      const filePath = `business-images/${businessId}/${image.filename}`;
      await supabase.storage
        .from('business-images')
        .remove([filePath]);

      // Delete from database
      await supabase
        .from('business_images')
        .delete()
        .eq('id', imageId);

      // Update local state
      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      onImagesChange?.(updatedImages);

      // If primary image was deleted, set first remaining image as primary
      if (image.is_primary && updatedImages.length > 0) {
        await setPrimaryImage(updatedImages[0].id);
      }

    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const downloadImage = async (image: BusinessImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Image Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Label htmlFor="image-upload" className="cursor-pointer">
              <span className="text-lg font-medium text-gray-700">
                Click to upload images
              </span>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, GIF up to 5MB each
              </p>
            </Label>
            <Input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Uploading images...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Images Grid */}
          {images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Uploaded Images ({images.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors">
                      <img
                        src={image.url}
                        alt={image.alt_text || image.filename}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedImage(image);
                              setShowImagePreview(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => downloadImage(image)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteImage(image.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="absolute top-2 left-2 flex flex-col space-y-1">
                        {image.is_primary && (
                          <Badge className="bg-blue-500 text-white text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                        {image.is_featured && (
                          <Badge className="bg-yellow-500 text-white text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {image.alt_text || image.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(image.size)}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-2 flex justify-center space-x-1">
                      {!image.is_primary && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPrimaryImage(image.id)}
                          className="text-xs"
                        >
                          Set Primary
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleFeaturedImage(image.id)}
                        className={`text-xs ${image.is_featured ? 'bg-yellow-100 text-yellow-800' : ''}`}
                      >
                        {image.is_featured ? 'Featured' : 'Feature'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription>
              {selectedImage?.alt_text || selectedImage?.filename}
            </DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.alt_text || selectedImage.filename}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Filename:</strong> {selectedImage.filename}
                </div>
                <div>
                  <strong>Size:</strong> {formatFileSize(selectedImage.size)}
                </div>
                <div>
                  <strong>Type:</strong> {selectedImage.type}
                </div>
                <div>
                  <strong>Uploaded:</strong> {new Date(selectedImage.uploaded_at).toLocaleDateString()}
                </div>
                <div>
                  <strong>Primary:</strong> {selectedImage.is_primary ? 'Yes' : 'No'}
                </div>
                <div>
                  <strong>Featured:</strong> {selectedImage.is_featured ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowImagePreview(false)}>
                  Close
                </Button>
                <Button onClick={() => downloadImage(selectedImage)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessImageManager;
