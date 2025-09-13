import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brush } from 'lucide-react';

export default function CustomizePage() {
  const [activeTab, setActiveTab] = useState('home');

  // Mock data for customization - in a real app, this would come from a backend
  const [homeData, setHomeData] = useState({
    heroTitle: 'Welcome to FaithLife Ministries',
    heroSubtitle: 'A place to grow in faith and community.',
    heroImage: 'https://images.unsplash.com/photo-1507692049790-de58668c0945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  });

  const [aboutData, setAboutData] = useState({
    title: 'About Our Church',
    missionStatement: 'To love God, love people, and make disciples of all nations.',
    visionStatement: 'To be a beacon of hope and a center for spiritual growth in our community.',
    mainImage: 'https://images.unsplash.com/photo-1518303279436-1b21b1a155b7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  });

  const [donationsData, setDonationsData] = useState({
    title: 'Support Our Ministry',
    quote: '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7',
    mainImage: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  });

  const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHomeData({ ...homeData, [e.target.name]: e.target.value });
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAboutData({ ...aboutData, [e.target.name]: e.target.value });
  };

  const handleDonationsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDonationsData({ ...donationsData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h1 className="text-4xl font-bold flex items-center">
            <Brush className="mr-3 h-8 w-8" />
            Website Customization
          </h1>
          <p className="text-xl mt-2 opacity-90">
            Modify the content and appearance of your website pages.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="home">Home Page</TabsTrigger>
              <TabsTrigger value="about">About Page</TabsTrigger>
              <TabsTrigger value="donations">Donations Page</TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              <Card>
                <CardHeader>
                  <CardTitle>Home Page Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Hero Section Title</Label>
                    <Input
                      id="heroTitle"
                      name="heroTitle"
                      value={homeData.heroTitle}
                      onChange={handleHomeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle">Hero Section Subtitle</Label>
                    <Textarea
                      id="heroSubtitle"
                      name="heroSubtitle"
                      value={homeData.heroSubtitle}
                      onChange={handleHomeChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroImage">Hero Section Image URL</Label>
                    <Input
                      id="heroImage"
                      name="heroImage"
                      value={homeData.heroImage}
                      onChange={handleHomeChange}
                    />
                  </div>
                  <Button>Save Home Page</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Page Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={aboutData.title}
                      onChange={handleAboutChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="missionStatement">Mission Statement</Label>
                    <Textarea
                      id="missionStatement"
                      name="missionStatement"
                      value={aboutData.missionStatement}
                      onChange={handleAboutChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visionStatement">Vision Statement</Label>
                    <Textarea
                      id="visionStatement"
                      name="visionStatement"
                      value={aboutData.visionStatement}
                      onChange={handleAboutChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mainImage">Main Image URL</Label>
                    <Input
                      id="mainImage"
                      name="mainImage"
                      value={aboutData.mainImage}
                      onChange={handleAboutChange}
                    />
                  </div>
                  <Button>Save About Page</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle>Donations Page Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={donationsData.title}
                      onChange={handleDonationsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote">Inspirational Quote</Label>
                    <Textarea
                      id="quote"
                      name="quote"
                      value={donationsData.quote}
                      onChange={handleDonationsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mainImage">Main Image URL</Label>
                    <Input
                      id="mainImage"
                      name="mainImage"
                      value={donationsData.mainImage}
                      onChange={handleDonationsChange}
                    />
                  </div>
                  <Button>Save Donations Page</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
