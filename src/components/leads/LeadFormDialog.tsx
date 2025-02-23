import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { type Lead } from "@/lib/api/leads";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional().nullable(),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  notes: z.string().optional(),
  gclid: z.string().optional(),
  utm: z.string().optional(),
  ad_group: z.string().optional(),
  ad: z.string().optional(),
  keyword: z.string().optional(),
  campaign: z.string().optional(),
  assigned_to: z.string().optional(),
  status: z
    .enum([
      "New",
      "AI Called",
      "Contacted",
      "Unresponsive",
      "Discovery Call Qualified",
      "Proposal Sent",
      "Quotation Sent",
      "Negotiation",
      "Won",
      "Lost",
      "Unqualified",
      "On Hold",
      "Re-Engaged",
    ])
    .default("New"),
  custom_field_1: z.string().optional(),
  custom_field_2: z.string().optional(),
  custom_field_3: z.string().optional(),
  custom_field_4: z.string().optional(),
  custom_field_5: z.string().optional(),
  custom_field_6: z.string().optional(),
  custom_field_7: z.string().optional(),
  custom_field_8: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LeadFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: FormData) => void;
  initialData?: FormData;
  mode?: "create" | "edit";
}

const LeadFormDialog = ({
  open = true,
  onOpenChange = () => {},
  onSubmit = () => {},
  initialData = {
    name: "",
    email: "",
    phone: "",
    company: "",
  },
  mode = "create",
}: LeadFormDialogProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Lead" : "Edit Lead"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="source">Source</TabsTrigger>
                <TabsTrigger value="custom">Custom Fields</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="source" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="gclid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GCLID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="utm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UTM</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="campaign"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ad_group"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Group</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keyword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keyword</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <FormField
                      key={num}
                      control={form.control}
                      name={`custom_field_${num}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Field {num}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </TabsContent>

                <TabsContent value="comments" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comments</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[200px]"
                            placeholder="Enter any additional notes..."
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Add Lead" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadFormDialog;
