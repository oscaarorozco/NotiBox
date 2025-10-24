"use client";

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContentStore } from "@/hooks/use-content-store.tsx";
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
          console.error("Error al analizar el archivo importado:", error);
          toast({
            title: "Error de Importación",
            description: "El archivo seleccionado no es una copia de seguridad JSON válida.",
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
          <CardTitle>Gestión de Datos</CardTitle>
          <CardDescription>Exporta tus datos o importa una copia de seguridad anterior.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <h3 className="font-semibold">Exportar Datos</h3>
              <p className="text-sm text-muted-foreground">Descarga todos tus grupos, contenido y estadísticas como un archivo JSON.</p>
            </div>
            <Button onClick={exportData}>Exportar</Button>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <h3 className="font-semibold">Importar Datos</h3>
              <p className="text-sm text-muted-foreground">
                Importa datos desde un archivo JSON previamente exportado.
                <strong className="block text-destructive">Advertencia: Esto sobrescribirá todos tus datos actuales.</strong>
              </p>
            </div>
            <Button variant="outline" onClick={handleImportClick}>Importar</Button>
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
