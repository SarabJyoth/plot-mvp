import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Car,
  ParkingSquare,
} from "lucide-react";
import type { ParkingLotWithSpots } from "@shared/schema";

export default function FindParking() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: lots, isLoading } = useQuery<ParkingLotWithSpots[]>({
    queryKey: ["/api/lots"],
  });

  const filteredLots = lots?.filter((lot) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lot.name.toLowerCase().includes(q) ||
      lot.address.toLowerCase().includes(q) ||
      (lot.description && lot.description.toLowerCase().includes(q))
    );
  });

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl tracking-tight text-foreground">
            Find Parking
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Search available lots near your destination
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by address, lot name, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
            data-testid="input-search"
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-5">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredLots && filteredLots.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        ) : (
          <EmptyState searchQuery={searchQuery} />
        )}
      </div>
    </PageLayout>
  );
}

function LotCard({ lot }: { lot: ParkingLotWithSpots }) {
  const priceDisplay = (lot.pricePerHour / 100).toFixed(2);

  return (
    <Link href={`/lot/${lot.id}`}>
      <Card
        className="overflow-hidden cursor-pointer transition-all hover:border-primary/30 hover:shadow-sm group"
        data-testid={`card-lot-${lot.id}`}
      >
        <CardContent className="p-5">
          {/* Lot header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {lot.name}
              </h3>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="text-xs truncate">{lot.address}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <ParkingSquare className="h-8 w-8 text-primary/20" />
            </div>
          </div>

          {/* Description */}
          {lot.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
              {lot.description}
            </p>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs font-medium">
              <DollarSign className="h-3 w-3" />
              ${priceDisplay}/hr
            </Badge>
            <Badge
              variant={lot.availableSpots > 0 ? "secondary" : "destructive"}
              className="gap-1 text-xs font-medium"
            >
              <Car className="h-3 w-3" />
              {lot.availableSpots} / {lot.totalSpots} available
            </Badge>
            <Badge variant="outline" className="gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {lot.operatingHoursOpen} – {lot.operatingHoursClose}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="text-center py-20" data-testid="empty-state-lots">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-muted mb-4">
        <ParkingSquare className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground">
        {searchQuery ? "No lots match your search" : "No lots available yet"}
      </h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
        {searchQuery
          ? "Try a different search term or browse all lots."
          : "Be the first to list a parking lot on PLOT!"}
      </p>
      {!searchQuery && (
        <Link href="/list">
          <Button className="mt-4" variant="outline" data-testid="button-empty-list">
            List Your Lot
          </Button>
        </Link>
      )}
    </div>
  );
}
