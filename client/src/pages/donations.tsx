import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, DollarSign, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDonationSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const donationFormSchema = insertDonationSchema.extend({
  amount: z.string().min(1, "Amount is required").transform((val) => parseFloat(val)),
});

type DonationForm = z.infer<typeof donationFormSchema>;

export default function Donations() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DonationForm>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      purpose: "general",
    },
  });

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // runs only once when the component mounts

  const selectedPurpose = watch("purpose");

  const donationMutation = useMutation({
    mutationFn: async (data: DonationForm) => {
      const response = await apiRequest("POST", "/api/donations", data);
      return response.json();
    },
    onSuccess: (donation) => {
      // Initialize Flutterwave payment
      initializeFlutterwavePayment(donation);
    },
    onError: (error: any) => {
      setIsProcessing(false);
      toast({
        title: "Donation Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const initializeFlutterwavePayment = (donation: any) => {
    // Get Flutterwave public key from environment
    const flutterwavePublicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || process.env.FLUTTERWAVE_PUBLIC_KEY || "FLWPUBK_TEST-SANDBOXDEMOKEY-X";
    
    if (typeof window !== "undefined" && (window as any).FlutterwaveCheckout) {
      (window as any).FlutterwaveCheckout({
        public_key: flutterwavePublicKey,
        tx_ref: donation.id,
        amount: donation.amount,
        currency: "USD",
        payment_options: "card,mobilemoney,ussd",
        customer: {
          email: donation.donorEmail || "donor@faithlifechurch.org",
          phone_number: "555-123-4567",
          name: donation.donorName || "Anonymous Donor",
        },
        customizations: {
          title: "FaithLife Church Donation",
          description: `Donation for ${donation.purpose}`,
          logo: "https://assets.flutterwave.com/flutterwave-isaactan-dev/images/logo/full.svg",
        },
        callback: function (data: any) {
          if (data.status === "successful") {
            toast({
              title: "Donation Successful!",
              description: "Thank you for your generous contribution. May God bless you abundantly.",
            });
            reset();
          } else {
            toast({
              title: "Payment Cancelled",
              description: "Your donation was not completed.",
              variant: "destructive",
            });
          }
          setIsProcessing(false);
        },
        onclose: function () {
          setIsProcessing(false);
        },
      });
    } else {
      // Fallback if Flutterwave script is not loaded
      toast({
        title: "Payment Processing",
        description: "Redirecting to payment gateway...",
      });
      setIsProcessing(false);
    }
  };

  const onSubmit = (data: DonationForm) => {
    setIsProcessing(true);
    donationMutation.mutate(data);
  };

  const quickAmounts = [25, 50, 100, 250, 500];

  return (
    <div className="min-h-screen bg-background">
      {/* Flutterwave Script */}
      <script src="https://checkout.flutterwave.com/v3.js"></script>

      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6" data-testid="donations-title">
              Give Online
            </h1>
            <p className="text-xl max-w-3xl mx-auto" data-testid="donations-subtitle">
              Your generous gifts help us serve our community, support missions, and further God's kingdom.
            </p>
          </div>
        </div>
      </section>

      {/* Biblical Quote Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <blockquote className="text-2xl md:text-3xl font-light text-card-foreground leading-relaxed mb-6 italic" data-testid="giving-quote">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
          </blockquote>
          <p className="text-lg text-muted-foreground" data-testid="quote-reference">
            - 2 Corinthians 9:7
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center" data-testid="donation-form-title">
                  <Heart className="mr-2 h-6 w-6 text-primary" />
                  Make a Donation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Donation Purpose */}
                  <div>
                    <Label htmlFor="purpose">Donation Purpose</Label>
                    <Select 
                      value={selectedPurpose} 
                      onValueChange={(value) => setValue("purpose", value as any)}
                    >
                      <SelectTrigger data-testid="select-donation-purpose">
                        <SelectValue placeholder="Select donation purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Fund</SelectItem>
                        <SelectItem value="missions">Missions</SelectItem>
                        <SelectItem value="building">Building Fund</SelectItem>
                        <SelectItem value="special">Special Projects</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.purpose && (
                      <p className="text-destructive text-sm mt-1">{errors.purpose.message}</p>
                    )}
                  </div>

                  {/* Quick Amount Buttons */}
                  <div>
                    <Label>Quick Amounts</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setValue("amount", amount.toString())}
                          data-testid={`button-amount-${amount}`}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <Label htmlFor="amount">Amount ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="0.00"
                        className="pl-10"
                        {...register("amount")}
                        data-testid="input-donation-amount"
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-destructive text-sm mt-1">{errors.amount.message}</p>
                    )}
                  </div>

                  {/* Donor Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="donorName">Full Name (Optional)</Label>
                      <Input
                        id="donorName"
                        {...register("donorName")}
                        placeholder="Your full name"
                        data-testid="input-donor-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="donorEmail">Email Address (Optional)</Label>
                      <Input
                        id="donorEmail"
                        type="email"
                        {...register("donorEmail")}
                        placeholder="your@email.com"
                        data-testid="input-donor-email"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:opacity-90"
                    disabled={isProcessing || donationMutation.isPending}
                    data-testid="button-donate"
                  >
                    {isProcessing || donationMutation.isPending ? "Processing..." : "Continue to Payment"}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Secure payment powered by Flutterwave. Your donation is safe and encrypted.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Giving Information */}
            <div className="space-y-6">
              {/* Why Give */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl" data-testid="why-give-title">
                    Why Give?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4" data-testid="why-give-description">
                    Your gifts enable us to:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start" data-testid="giving-benefit-1">
                      <Heart className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      Support local families in need
                    </li>
                    <li className="flex items-start" data-testid="giving-benefit-2">
                      <Heart className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      Fund mission trips and outreach programs
                    </li>
                    <li className="flex items-start" data-testid="giving-benefit-3">
                      <Heart className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      Maintain and improve our church facilities
                    </li>
                    <li className="flex items-start" data-testid="giving-benefit-4">
                      <Heart className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      Provide children's and youth ministries
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Other Ways to Give */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl" data-testid="other-ways-title">
                    Other Ways to Give
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2" data-testid="in-person-giving">
                      In-Person Giving
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Drop your offering in the collection boxes during Sunday services or visit our church office during business hours.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2" data-testid="mail-giving">
                      Mail a Check
                    </h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Send checks payable to "FaithLife Church" to:
                    </p>
                    <div className="text-sm text-muted-foreground" data-testid="mailing-address">
                      <p>FaithLife Church</p>
                      <p>123 Faith Avenue</p>
                      <p>Cityville, ST 12345</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl" data-testid="contact-info-title">
                    Questions About Giving?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 text-primary mr-3" />
                    <span data-testid="contact-phone">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary mr-3" />
                    <span data-testid="contact-email">giving@faithlifechurch.org</span>
                  </div>
                  <div className="flex items-start text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary mr-3 mt-0.5" />
                    <div>
                      <p data-testid="office-hours">Office Hours:</p>
                      <p className="text-sm">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Biblical Quotes */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <blockquote className="text-lg italic text-card-foreground mb-4" data-testid="quote-1">
                  "Honor the Lord with your wealth, with the firstfruits of all your crops."
                </blockquote>
                <p className="text-muted-foreground">- Proverbs 3:9</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <blockquote className="text-lg italic text-card-foreground mb-4" data-testid="quote-2">
                  "Give, and it will be given to you. A good measure, pressed down, shaken together and running over."
                </blockquote>
                <p className="text-muted-foreground">- Luke 6:38</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <blockquote className="text-lg italic text-card-foreground mb-4" data-testid="quote-3">
                  "Bring the whole tithe into the storehouse, that there may be food in my house."
                </blockquote>
                <p className="text-muted-foreground">- Malachi 3:10</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
