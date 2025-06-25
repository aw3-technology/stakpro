import { CustomDrawer } from '@/components/custom/custom-drawer';
import { useBillingDetailsDrawer } from '../hooks/use-billing-detail-drawer-store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCountries } from '@/hooks/use-countries';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
const billingDetailsSchema = z.object({
  email: z.string().email(),
  company: z.string().min(1),
  addressLine: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  vatNumber: z.string().min(1),
});

export const BillingDetailsDrawer = () => {
  const countries = useCountries();
  const { open, setOpen } = useBillingDetailsDrawer();

  const form = useForm<z.infer<typeof billingDetailsSchema>>({
    resolver: zodResolver(billingDetailsSchema),
    defaultValues: {
      email: '',
      company: '',
      addressLine: '',
      country: '',
      city: '',
      state: '',
      postalCode: '',
      vatNumber: '',
    },
  });

  const handleSubmit = (data: z.infer<typeof billingDetailsSchema>) => {
    console.log(data);
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
  };

  return (
    <CustomDrawer
      title="Billing Details"
      open={open}
      onOpenChange={setOpen}
      footer={
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={handleCancel}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button type="submit" form="billing-details-form" className='cursor-pointer'>
            Save
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form
          id="billing-details-form"
          className="space-y-9"
          onSubmit={form.handleSubmit(handleSubmit)}
        >

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Address Line</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your address line" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 w-full cursor-pointer">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0 max-h-[280px] overflow-y-auto">
                        {countries.map((continent) => (
                          <SelectGroup key={continent.continent}>
                            <SelectLabel className="ps-2">
                              {continent.continent}
                            </SelectLabel>
                            {continent.items.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                <span className="text-lg leading-none">
                                  {item.flag}
                                </span>{' '}
                                <span className="truncate">{item.label}</span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vatNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>VAT Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your VAT number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </form>
      </Form>
    </CustomDrawer>
  );
};
