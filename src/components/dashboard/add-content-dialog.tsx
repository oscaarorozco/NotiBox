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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useContentStore } from "@/hooks/use-content-store";
import type { ContentItem, ContentItemType, CardAspect } from "@/lib/types";
import { readFileAsDataURL, cn } from "@/lib/utils";
import { FileText, Link, ImageIcon, ListTodo, Plus, Trash2, Settings2, Palette, BrainCircuit } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { IconPicker } from "../icon-picker";

type AddContentDialogProps = {
    trigger: ReactNode;
    itemToEdit?: ContentItem;
    defaultGroupId?: string;
}

const contentTypes: { type: ContentItemType, label: string, icon: React.FC<any> }[] = [
    { type: 'note', label: 'Nota', icon: FileText },
    { type: 'link', label: 'Enlace', icon: Link },
    { type: 'image', label: 'Imagen', icon: ImageIcon },
    { type: 'todo', label: 'Lista de Tareas', icon: ListTodo },
];

export function AddContentDialog({ trigger, itemToEdit, defaultGroupId }: AddContentDialogProps) {
  const { activeGroupId, addItem, updateItem } = useContentStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(false);

  const isEditing = !!itemToEdit;
  
  const [type, setType] = useState<ContentItemType>("note");
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [aspect, setAspect] = useState<CardAspect>('default');
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        if (isEditing && itemToEdit) {
            setTitle(itemToEdit.title || "");
            setType(itemToEdit.type);
            setIcon(itemToEdit.icon);
            setAspect(itemToEdit.aspect || 'default');
            setTags(itemToEdit.tags.join(", ") || "");
            switch(itemToEdit.type) {
                case 'note': setContent(itemToEdit.content); break;
                case 'link':
                case 'image': setUrl(itemToEdit.url); break;
                case 'todo': setTasks(itemToEdit.tasks); break;
            }
            setSelectedType(true);
        } else {
            setSelectedType(false);
            setTitle("");
            setType("note");
            setIcon(undefined);
            setAspect('default');
            setContent("");
            setUrl("");
            setTags("");
            setTasks([]);
            setNewTaskText("");
        }
    }
  }, [isOpen, itemToEdit, isEditing]);

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

  const handleAddTask = () => {
    if(newTaskText.trim() === '') return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }]);
    setNewTaskText("");
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };
  
  const handleDeleteTask = (id: string) => {
      setTasks(tasks.filter(task => task.id !== id));
  }

  const handleSubmit = () => {
    const targetGroupId = isEditing ? itemToEdit.groupId : (activeGroupId || defaultGroupId);
    if (!title || !targetGroupId) return;

    const commonData = {
      title,
      icon,
      aspect,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      groupId: targetGroupId,
    };
    
    let itemData;

    switch (type) {
      case 'note': itemData = { ...commonData, type, content }; break;
      case 'link': itemData = { ...commonData, type, url }; break;
      case 'image': itemData = { ...commonData, type, url }; break;
      case 'todo': itemData = { ...commonData, type, tasks }; break;
      default: return;
    }
    
    if (isEditing) {
        updateItem({ ...itemToEdit, ...itemData } as ContentItem);
    } else {
        addItem(itemData as Omit<ContentItem, 'id' | 'createdAt' | 'accessCount' | 'lastAccessed'>);
    }

    setIsOpen(false);
  };

  const handleSelectType = (selectedType: ContentItemType) => {
    setType(selectedType);
    setSelectedType(true);
  }
  
  const renderFormFields = () => (
    <Accordion type="multiple" defaultValue={['item-details']} className="w-full">
        <AccordionItem value="item-details">
            <AccordionTrigger className="text-base font-semibold">
                <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5" />
                    <span>Detalles Principales</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Título</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                </div>
                {type === "note" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="content" className="text-right">Contenido</Label>
                    <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3 min-h-32" />
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
                {type === "todo" && (
                    <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Tareas</Label>
                    <div className="col-span-3 space-y-3">
                        <div className="flex gap-2">
                            <Input placeholder="Nueva tarea..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} />
                            <Button type="button" size="icon" onClick={handleAddTask}><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {tasks.map(task => (
                                <div key={task.id} className="flex items-center gap-2 group">
                                    <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => handleToggleTask(task.id)} />
                                    <label htmlFor={`task-${task.id}`} className={cn("flex-1 text-sm", task.completed && "line-through text-muted-foreground")}>{task.text}</label>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteTask(task.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tags" className="text-right">Etiquetas</Label>
                    <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="col-span-3" placeholder="Etiquetas separadas por comas" />
                </div>
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-appearance">
            <AccordionTrigger className="text-base font-semibold">
                 <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    <span>Ajustes de Apariencia</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Icono</Label>
                    <div className="col-span-3">
                        <IconPicker value={icon} onChange={setIcon} />
                    </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Aspecto</Label>
                    <div className="col-span-3">
                        <RadioGroup value={aspect} onValueChange={(v) => setAspect(v as CardAspect)} className="flex flex-col sm:flex-row gap-4">
                            <div>
                                <RadioGroupItem value="default" id="aspect-default" className="sr-only"/>
                                <Label htmlFor="aspect-default">
                                    <Card className={cn("cursor-pointer", aspect === 'default' && "border-primary ring-2 ring-primary")}>
                                        <CardContent className="p-3">
                                            <p className="font-semibold text-sm">Default</p>
                                            <p className="text-xs text-muted-foreground">Estilo estándar.</p>
                                        </CardContent>
                                    </Card>
                                </Label>
                            </div>
                             <div>
                                <RadioGroupItem value="highlighted" id="aspect-highlighted" className="sr-only"/>
                                <Label htmlFor="aspect-highlighted">
                                     <Card className={cn("cursor-pointer border-primary/50", aspect === 'highlighted' && "border-primary ring-2 ring-primary")}>
                                        <CardContent className="p-3">
                                            <p className="font-semibold text-sm text-primary">Destacado</p>
                                            <p className="text-xs text-muted-foreground">Resaltar elemento.</p>
                                        </CardContent>
                                    </Card>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="minimalist" id="aspect-minimalist" className="sr-only"/>
                                <Label htmlFor="aspect-minimalist">
                                     <Card className={cn("cursor-pointer bg-transparent shadow-none border-dashed", aspect === 'minimalist' && "border-primary ring-2 ring-primary")}>
                                        <CardContent className="p-3">
                                            <p className="font-semibold text-sm">Minimalista</p>
                                            <p className="text-xs text-muted-foreground">Diseño simple.</p>
                                        </CardContent>
                                    </Card>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    </Accordion>
  )
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Contenido' : 'Agregar Nuevo Contenido'}</DialogTitle>
          <DialogDescription>
            {!selectedType && !isEditing ? 'Selecciona el tipo de contenido que quieres agregar.' : 'Rellena los detalles para tu nuevo elemento de contenido.'}
          </DialogDescription>
        </DialogHeader>

        {!selectedType && !isEditing && (
             <div className="grid grid-cols-2 gap-4 py-4">
                {contentTypes.map(({ type, label, icon: Icon }) => (
                    <Card key={type} onClick={() => handleSelectType(type)} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent hover:border-primary/50 transition-all text-center">
                        <Icon className="h-8 w-8 text-primary" />
                        <span className="font-semibold">{label}</span>
                    </Card>
                ))}
            </div>
        )}

        {selectedType && (
            <div className="grid gap-4 py-4">
                {renderFormFields()}
            </div>
        )}

        <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            {selectedType && <Button onClick={handleSubmit}>{isEditing ? 'Guardar Cambios' : 'Agregar'}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
