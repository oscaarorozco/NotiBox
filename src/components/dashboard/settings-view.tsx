"use client";

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/hooks/use-content-store";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import type { AppData } from '@/lib/types';

export function SettingsView() {
  const { exportData, importData } = useContentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const jsonData = JSON.parse(content) as AppData;
            importData(jsonData);
          }
        } catch (error) {
          console.error("Error parsing imported file:", error);
          toast({
            title: "Import Error",
            description: "The selected file is not a valid JSON backup.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input to allow re-uploading the same file
    event.target.value = '';
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export your data or import a previous backup.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <h3 className="font-semibold">Export Data</h3>
              <p className="text-sm text-muted-foreground">Download all your groups, content, and stats as a JSON file.</p>
            </div>
            <Button onClick={exportData}>Export</Button>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <h3 className="font-semibold">Import Data</h3>
              <p className="text-sm text-muted-foreground">
                Import data from a previously exported JSON file.
                <strong className="block text-destructive">Warning: This will overwrite all your current data.</strong>
              </p>
            </div>
            <Button variant="outline" onClick={handleImportClick}>Import</Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
