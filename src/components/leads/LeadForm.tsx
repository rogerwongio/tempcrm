import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const getStatusColor = (status: string) => {
  const colors = {
    New: "bg-gray-100 text-gray-800 border-gray-200",
    "AI Called": "bg-blue-100 text-blue-800 border-blue-200",
    Contacted: "bg-indigo-100 text-indigo-800 border-indigo-200",
    Unresponsive: "bg-red-100 text-red-800 border-red-200",
    "Discovery Call Qualified":
      "bg-purple-100 text-purple-800 border-purple-200",
    "Proposal Sent": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Quotation Sent": "bg-orange-100 text-orange-800 border-orange-200",
    Negotiation: "bg-cyan-100 text-cyan-800 border-cyan-200",
    Won: "bg-green-100 text-green-800 border-green-200",
    Lost: "bg-red-100 text-red-800 border-red-200",
    Unqualified: "bg-gray-100 text-gray-800 border-gray-200",
    "On Hold": "bg-amber-100 text-amber-800 border-amber-200",
    "Re-Engaged": "bg-lime-100 text-lime-800 border-lime-200",
  };
  return colors[status] || colors.New;
};

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

interface LeadFormProps {
  onSubmit?: (data: FormData) => void;
  onCancel?: () => void;
  initialData?: FormData;
  mode?: "create" | "edit";
}

const LeadForm = ({
  onSubmit = () => {},
  onCancel = () => {},
  initialData,
  mode = "create",
}: LeadFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "New",
      notes: "",
      gclid: "",
      utm: "",
      ad_group: "",
      ad: "",
      keyword: "",
      campaign: "",
      assigned_to: "",
      custom_field_1: "",
      custom_field_2: "",
      custom_field_3: "",
      custom_field_4: "",
      custom_field_5: "",
      custom_field_6: "",
      custom_field_7: "",
      custom_field_8: "",
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "create" ? "Add New Lead" : "Edit Lead"}
          </h1>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="source">Source</TabsTrigger>
                <TabsTrigger value="custom">Custom Fields</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="basic">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className={`block w-full rounded-md text-sm focus:ring-2 focus:ring-offset-2 ${getStatusColor(
                                  field.value || "New",
                                )}`}
                              >
                                <option value="New">New</option>
                                <option value="AI Called">AI Called</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Unresponsive">
                                  Unresponsive
                                </option>
                                <option value="Discovery Call Qualified">
                                  Discovery Call Qualified
                                </option>
                                <option value="Proposal Sent">
                                  Proposal Sent
                                </option>
                                <option value="Quotation Sent">
                                  Quotation Sent
                                </option>
                                <option value="Negotiation">Negotiation</option>
                                <option value="Won">Won</option>
                                <option value="Lost">Lost</option>
                                <option value="Unqualified">Unqualified</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Re-Engaged">Re-Engaged</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                    </div>

                    <div className="mt-6">
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
                                placeholder="Enter any additional notes or comments..."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="source">
                  <div className="grid grid-cols-2 gap-6">
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
                  </div>
                </TabsContent>

                <TabsContent value="custom">
                  <div className="grid grid-cols-2 gap-6">
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
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Add Lead" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LeadForm;
