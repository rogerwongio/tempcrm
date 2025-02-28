import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Mail, Phone, User, Globe } from "lucide-react";
import { type Lead, getLead } from "@/lib/api/leads";
import { type Comment } from "@/lib/api/comments";
import { getComments, createComment } from "@/lib/api/comments";
import { formatDate } from "@/lib/utils/date";

const LeadPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadLead = async () => {
      if (!id) return;
      try {
        const data = await getLead(id);
        setLead(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load lead",
          variant: "destructive",
        });
        navigate("/leads");
      }
    };

    loadLead();
    loadComments();
  }, [id]);

  const loadComments = async () => {
    if (!id) return;
    try {
      const data = await getComments(id);
      setComments(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!id || !newComment.trim()) return;
    try {
      await createComment({
        lead_id: id,
        content: newComment.trim(),
      });
      setNewComment("");
      loadComments();
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  if (!id || !lead) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <Button
            variant="outline"
            onClick={() => navigate(`/leads/${id}/edit`)}
          >
            Edit Lead
          </Button>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="source">Source</TabsTrigger>
            <TabsTrigger value="custom">Custom Fields</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="details">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-lg font-medium">{lead.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium">{lead.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-lg font-medium">{lead.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="text-lg font-medium">{lead.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p className="text-lg font-medium">
                        {lead.website || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-2">Status</h3>
                  <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                    {lead.status}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Assigned To</h3>
                  <p>{lead.assigned_to || "Unassigned"}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="source">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">GCLID</h3>
                    <p className="mt-1">{lead.gclid || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">UTM</h3>
                    <p className="mt-1">{lead.utm || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Campaign
                    </h3>
                    <p className="mt-1">{lead.campaign || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Ad Group
                    </h3>
                    <p className="mt-1">{lead.ad_group || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ad</h3>
                    <p className="mt-1">{lead.ad || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Keyword
                    </h3>
                    <p className="mt-1">{lead.keyword || "-"}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="custom">
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div key={num}>
                    <h3 className="text-sm font-medium text-gray-500">
                      Custom Field {num}
                    </h3>
                    <p className="mt-1">{lead[`custom_field_${num}`] || "-"}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comments">
              <div className="space-y-6">
                <div className="space-y-4">
                  {[...comments]
                    .sort((a, b) => {
                      if (!a.created_at || !b.created_at) return 0;
                      return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                      );
                    })
                    .map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <p className="whitespace-pre-wrap">{comment.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {formatDate(comment.created_at)}{" "}
                          {comment.created_at
                            ? new Date(comment.created_at).toLocaleTimeString()
                            : ""}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="space-y-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={handleAddComment}>Add Comment</Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default LeadPage;
