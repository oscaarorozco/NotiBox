"use client";

import { useState, useRef, ReactNode, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContentStore } from "@/hooks/use-content-store.tsx";
import type { ContentItem, ContentItemType } from "@/lib/types";
import { readFileAsDataURL } from "@/lib/utils";

type AddContentDialogProps = {
    trigger: ReactNode;
    itemToEdit?: ContentItem;
}

export function AddContentDialog({ trigger, itemToEdit }: AddContentDialogProps) {
  const { activeGroupId, addItem, updateItem } = useContentStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const isEditing = !!itemToEdit;
  
  const [type, setType] = useState<ContentItemType>("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setTitle(itemToEdit?.title || "");
        setType(itemToEdit?.type || "note");
        setContent(itemToEdit?.type === 'note' ? itemToEdit.content : "");
        setUrl(itemToEdit?.type === 'link' || itemToEdit?.type === 'image' ? itemToEdit.url : "");
        setTags(itemToEdit?.tags.join(", ") || "");
    }
  }, [isOpen, itemToEdit])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setUrl(dataUrl);
      } catch (error) {
        console.error("Error al leer el archivo", error);
      }
    }
  };
  
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (type !== 'image') return;
    const items = e.clipboardData.items;
    for (const index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        if(blob){
          const dataUrl = await readFileAsDataURL(blob);
          setUrl(dataUrl);
        }
      }
    }
  };

  const handleSubmit = () => {
    if (!title || !activeGroupId) return;

    const commonData = {
      title,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      groupId: activeGroupId,
    };
    
    let itemData;

    switch (type) {
      case 'note':
        itemData = { ...commonData, type: 'note', content };
        break;
      case 'link':
        itemData = { ...commonData, type: 'link', url };
        break;
      case 'image':
        itemData = { ...commonData, type: 'image', url };
        break;
      default:
        return;
    }
    
    if (isEditing) {
        updateItem({ ...itemToEdit, ...itemData } as ContentItem);
    } else {
        addItem(itemData as Omit<ContentItem, 'id' | 'createdAt' | 'accessCount' | 'lastAccessed'>);
    }

    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Contenido' : 'Agregar Nuevo Contenido'}</DialogTitle>
          <DialogDescription>
            Rellena los detalles para tu nuevo elemento de contenido.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Tipo</Label>
            <Select value={type} onValueChange={(value) => setType(value as ContentItemType)} disabled={isEditing}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona el tipo de contenido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Nota</SelectItem>
                <SelectItem value="link">Enlace</SelectItem>
                <SelectItem value="image">Imagen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          {type === "note" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">Contenido</Label>
              <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" />
            </div>
          )}
          {type === "link" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">URL</Label>
              <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="col-span-3" />
            </div>
          )}
          {type === "image" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image-file" className="text-right">Imagen</Label>
              <div className="col-span-3 grid gap-2">
                <Input id="image-file" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
                <Textarea placeholder="O pega la imagen aquí" className="h-20" onPaste={handlePaste}/>
                {url && <img src={url} alt="Vista previa" className="mt-2 max-h-40 rounded-md object-contain border border-border" />}
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">Etiquetas</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="col-span-3" placeholder="Etiquetas separadas por comas" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? 'Guardar Cambios' : 'Agregar'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
