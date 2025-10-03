import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Heart, DollarSign, MapPin, Mail, Phone, Clock } from "lucide-react";

// Mock schema for form validation
const donationFormSchema = {
  amount: (val: string) => (val && !isNaN(parseFloat(val)) ? "" : "Amount is required and must be a number."),
  purpose: (val: string) => (val ? "" : "Purpose is required."),
};

type DonationForm = {
  amount: string;
  purpose: string;
  donorName?: string;
  donorEmail?: string;
  comment?: string;
};

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
    defaultValues: {
      purpose: "general",
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedPurpose = watch("purpose");

  // Mock donation mutation
  const donationMutation = {
    mutate: (data: DonationForm) => {
      setIsProcessing(true);
      console.log("Mock donation data:", data);
      // Simulate API call
      setTimeout(() => {
        initializeFlutterwavePayment({
          id: `mock_tx_${Date.now()}`,
          ...data,
        });
      }, 1000);
    },
  };
  
  const initializeFlutterwavePayment = (donation: any) => {
    // Get Flutterwave public key from environment
    const flutterwavePublicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || "FLWPUBK_TEST-SANDBOXDEMOKEY-X";
    
    if (typeof window !== "undefined" && (window as any).FlutterwaveCheckout) {
      (window as any).FlutterwaveCheckout({
        public_key: flutterwavePublicKey,
        tx_ref: donation.id,
        amount: parseFloat(donation.amount),
        currency: "USD",
        payment_options: "card,mobilemoney,ussd",
        customer: {
          email: donation.donorEmail || "donor@faithlifechurch.org",
          phone_number: "+256-7xx-xxx-xxx",
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

                  {/* Comment */}
                  <div>
                    <Label htmlFor="comment">Comment (Optional)</Label>
                    <Textarea
                      id="comment"
                      {...register("comment")}
                      placeholder="Leave a comment or prayer request"
                      data-testid="input-donation-comment"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing}
                    data-testid="button-donate"
                  >
                    {isProcessing ? "Processing..." : "Donate Now"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl" data-testid="ways-to-give-title">Other Ways to Give</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 mt-1 text-primary" />
                    <span>
                      <strong>In Person:</strong> During our weekly services.
                    </span>
                  </p>
                  <p className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 mt-1 text-primary" />
                    <span>
                      <strong>By Mail:</strong> Mail checks to FaithLife Church, 123 Faith Ave, kitetika, UG 12345.
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl" data-testid="contact-info-title">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-primary" />
                    <span>(+256)-7xx-xxx-xxx</span>
                  </p>
                  <p className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-primary" />
                    <span>contact@faithlifechurch.org</span>
                  </p>
                  <p className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-primary" />
                    <span>Service Times: Sundays at 10:00 AM</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Gratitude Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-muted-foreground mb-4" data-testid="gratitude-title">
            Thank You for Your Faithfulness
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="gratitude-message">
            Your giving is an act of worship and makes a difference. We are deeply grateful for your partnership in the gospel.
          </p>
        </div>
      </section>
    </div>
  );
}