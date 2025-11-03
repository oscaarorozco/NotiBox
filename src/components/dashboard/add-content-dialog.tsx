
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
import type { ContentItem, ContentItemType, CardAspect, TodoItem } from "@/lib/types";
import { readFileAsDataURL, cn } from "@/lib/utils";
import { FileText, Link, ImageIcon, ListTodo, Plus, Trash2, Settings2, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

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
  
  const [selectedType, setSelectedType] = useState<ContentItemType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [tasks, setTasks] = useState<TodoItem['tasks']>([]);
  const [icon, setIcon] = useState('');
  const [aspect, setAspect] = useState<CardAspect>('default');
  const [newTaskText, setNewTaskText] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!itemToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditing && itemToEdit) {
        setSelectedType(itemToEdit.type);
        setTitle(itemToEdit.title);
        setTags(itemToEdit.tags.join(', '));
        setIcon(itemToEdit.icon || '');
        setAspect(itemToEdit.aspect || 'default');
        
        switch(itemToEdit.type) {
            case 'note':
                setContent(itemToEdit.content);
                break;
            case 'link':
            case 'image':
                setUrl(itemToEdit.url);
                break;
            case 'todo':
                setTasks(itemToEdit.tasks);
                break;
        }
      } else {
        setSelectedType(null);
        setTitle('');
        setContent('');
        setUrl('');
        setTags('');
        setTasks([]);
        setIcon('');
        setAspect('default');
        setNewTaskText("");
      }
    }
  }, [isOpen, itemToEdit, isEditing]);
  
  const handleTypeChange = (type: ContentItemType) => {
    setSelectedType(type);
  }
  
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
    if (selectedType !== 'image') return;
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
    const newTasks = [...tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }];
    setTasks(newTasks);
    setNewTaskText("");
  };

  const handleToggleTask = (id: string) => {
    const newTasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    setTasks(newTasks);
  };
  
  const handleDeleteTask = (id: string) => {
      const newTasks = tasks.filter(task => task.id !== id);
      setTasks(newTasks);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    const targetGroupId = isEditing ? itemToEdit!.groupId : (activeGroupId || defaultGroupId);
    if (!title || !targetGroupId || !selectedType) return;

    const commonData = {
      title,
      icon,
      aspect,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      groupId: targetGroupId,
    };
    
    let itemData;

    switch (selectedType) {
      case 'note': itemData = { ...commonData, type: 'note', content }; break;
      case 'link': itemData = { ...commonData, type: 'link', url }; break;
      case 'image': itemData = { ...commonData, type: 'image', url }; break;
      case 'todo': itemData = { ...commonData, type: 'todo', tasks }; break;
      default: return;
    }
    
    if (isEditing) {
        updateItem({ ...itemToEdit, ...itemData } as ContentItem);
    } else {
        addItem(itemData as Omit<ContentItem, 'id' | 'createdAt' | 'accessCount' | 'lastAccessed'>);
    }

    setIsOpen(false);
  };
  
  const FormFieldWrapper = ({ label, htmlFor, children, fullWidth = false }: { label: string, htmlFor: string, children: ReactNode, fullWidth?: boolean }) => (
    <div className={cn("grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4", fullWidth && "sm:grid-cols-1")}>
      <Label htmlFor={htmlFor} className="text-left sm:text-right sm:pt-2">
        {label}
      </Label>
      <div className={cn("col-span-1", fullWidth ? "sm:col-span-1" : "sm:col-span-3")}>{children}</div>
    </div>
  );
  
  const renderFormFields = () => (
    <form id="add-content-form" onSubmit={handleSubmit} className="space-y-4">
        <Accordion type="multiple" defaultValue={['item-details']} className="w-full">
            <AccordionItem value="item-details">
                <AccordionTrigger className="text-base font-semibold">
                    <div className="flex items-center gap-2">
                        <Settings2 className="h-5 w-5" />
                        <span>Detalles Principales</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                    <FormFieldWrapper label="Título" htmlFor="title">
                        <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </FormFieldWrapper>

                    {selectedType === "note" && (
                    <FormFieldWrapper label="Contenido" htmlFor="content" fullWidth>
                        <Textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[200px]" placeholder="Escribe tu nota aquí..." />
                    </FormFieldWrapper>
                    )}
                    {selectedType === "link" && (
                        <FormFieldWrapper label="URL" htmlFor="url">
                            <Input id="url" name="url" value={url} onChange={(e) => setUrl(e.target.value)} />
                        </FormFieldWrapper>
                    )}
                    {selectedType === "image" && (
                        <FormFieldWrapper label="Imagen" htmlFor="image-file">
                            <div className="grid gap-2">
                                <Input id="image-file" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
                                {url ? (
                                     <img src={url} alt="Vista previa" className="mt-2 max-h-40 rounded-md object-contain border border-border" />
                                ) : (
                                    <Textarea 
                                        placeholder="O pega la imagen aquí" 
                                        className="h-20" 
                                        onPaste={handlePaste} 
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                )}
                            </div>
                        </FormFieldWrapper>
                    )}
                    {selectedType === "todo" && (
                        <FormFieldWrapper label="Tareas" htmlFor="new-task-input">
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input id="new-task-input" placeholder="Nueva tarea..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTask(); } }}/>
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
                        </FormFieldWrapper>
                    )}
                    <FormFieldWrapper label="Etiquetas" htmlFor="tags">
                        <Input id="tags" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Etiquetas separadas por comas" />
                    </FormFieldWrapper>
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
                    <FormFieldWrapper label="Icono" htmlFor="icon-name">
                        <Input id="icon" name="icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Ej: folder, home, lightbulb" />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Aspecto" htmlFor="aspect-default">
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
                    </FormFieldWrapper>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </form>
  )
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Contenido' : 'Agregar Nuevo Contenido'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica los detalles de tu elemento.' : (selectedType ? 'Rellena los detalles de tu nuevo elemento.' : 'Selecciona un tipo de contenido para agregar.')}
          </DialogDescription>
        </DialogHeader>
        
        {!selectedType && !isEditing ? (
             <div className="grid grid-cols-2 gap-4 py-4">
                {contentTypes.map(({ type, label, icon: Icon }) => (
                    <div key={type} onClick={() => handleTypeChange(type)} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent hover:border-primary/50 transition-all text-center border rounded-lg">
                        <Icon className="h-8 w-8 text-primary" />
                        <span className="font-semibold">{label}</span>
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid gap-4 py-4">
                {renderFormFields()}
            </div>
        )}

        <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            {selectedType && <Button type="submit" form="add-content-form">{isEditing ? 'Guardar Cambios' : 'Agregar'}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
