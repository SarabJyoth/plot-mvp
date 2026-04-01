import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import {
  ParkingSquare,
  MapPin,
  DollarSign,
  Clock,
  Car,
  Plus,
  CheckCircle2,
} from "lucide-react";
import type { ParkingLotWithSpots } from "@shared/schema";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string().optional(),
  pricePerHour: z.number().min(50, "Minimum price is $0.50").max(10000, "Maximum price is $100"),
  totalSpots: z.number().int().min(1, "Must have at least 1 spot").max(500, "Maximum 500 spots"),
  operatingHoursOpen: z.string().min(1, "Required"),
  operatingHoursClose: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ListLot() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      pricePerHour: 500, // $5.00
      totalSpots: 10,
      operatingHoursOpen: "08:00",
      operatingHoursClose: "22:00",
    },
  });

  const { data: lots, isLoading: lotsLoading } = useQuery<ParkingLotWithSpots[]>({
    queryKey: ["/api/lots"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/lots", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Lot created!",
        description: "Your parking lot is now live on PLOT.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/lots"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data);
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl tracking-tight text-foreground">
            List Your Lot
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Add your parking lot and start earning on every booking
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Plus className="h-4 w-4 text-primary" />
                  New Parking Lot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lot Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Downtown Central Garage"
                              {...field}
                              data-testid="input-lot-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 123 Main St, Austin, TX 78701"
                              {...field}
                              data-testid="input-lot-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell drivers what's great about your lot — covered, security cameras, easy access, etc."
                              rows={3}
                              {...field}
                              data-testid="input-lot-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="pricePerHour"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per Hour (cents)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="500"
                                  className="pl-9"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  data-testid="input-lot-price"
                                />
                              </div>
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                              {field.value ? `$${(field.value / 100).toFixed(2)}/hr` : "$0.00/hr"}
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="totalSpots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Spots</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="10"
                                  className="pl-9"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  data-testid="input-lot-spots"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="operatingHoursOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opens At</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                data-testid="input-lot-open"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="operatingHoursClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Closes At</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                data-testid="input-lot-close"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2 font-semibold"
                      disabled={createMutation.isPending}
                      data-testid="button-create-lot"
                    >
                      {createMutation.isPending ? (
                        "Creating..."
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Create Lot
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Your Lots sidebar */}
          <div className="lg:col-span-2">
            <h2 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
              <ParkingSquare className="h-4 w-4 text-primary" />
              Your Lots
            </h2>

            {lotsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-full mb-3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-14" />
                        <Skeleton className="h-5 w-18" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : lots && lots.length > 0 ? (
              <div className="space-y-3">
                {lots.map((lot) => (
                  <Link key={lot.id} href={`/lot/${lot.id}`}>
                    <Card className="cursor-pointer hover:border-primary/30 transition-colors" data-testid={`card-your-lot-${lot.id}`}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {lot.name}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs truncate">{lot.address}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            ${(lot.pricePerHour / 100).toFixed(2)}/hr
                          </Badge>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {lot.availableSpots}/{lot.totalSpots} spots
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 rounded-lg border border-dashed border-border" data-testid="empty-state-your-lots">
                <ParkingSquare className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No lots yet</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create your first lot above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
