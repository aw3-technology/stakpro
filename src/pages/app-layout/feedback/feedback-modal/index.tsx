import { useFeedbackModal } from '../hooks/use-feedback-modal-store';
import { Modal } from '@/components/custom/modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MessagesSquare, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const feedbackSchema = z.object({
  rating: z.number().min(1, { message: 'Rating is required' }),
  comment: z.string().optional(),
});

export const FeedbackModal = () => {
  const { open, setOpen } = useFeedbackModal();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });
 
  useEffect(() => {
    if (!open) {
      form.reset();
      setLoading(false);
    }
  }, [open, form]);

  const onSubmit = (data: z.infer<typeof feedbackSchema>) => {
    setLoading(true);
    setTimeout(() => {
      console.log(data);
      setOpen(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <Modal open={open} size="default" setOpen={setOpen}>
      <div className="flex flex-col items-center w-full max-w-[360px] mx-auto py-3">
        <div className="flex pb-4 w-full items-start justify-center">
          <div className="flex bg-card-solid rounded-full w-14 h-14 items-center justify-center">
            <MessagesSquare className="size-6 text-muted-foreground" />
          </div>
        </div>
        <span className="text-lg text-foreground font-medium leading-6 text-center mb-2">
          How hard was it to set up your account?
        </span>
        <span className="text-sm text-muted-foreground text-center mb-8">
          Your input is valuable in helping us better understand your needs and
          tailor our service accordingly.
        </span>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col gap-3 w-full">
                      <div className="flex flex-row w-full items-center justify-between">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <Button
                            {...field}
                            key={num}
                            type="button"
                            variant="ghost"
                            className={cn(
                              'w-9 h-9 flex border-1 border-border rounded-none',
                              num === 1 && 'rounded-l-md',
                              num === 10 && 'rounded-r-md',
                              field.value !== 0 &&
                                field.value === num &&
                                'border-primary'
                            )}
                            onClick={() => field.onChange(num)}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>

                      <div className="flex justify-between w-full px-1">
                        <span className="text-sm text-muted-foreground">
                          Very easy
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Very difficult
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add a comment"
                      className="min-h-[100px] bg-background-elevated resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full flex items-center justify-center gap-2"
              type="submit"
            >
              <Send className="size-4" />
              Submit Feedback
              {loading && <Loader2 className="size-4 animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
