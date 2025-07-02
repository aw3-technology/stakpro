import { useState } from 'react';
import { AppLayoutContent } from '@/components/custom/app-layout-content';
import { TextAnimate } from '@/components/magicui/text-animate';
import { AddToolForm } from './components/add-tool-form';
import QuickAddForm from './components/quick-add-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link2, Edit3 } from 'lucide-react';

export const AddTool = () => {
  const [prefilledData, setPrefilledData] = useState<Record<string, unknown> | null>(null);
  const [activeTab, setActiveTab] = useState<string>('quick');

  const handleQuickAddSuccess = () => {
    // Could redirect to success page or show confirmation
    console.log('Tool submitted successfully!');
  };

  const handleFallbackToManual = (data?: Record<string, unknown>) => {
    setPrefilledData(data || null);
    setActiveTab('manual');
  };

  return (
    <AppLayoutContent
      title={
        <TextAnimate animation="blurInUp" delay={0.1} duration={0.1} by="character" once as="h1" className='leading-8 font-normal'>
          Add New Tool
        </TextAnimate>
      }
      description={
        <TextAnimate animation="blurInUp" delay={0.3} duration={0.1} by="character" once as="p" className='text-foreground/70 leading-5'>
          Submit a new software tool to help the community discover great development resources
        </TextAnimate>
      }
    >
      <div className="max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Quick Add (URL)
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="mt-6">
            <QuickAddForm 
              onSuccess={handleQuickAddSuccess}
              onFallbackToManual={handleFallbackToManual}
            />
          </TabsContent>
          
          <TabsContent value="manual" className="mt-6">
            <AddToolForm prefilledData={prefilledData || undefined} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayoutContent>
  );
};