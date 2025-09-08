import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Users, Heart, Book, Music } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Pastor, GalleryImage } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function About() {
  const { data: pastors, isLoading: pastorsLoading } = useQuery<Pastor[]>({
    queryKey: ["/api/pastors"],
  });

  const { data: galleryImages, isLoading: galleryLoading } = useQuery<GalleryImage[]>({
    queryKey: ["/api/gallery"],
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <h1 className="text-5xl font-bold mb-6" data-testid="about-title">
            About FaithLife Church
          </h1>
          <p className="text-xl max-w-3xl mx-auto" data-testid="about-subtitle">
            Discover our story, meet our team, and learn about our heart for community and faith.
          </p>
        </div>
      </section>

      {/* Church History */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="history-title">
                Our Story
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p data-testid="history-paragraph-1">
                  FaithLife Church was founded in 1995 with a simple vision: to create a place where people from all walks 
                  of life could come together to experience God's love and grow in their faith journey. What started as a 
                  small gathering of 20 people in a community center has grown into a vibrant congregation of over 1,200 members.
                </p>
                <p data-testid="history-paragraph-2">
                  Our church has always been committed to authentic worship, practical teaching from God's Word, and genuine 
                  community. We believe that church isn't just about Sunday services—it's about building relationships, 
                  supporting one another, and making a positive impact in our community and beyond.
                </p>
                <p data-testid="history-paragraph-3">
                  Over the years, we've launched numerous ministries, supported local charities, and sent mission teams 
                  around the world. But our heart remains the same: to help people discover their purpose in God's love 
                  and live out their faith in meaningful ways.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Historic church exterior building"
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="church-history-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="values-title">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="values-description">
              These principles guide everything we do as a church community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid="value-love-title">
                  Love
                </h3>
                <p className="text-muted-foreground" data-testid="value-love-description">
                  We believe love is the foundation of our faith and the way we treat one another and our community.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid="value-community-title">
                  Community
                </h3>
                <p className="text-muted-foreground" data-testid="value-community-description">
                  We're committed to building genuine relationships and supporting each other through life's journey.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Book className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid="value-truth-title">
                  Truth
                </h3>
                <p className="text-muted-foreground" data-testid="value-truth-description">
                  We are devoted to teaching and living by the timeless truths found in God's Word.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Music className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid="value-worship-title">
                  Worship
                </h3>
                <p className="text-muted-foreground" data-testid="value-worship-description">
                  We celebrate God through heartfelt worship, music, and expressions of praise and gratitude.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid="value-service-title">
                  Service
                </h3>
                <p className="text-muted-foreground" data-testid="value-service-description">
                  We are called to serve our community and world with the same love Christ showed us.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid="value-growth-title">
                  Growth
                </h3>
                <p className="text-muted-foreground" data-testid="value-growth-description">
                  We encourage spiritual growth and personal development in every stage of life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pastoral Team */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="pastoral-team-title">
              Meet Our Pastoral Team
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="pastoral-team-description">
              Dedicated leaders committed to shepherding our church family
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastorsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6">
                    <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto mb-4" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : pastors && pastors.length > 0 ? (
              pastors.map((pastor) => (
                <Card key={pastor.id} className="text-center" data-testid={`pastor-card-${pastor.id}`}>
                  <CardContent className="pt-6">
                    <img
                      src={pastor.imageUrl || "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
                      alt={pastor.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      data-testid={`pastor-image-${pastor.id}`}
                    />
                    <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`pastor-name-${pastor.id}`}>
                      {pastor.name}
                    </h3>
                    <p className="text-primary font-medium mb-4" data-testid={`pastor-title-${pastor.id}`}>
                      {pastor.title}
                    </p>
                    <p className="text-muted-foreground text-sm" data-testid={`pastor-bio-${pastor.id}`}>
                      {pastor.bio}
                    </p>
                    {pastor.email && (
                      <p className="text-primary text-sm mt-2" data-testid={`pastor-email-${pastor.id}`}>
                        {pastor.email}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground" data-testid="no-pastors">
                  No pastoral team information available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Service Times & Location */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Service Times */}
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-8" data-testid="service-times-section-title">
                Service Times & Location
              </h2>

              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold text-card-foreground mb-6 flex items-center">
                    <Clock className="mr-3 h-6 w-6 text-primary" />
                    Sunday Services
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center" data-testid="service-early">
                      <span className="font-medium">Early Service</span>
                      <span className="text-muted-foreground">8:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center" data-testid="service-main">
                      <span className="font-medium">Main Service</span>
                      <span className="text-muted-foreground">10:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center" data-testid="service-evening">
                      <span className="font-medium">Evening Service</span>
                      <span className="text-muted-foreground">6:00 PM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold text-card-foreground mb-6 flex items-center">
                    <MapPin className="mr-3 h-6 w-6 text-primary" />
                    Our Location
                  </h3>
                  <div className="space-y-2" data-testid="church-address">
                    <p className="font-medium">FaithLife Church</p>
                    <p className="text-muted-foreground">123 Faith Avenue</p>
                    <p className="text-muted-foreground">Cityville, ST 12345</p>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Map */}
            <div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.5273737839975!2d-74.0059413!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316e10c5b7%3A0x2b4021ffee7b3f1!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sus!4v1639158000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Church Location Map"
                  data-testid="church-map"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="gallery-title">
              Our Church Family
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="gallery-description">
              Glimpses of our community in worship, fellowship, and service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))
            ) : galleryImages && galleryImages.length > 0 ? (
              galleryImages.slice(0, 6).map((image) => (
                <div key={image.id} className="relative group overflow-hidden rounded-lg" data-testid={`gallery-image-${image.id}`}>
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-medium" data-testid={`gallery-title-${image.id}`}>
                      {image.title}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg" data-testid="no-gallery">
                  Gallery images coming soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
