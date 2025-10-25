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
import type { ContentItem, ContentItemType, CardAspect, TodoItem, NoteItem, LinkItem, ImageItem } from "@/lib/types";
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

type FormData = {
    type: ContentItemType;
    title: string;
    icon?: string;
    aspect: CardAspect;
    content: string;
    url: string;
    tags: string;
    tasks: TodoItem['tasks'];
};

const getInitialFormData = (item?: ContentItem): FormData => {
    const defaults = {
        type: "note" as ContentItemType,
        title: "",
        icon: undefined,
        aspect: 'default' as CardAspect,
        content: "",
        url: "",
        tags: "",
        tasks: [],
    };

    if (!item) return defaults;

    return {
        type: item.type,
        title: item.title,
        icon: item.icon,
        aspect: item.aspect || 'default',
        content: item.type === 'note' ? (item as NoteItem).content : "",
        url: (item.type === 'link' || item.type === 'image') ? (item as LinkItem | ImageItem).url : "",
        tags: item.tags.join(', '),
        tasks: item.type === 'todo' ? (item as TodoItem).tasks : [],
    };
};


export function AddContentDialog({ trigger, itemToEdit, defaultGroupId }: AddContentDialogProps) {
  const { activeGroupId, addItem, updateItem } = useContentStore();
  const [isOpen, setIsOpen] = useState(false);
  const isEditingItem = !!itemToEdit;
  
  const [formData, setFormData] = useState<FormData>(() => getInitialFormData(itemToEdit));
  const [selectedType, setSelectedType] = useState<ContentItemType | null>(itemToEdit?.type || null);

  const [newTaskText, setNewTaskText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const initialData = getInitialFormData(itemToEdit);
      setFormData(initialData);
      setSelectedType(itemToEdit?.type || null);
      setNewTaskText("");
    }
  }, [isOpen, itemToEdit]);

  const handleInputChange = (field: keyof Omit<FormData, 'tasks'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        handleInputChange('url', dataUrl);
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
          handleInputChange('url', dataUrl);
        }
      }
    }
  };

  const handleAddTask = () => {
    if(newTaskText.trim() === '') return;
    const newTasks = [...formData.tasks, { id: Date.now().toString(), text: newTaskText.trim(), completed: false }];
    setFormData(prev => ({...prev, tasks: newTasks }));
    setNewTaskText("");
  };

  const handleToggleTask = (id: string) => {
    const newTasks = formData.tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    setFormData(prev => ({...prev, tasks: newTasks }));
  };
  
  const handleDeleteTask = (id: string) => {
      const newTasks = formData.tasks.filter(task => task.id !== id);
      setFormData(prev => ({...prev, tasks: newTasks }));
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formElements = form.elements as typeof form.elements & {
      title: { value: string };
      content: { value: string };
      url: { value: string };
      tags: { value: string };
      icon: { value: string };
    };

    const currentTitle = formElements.title.value;
    const targetGroupId = isEditingItem ? itemToEdit!.groupId : (activeGroupId || defaultGroupId);
    if (!currentTitle || !targetGroupId) return;

    const finalFormData = {
        ...formData,
        title: currentTitle,
        content: formElements.content?.value || '',
        url: formElements.url?.value || formData.url, // Keep dataURL from file uploads
        tags: formElements.tags.value,
        icon: formElements.icon.value,
    };

    const commonData = {
      title: finalFormData.title,
      icon: finalFormData.icon,
      aspect: finalFormData.aspect,
      tags: finalFormData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      groupId: targetGroupId,
    };
    
    let itemData;

    switch (selectedType) {
      case 'note': itemData = { ...commonData, type: 'note', content: finalFormData.content }; break;
      case 'link': itemData = { ...commonData, type: 'link', url: finalFormData.url }; break;
      case 'image': itemData = { ...commonData, type: 'image', url: finalFormData.url }; break;
      case 'todo': itemData = { ...commonData, type: 'todo', tasks: finalFormData.tasks }; break;
      default: return;
    }
    
    if (isEditingItem) {
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
                        <Input id="title" name="title" defaultValue={formData.title} />
                    </FormFieldWrapper>

                    {selectedType === "note" && (
                    <FormFieldWrapper label="Contenido" htmlFor="content" fullWidth>
                        <Textarea id="content" name="content" defaultValue={formData.content} className="min-h-[200px]" placeholder="Escribe tu nota aquí..." />
                    </FormFieldWrapper>
                    )}
                    {selectedType === "link" && (
                        <FormFieldWrapper label="URL" htmlFor="url">
                            <Input id="url" name="url" defaultValue={formData.url} />
                        </FormFieldWrapper>
                    )}
                    {selectedType === "image" && (
                        <FormFieldWrapper label="Imagen" htmlFor="image-file">
                            <div className="grid gap-2">
                                <Input id="image-file" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
                                <Textarea placeholder="O pega la imagen aquí" className="h-20" onPaste={handlePaste}/>
                                {formData.url && <img src={formData.url} alt="Vista previa" className="mt-2 max-h-40 rounded-md object-contain border border-border" />}
                            </div>
                        </FormFieldWrapper>
                    )}
                    {selectedType === "todo" && (
                        <FormFieldWrapper label="Tareas" htmlFor="new-task-input">
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <Input id="new-task-input" placeholder="Nueva tarea..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTask()} />
                                    <Button type="button" size="icon" onClick={handleAddTask}><Plus className="h-4 w-4" /></Button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {formData.tasks.map(task => (
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
                        <Input id="tags" name="tags" defaultValue={formData.tags} placeholder="Etiquetas separadas por comas" />
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
                        <Input id="icon" name="icon" defaultValue={formData.icon || ''} placeholder="Ej: folder, home, lightbulb" />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Aspecto" htmlFor="aspect-default">
                        <RadioGroup defaultValue={formData.aspect} onValueChange={(v) => handleInputChange('aspect', v as CardAspect)} className="flex flex-col sm:flex-row gap-4">
                            <div>
                                <RadioGroupItem value="default" id="aspect-default" className="sr-only"/>
                                <Label htmlFor="aspect-default">
                                    <Card className={cn("cursor-pointer", formData.aspect === 'default' && "border-primary ring-2 ring-primary")}>
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
                                    <Card className={cn("cursor-pointer border-primary/50", formData.aspect === 'highlighted' && "border-primary ring-2 ring-primary")}>
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
                                    <Card className={cn("cursor-pointer bg-transparent shadow-none border-dashed", formData.aspect === 'minimalist' && "border-primary ring-2 ring-primary")}>
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
          <DialogTitle>{isEditingItem ? 'Editar Contenido' : 'Agregar Nuevo Contenido'}</DialogTitle>
          <DialogDescription>
            {!selectedType ? 'Selecciona un tipo de contenido para agregar.' : 'Modifica los detalles de tu elemento.'}
          </DialogDescription>
        </DialogHeader>
        
        {!selectedType ? (
             <div className="grid grid-cols-2 gap-4 py-4">
                {contentTypes.map(({ type, label, icon: Icon }) => (
                    <div key={type} onClick={() => { setSelectedType(type); handleInputChange('type', type); }} className="p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent hover:border-primary/50 transition-all text-center border rounded-lg">
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
            {selectedType && <Button type="submit" form="add-content-form">{isEditingItem ? 'Guardar Cambios' : 'Agregar'}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
