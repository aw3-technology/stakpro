import { AppLayoutContent } from '@/components/custom/app-layout-content';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllSubmittedTools, approveTool, rejectTool } from '@/lib/tool-api';
import { DatabaseTool } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, ExternalLink, X } from 'lucide-react';

export const Admin = () => {
  const [submittedTools, setSubmittedTools] = useState<DatabaseTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    setLoading(true);
    setError(null);
    try {
      const tools = await getAllSubmittedTools();
      setSubmittedTools(tools);
    } catch (err) {
      setError('Failed to fetch tools. Please try again.');
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const result = await approveTool(id);
      if (result.success) {
        await fetchTools(); // Refresh the list
      } else {
        setError(result.error || 'Failed to approve tool');
      }
    } catch (err) {
      setError('Failed to approve tool');
      console.error('Error approving tool:', err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const result = await rejectTool(id);
      if (result.success) {
        await fetchTools(); // Refresh the list
      } else {
        setError(result.error || 'Failed to reject tool');
      }
    } catch (err) {
      setError('Failed to reject tool');
      console.error('Error rejecting tool:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AppLayoutContent
      title={
        <TextAnimate animation="blurInUp" delay={0.1} duration={0.1} by="character" once as="h1" className='leading-8 font-normal'>
          Tool Submissions Admin
        </TextAnimate>
      }
      description={
        <TextAnimate animation="blurInUp" delay={0.3} duration={0.1} by="character" once as="p" className='text-foreground/70 leading-5'>
          Review and manage submitted software tools from the community
        </TextAnimate>
      }
    >
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <X className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <Button onClick={() => setError(null)} variant="ghost" size="sm" className="ml-auto">
            Dismiss
          </Button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-foreground/60">Loading tools...</p>
        </div>
      ) : submittedTools.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-foreground/60">No tool submissions yet.</p>
          <p className="text-sm text-foreground/50 mt-2">Submitted tools will appear here for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/60">
              {submittedTools.length} tool{submittedTools.length !== 1 ? 's' : ''} submitted
            </p>
            <Button onClick={fetchTools} variant="outline" size="sm" disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{tool.name}</span>
                        <a
                          href={tool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="text-sm text-foreground/60 max-w-[300px] truncate">
                        {tool.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tool.category}</Badge>
                    </TableCell>
                    <TableCell>{tool.submitter_name}</TableCell>
                    <TableCell>
                      {new Date(tool.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(tool.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {tool.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApprove(tool.id)}
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(tool.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Development Note</h3>
            <p className="text-sm text-blue-700">
              This admin panel currently uses local storage for demonstration. In production, 
              you'd want to implement proper authentication, a real database, and secure API endpoints.
            </p>
          </div>
        </div>
      )}
    </AppLayoutContent>
  );
};