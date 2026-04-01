import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PageLayout, Footer } from "@/components/layout";
import {
  Car,
  DollarSign,
  MapPin,
  Clock,
  ArrowRight,
  ParkingSquare,
  CalendarCheck,
  TrendingUp,
  Search,
  MousePointerClick,
  Zap,
} from "lucide-react";

function HeroSection() {
  return (
    <section className="relative overflow-hidden" data-testid="section-hero">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/15 px-4 py-1.5 text-xs font-medium text-primary mb-6">
            <ParkingSquare className="h-3.5 w-3.5" />
            Parking marketplace
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.1]">
            Your Parking Spot,{" "}
            <span className="text-primary">Working for You</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Turn unused parking into income or find affordable spots near you.
            PLOT connects lot owners with drivers — simple, fast, fair.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link href="/list">
              <Button size="lg" className="w-full sm:w-auto gap-2 font-semibold" data-testid="button-list-your-lot">
                List Your Lot
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/find">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 font-semibold" data-testid="button-find-parking">
                Find Parking
                <Search className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const ownerSteps = [
  {
    icon: ParkingSquare,
    title: "List your lot",
    description: "Add your parking lot details, location, and pricing in under 2 minutes.",
  },
  {
    icon: Clock,
    title: "Set availability",
    description: "Define operating hours and number of spots. You control when your lot is open.",
  },
  {
    icon: DollarSign,
    title: "Earn money",
    description: "Drivers book and pay. You earn on every reservation, hassle-free.",
  },
];

const driverSteps = [
  {
    icon: Search,
    title: "Search by location",
    description: "Enter your destination and find nearby lots with real-time availability.",
  },
  {
    icon: MousePointerClick,
    title: "Pick a spot",
    description: "Compare prices, check hours, and choose the spot that works best.",
  },
  {
    icon: Zap,
    title: "Book instantly",
    description: "Reserve in seconds. Show up and park — it's that simple.",
  },
];

function HowItWorks() {
  return (
    <section className="py-20 bg-card border-y border-border" data-testid="section-how-it-works">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-foreground">
            How It Works
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Whether you own a lot or need a spot, PLOT makes it effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* For Owners */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/15 px-3 py-1 text-xs font-semibold text-primary mb-6 uppercase tracking-wider">
              For Owners
            </div>
            <div className="space-y-8">
              {ownerSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Drivers */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/15 px-3 py-1 text-xs font-semibold text-primary mb-6 uppercase tracking-wider">
              For Drivers
            </div>
            <div className="space-y-8">
              {driverSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "500+", label: "Spots Listed", icon: MapPin },
  { value: "1,200+", label: "Bookings Made", icon: CalendarCheck },
  { value: "50+", label: "Lots Active", icon: TrendingUp },
];

function StatsSection() {
  return (
    <section className="py-20" data-testid="section-stats">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-8 rounded-xl border border-border bg-card"
            >
              <div className="inline-flex items-center justify-center h-11 w-11 rounded-lg bg-primary/10 mb-4">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="font-display font-bold text-3xl text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground" data-testid="section-cta">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">
          Ready to get started?
        </h2>
        <p className="mt-3 text-primary-foreground/75 max-w-md mx-auto">
          Join hundreds of lot owners and thousands of drivers already using PLOT.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link href="/list">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 font-semibold" data-testid="button-cta-list">
              List Your Lot
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/find">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto gap-2 font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              data-testid="button-cta-find"
            >
              <Car className="h-4 w-4" />
              Find Parking
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <PageLayout>
      <HeroSection />
      <HowItWorks />
      <StatsSection />
      <CTASection />
      <Footer />
    </PageLayout>
  );
}
