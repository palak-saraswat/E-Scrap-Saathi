'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Image } from 'lucide-react';

export default function AddScrapPage() {
  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">📸 Scan Your Scrap</h1>
        <p className="text-sm text-zinc-600 mt-1">Upload photos and let AI analyze</p>
      </div>

      <Card className="border-2 border-dashed border-green-300 bg-green-50">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <Camera className="h-16 w-16 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Take a Photo</h2>
            <p className="text-sm text-zinc-600 mt-1">
              Capture your e-waste material for instant AI analysis
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 h-12">
            <Camera className="h-4 w-4 mr-2" />
            Open Camera
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold text-zinc-900">Or Upload from Gallery</h3>
        <Card>
          <CardContent className="p-4 text-center space-y-3">
            <Image className="h-12 w-12 text-zinc-400 mx-auto" />
            <Button variant="outline" className="w-full h-10">
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">💡 Pro Tip</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900">
          Clear photos with good lighting help our AI identify materials better and
          suggest higher prices!
        </CardContent>
      </Card>
    </div>
  );
}
