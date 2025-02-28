import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getLead, updateLead } from "@/lib/api/leads";
import { getComments, createComment, type Comment } from "@/lib/api/comments";
import LeadForm from "./LeadForm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils/date";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LeadEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [initialData, setInitialData] = useState(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Determine where to navigate back to
  const getReturnPath = () => {
    const referrer = location.state?.from || "/leads";
    return referrer;
  };

  useEffect(() => {
    const loadLead = async () => {
      if (!id) return;
      try {
        const data = await getLead(id);
        setInitialData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load lead",
          variant: "destructive",
        });
        navigate(getReturnPath());
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

  const handleSubmit = async (data: any) => {
    // Clean empty string values for optional fields
    Object.keys(data).forEach((key) => {
      if (
        key !== "name" &&
        key !== "email" &&
        key !== "phone" &&
        data[key] === ""
      ) {
        data[key] = null;
      }
    });
    if (!id) return;
    try {
      await updateLead(id, data);
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
      navigate(getReturnPath());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    }
  };

  if (!initialData) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <LeadForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(getReturnPath())}
      />

      <Card className="mt-8 bg-white">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {comments.length > 0 ? (
                  [...comments]
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
                    ))
                ) : (
                  <p className="text-gray-500">No comments yet</p>
                )}
              </div>
            </ScrollArea>

            <div className="space-y-4">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadEditPage;
