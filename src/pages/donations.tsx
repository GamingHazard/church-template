import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "../hooks/use-toast";
import { Heart, DollarSign, MapPin, Mail, Phone, Clock, EuroIcon,PoundSterling, } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema using Zod
const donationFormSchema = z.object({
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)), "Must be a valid number")
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than 0")
    .refine((val) => Number.isInteger(parseFloat(val)), "Amount must be a whole number"),
  purpose: z.string().min(1, "Purpose is required"),
  currency: z.enum(["USD", "EUR", "GBP", "UGX"], {
    required_error: "Please select a currency",
  }),
  donorName: z.string().optional(),
  donorEmail: z.string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  comment: z.string()
    .max(500, "Comment must not exceed 500 characters")
    .optional()
    .or(z.literal(""))
});

type DonationForm = {
  amount: string;
  purpose: string;
  currency: string;
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
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<z.infer<typeof donationFormSchema>>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      purpose: "offertory",
      currency: "USD",
      amount: "",
      donorName: "",
      donorEmail: "",
      comment: ""
    },
    mode: "onChange"
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
        currency: donation.currency,
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
                  <div className="space-y-2">
                    <Label htmlFor="purpose" className={errors.purpose ? "text-destructive" : ""}>
                      Donation Purpose <span className="text-destructive">*</span>
                    </Label>
                    <Select 
                      value={selectedPurpose} 
                      onValueChange={(value) => {
                        setValue("purpose", value as any);
                        trigger("purpose");
                      }}
                    >
                      <SelectTrigger 
                        data-testid="select-donation-purpose"
                        className={errors.purpose ? "border-destructive ring-destructive" : ""}
                      >
                        <SelectValue placeholder="Select donation purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="tithe">Tithe</SelectItem>
                        <SelectItem value="first_fruit">First Fruit</SelectItem>
                        <SelectItem value="offertory">Offertory</SelectItem>
                        <SelectItem value="general">General Fund</SelectItem>
                        <SelectItem value="missions">Missions</SelectItem>
                        <SelectItem value="building">Building Fund</SelectItem>
                        <SelectItem value="special">Special Projects</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.purpose && (
                      <p className="text-destructive text-sm">{errors.purpose.message}</p>
                    )}
                  </div>
 {/* Currency and Amount */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency" className={errors.currency ? "text-destructive" : ""}>
                        Currency <span className="text-destructive">*</span>
                      </Label>
                      <Select 
                        defaultValue="USD"
                        onValueChange={(value: "USD" | "EUR" | "GBP" | "UGX") => {
                          setValue("currency", value);
                          trigger("currency");
                        }}
                      >
                        <SelectTrigger 
                          className={`w-full ${errors.currency ? "border-destructive ring-destructive" : ""}`} 
                          data-testid="select-currency"
                        >
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="UGX">UGX (USh)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.currency && (
                        <p className="text-destructive text-sm">{errors.currency.message}</p>
                      )}
                    </div>
                    
                   
                  </div>
                  {/* Quick Amount Buttons */}
                  <div>
                    <Label>Quick Amounts</Label>
                    <div className="grid sm:grid-cols-5 grid-cols-3 gap-2 mt-2">
                      {quickAmounts.map((amount) => {
                        const selectedCurrency = watch("currency");
                        const symbol = selectedCurrency === "USD" ? "$" : 
                                     selectedCurrency === "EUR" ? "€" : 
                                     selectedCurrency === "GBP" ? "£" : 
                                     selectedCurrency === "UGX" ? "USh" : "$";
                        
                        // Currency conversion rates (approximate)
                        const rates = {
                          USD: 1,
                          EUR: 1, // 1 USD = 1 EUR (rounded)
                          GBP: 1, // 1 USD = 1 GBP (rounded)
                          UGX: 3800  // 1 USD = 3800 UGX (rounded)
                        };

                        const convertedAmount = Math.round(amount * rates[selectedCurrency as keyof typeof rates]);
                        const formattedAmount = convertedAmount.toLocaleString('en-US', { maximumFractionDigits: 0 });
                        
                        // Calculate button width class based on amount length
                        const amountLength = formattedAmount.length + symbol.length;
                        const widthClass = amountLength > 8 
                          ? 'col-span-2' 
                          : selectedCurrency === 'UGX' 
                            ? 'col-span-2'
                            : '';
                        
                        return (
                          <Button
                            key={amount}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setValue("amount", convertedAmount.toString())}
                            data-testid={`button-amount-${amount}`}
                            className={`${widthClass} text-sm font-medium transition-all hover:scale-105`}
                          >
                            {symbol}{" "}{formattedAmount}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                    {/* Donation Amount */}
                   <div>
                      <Label 
                        htmlFor="amount" 
                        className={errors.amount ? "text-destructive" : ""}
                      >
                        Amount <span className="text-destructive">*</span>
                      </Label>
                    <div className="relative">
                      {/* Dynamic Currency Icon */}
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                          errors.amount ? "text-destructive" : "text-muted-foreground"
                        }`}>
                        {watch("currency") === "USD" && <DollarSign className="h-4 w-4" />}
                        {watch("currency") === "EUR" && <EuroIcon className="h-4 w-4" />}
                        {watch("currency") === "GBP" && <PoundSterling className="h-4 w-4" />}
                        {watch("currency") === "UGX" && <span className="text-xs font-medium">USh</span>}
                      </div>
                        <Input
                          id="amount"
                          type="number"
                          min="1"
                          placeholder="0"
                          className={`pl-10 ${errors.amount ? "border-destructive ring-destructive" : ""}`}
                          {...register("amount", {
                            onChange: (e) => {
                              // Remove decimal points
                              e.target.value = e.target.value.split('.')[0];
                            }
                          })}
                          data-testid="input-donation-amount"
                        />
                      </div>
                      {errors.amount && (
                        <p className="text-destructive text-sm mt-1">{errors.amount.message}</p>
                      )}
                    </div>

                  {/* Donor Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="donorName" 
                        className={`text-xs ${errors.donorName ? "text-destructive" : ""}`}
                      >
                        Full Name (Optional)
                      </Label>
                      <Input
                        id="donorName"
                        {...register("donorName")}
                        placeholder="Your full name"
                        data-testid="input-donor-name"
                        className={errors.donorName ? "border-destructive ring-destructive" : ""}
                      />
                      {errors.donorName && (
                        <p className="text-destructive text-sm">{errors.donorName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label 
                        htmlFor="donorEmail" 
                        className={`text-xs ${errors.donorEmail ? "text-destructive" : ""}`}
                      >
                        Email Address (Optional)
                      </Label>
                      <Input
                        id="donorEmail"
                        type="email"
                        {...register("donorEmail")}
                        placeholder="your@email.com"
                        data-testid="input-donor-email"
                        className={errors.donorEmail ? "border-destructive ring-destructive" : ""}
                      />
                      {errors.donorEmail && (
                        <p className="text-destructive text-sm">{errors.donorEmail.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <Label 
                      htmlFor="comment" 
                      className={errors.comment ? "text-destructive" : ""}
                    >
                      Comment (Optional)
                    </Label>
                    <Textarea
                      id="comment"
                      {...register("comment")}
                      placeholder="Leave a comment or prayer request"
                      data-testid="input-donation-comment"
                      className={errors.comment ? "border-destructive ring-destructive" : ""}
                    />
                    {errors.comment && (
                      <p className="text-destructive text-sm">{errors.comment.message}</p>
                    )}
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
                    <Phone className="h-5 w-5 mr-3 mt-1 text-primary" />
                    <span>
                      <strong>Mobile Money:</strong>(+256)-7xx-xxx-xxx.
                    </span>
                  </p>
                  {/* <p className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 mt-1 text-primary" />
                    <span>
                      <strong>By Mail:</strong> Mail checks to FaithLife Church, 123 Faith Ave, kitetika, UG 12345.
                    </span>
                  </p> */}
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
                    <span>Service Times: </span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <span>Sundays: 7:00 AM & 10:00 AM</span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <span>Wednesdays: 6:00 PM - 8:00 PM</span>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <span>Fridays: 6:00 PM - 8:00 PM </span>
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