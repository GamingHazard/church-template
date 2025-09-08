import { type User, type InsertUser, type Event, type InsertEvent, type Sermon, type InsertSermon, type Newsletter, type InsertNewsletter, type EventReminder, type InsertEventReminder, type Donation, type InsertDonation, type GalleryImage, type InsertGalleryImage, type Pastor, type InsertPastor } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Events
  getAllEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Sermons
  getAllSermons(): Promise<Sermon[]>;
  getRecentSermons(): Promise<Sermon[]>;
  getSermon(id: string): Promise<Sermon | undefined>;
  createSermon(sermon: InsertSermon): Promise<Sermon>;
  updateSermon(id: string, sermon: Partial<InsertSermon>): Promise<Sermon>;
  deleteSermon(id: string): Promise<boolean>;
  searchSermons(query: string): Promise<Sermon[]>;
  
  // Newsletter
  subscribeNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getAllNewsletterSubscribers(): Promise<Newsletter[]>;
  unsubscribeNewsletter(email: string): Promise<boolean>;
  
  // Event Reminders
  createEventReminder(reminder: InsertEventReminder): Promise<EventReminder>;
  getEventReminders(eventId: string): Promise<EventReminder[]>;
  
  // Donations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getAllDonations(): Promise<Donation[]>;
  updateDonationStatus(id: string, status: string): Promise<Donation>;
  
  // Gallery
  getAllGalleryImages(): Promise<GalleryImage[]>;
  getGalleryImagesByCategory(category: string): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  deleteGalleryImage(id: string): Promise<boolean>;
  
  // Pastors
  getAllPastors(): Promise<Pastor[]>;
  getLeadPastor(): Promise<Pastor | undefined>;
  createPastor(pastor: InsertPastor): Promise<Pastor>;
  updatePastor(id: string, pastor: Partial<InsertPastor>): Promise<Pastor>;
  deletePastor(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private events: Map<string, Event>;
  private sermons: Map<string, Sermon>;
  private newsletters: Map<string, Newsletter>;
  private eventReminders: Map<string, EventReminder>;
  private donations: Map<string, Donation>;
  private galleryImages: Map<string, GalleryImage>;
  private pastors: Map<string, Pastor>;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.sermons = new Map();
    this.newsletters = new Map();
    this.eventReminders = new Map();
    this.donations = new Map();
    this.galleryImages = new Map();
    this.pastors = new Map();
    
    this.seedData();
  }

  private seedData() {
    // Seed with sample pastor
    const leadPastor: Pastor = {
      id: randomUUID(),
      name: "Pastor David Johnson",
      title: "Lead Pastor",
      bio: "Pastor David has been serving our community for over 15 years with passion and dedication to God's word.",
      imageUrl: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      email: "david@faithlifechurch.org",
      isLead: true,
      order: 1,
    };
    this.pastors.set(leadPastor.id, leadPastor);

    // Seed with sample events
    const event1: Event = {
      id: randomUUID(),
      title: "Community Potluck",
      description: "Join us for a time of fellowship and delicious food shared together.",
      date: new Date("2024-01-20T18:00:00Z"),
      time: "6:00 PM",
      location: "Fellowship Hall",
      speaker: null,
      imageUrl: "https://images.unsplash.com/photo-1577303935007-0d306ee638cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      category: "community",
      createdAt: new Date(),
    };
    this.events.set(event1.id, event1);

    // Seed with sample sermons
    const sermon1: Sermon = {
      id: randomUUID(),
      title: "Walking in Faith",
      speaker: "Pastor David Johnson",
      date: new Date("2023-12-10T10:30:00Z"),
      description: "Discovering how to trust God's plan even in uncertain times.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      audioUrl: null,
      thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225",
      scripture: "Hebrews 11:1",
      series: "Faith Series",
      createdAt: new Date(),
    };
    this.sermons.set(sermon1.id, sermon1);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "user"
    };
    this.users.set(id, user);
    return user;
  }

  // Events
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.events.values())
      .filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = { 
      ...insertEvent, 
      id, 
      createdAt: new Date(),
      category: insertEvent.category || "general",
      speaker: insertEvent.speaker || null,
      imageUrl: insertEvent.imageUrl || null
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updateData: Partial<InsertEvent>): Promise<Event> {
    const event = this.events.get(id);
    if (!event) throw new Error("Event not found");
    
    const updatedEvent = { ...event, ...updateData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  // Sermons
  async getAllSermons(): Promise<Sermon[]> {
    return Array.from(this.sermons.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getRecentSermons(): Promise<Sermon[]> {
    const all = await this.getAllSermons();
    return all.slice(0, 10);
  }

  async getSermon(id: string): Promise<Sermon | undefined> {
    return this.sermons.get(id);
  }

  async createSermon(insertSermon: InsertSermon): Promise<Sermon> {
    const id = randomUUID();
    const sermon: Sermon = { 
      ...insertSermon, 
      id, 
      createdAt: new Date(),
      videoUrl: insertSermon.videoUrl || null,
      audioUrl: insertSermon.audioUrl || null,
      thumbnailUrl: insertSermon.thumbnailUrl || null,
      scripture: insertSermon.scripture || null,
      series: insertSermon.series || null
    };
    this.sermons.set(id, sermon);
    return sermon;
  }

  async updateSermon(id: string, updateData: Partial<InsertSermon>): Promise<Sermon> {
    const sermon = this.sermons.get(id);
    if (!sermon) throw new Error("Sermon not found");
    
    const updatedSermon = { ...sermon, ...updateData };
    this.sermons.set(id, updatedSermon);
    return updatedSermon;
  }

  async deleteSermon(id: string): Promise<boolean> {
    return this.sermons.delete(id);
  }

  async searchSermons(query: string): Promise<Sermon[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.sermons.values()).filter(sermon =>
      sermon.title.toLowerCase().includes(lowerQuery) ||
      sermon.speaker.toLowerCase().includes(lowerQuery) ||
      sermon.description.toLowerCase().includes(lowerQuery) ||
      sermon.scripture?.toLowerCase().includes(lowerQuery)
    );
  }

  // Newsletter
  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    // Check if already subscribed
    const existing = Array.from(this.newsletters.values()).find(n => n.email === insertNewsletter.email);
    if (existing) {
      if (existing.active) {
        throw new Error("Email already subscribed");
      } else {
        // Reactivate subscription
        existing.active = true;
        this.newsletters.set(existing.id, existing);
        return existing;
      }
    }

    const id = randomUUID();
    const newsletter: Newsletter = { 
      ...insertNewsletter, 
      id, 
      subscribedAt: new Date(),
      active: true 
    };
    this.newsletters.set(id, newsletter);
    return newsletter;
  }

  async getAllNewsletterSubscribers(): Promise<Newsletter[]> {
    return Array.from(this.newsletters.values()).filter(n => n.active);
  }

  async unsubscribeNewsletter(email: string): Promise<boolean> {
    const newsletter = Array.from(this.newsletters.values()).find(n => n.email === email);
    if (newsletter) {
      newsletter.active = false;
      this.newsletters.set(newsletter.id, newsletter);
      return true;
    }
    return false;
  }

  // Event Reminders
  async createEventReminder(insertReminder: InsertEventReminder): Promise<EventReminder> {
    const id = randomUUID();
    const reminder: EventReminder = { 
      ...insertReminder, 
      id, 
      createdAt: new Date(),
      email: insertReminder.email || null,
      phone: insertReminder.phone || null
    };
    this.eventReminders.set(id, reminder);
    return reminder;
  }

  async getEventReminders(eventId: string): Promise<EventReminder[]> {
    return Array.from(this.eventReminders.values()).filter(r => r.eventId === eventId);
  }

  // Donations
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = randomUUID();
    const donation: Donation = { 
      ...insertDonation, 
      id, 
      status: "pending",
      createdAt: new Date(),
      donorName: insertDonation.donorName || null,
      donorEmail: insertDonation.donorEmail || null,
      purpose: insertDonation.purpose || "general",
      transactionId: insertDonation.transactionId || null
    };
    this.donations.set(id, donation);
    return donation;
  }

  async getAllDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async updateDonationStatus(id: string, status: string): Promise<Donation> {
    const donation = this.donations.get(id);
    if (!donation) throw new Error("Donation not found");
    
    donation.status = status;
    this.donations.set(id, donation);
    return donation;
  }

  // Gallery
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values()).sort((a, b) => 
      new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime()
    );
  }

  async getGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
    return Array.from(this.galleryImages.values()).filter(img => img.category === category);
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const id = randomUUID();
    const image: GalleryImage = { 
      ...insertImage, 
      id, 
      uploadedAt: new Date(),
      category: insertImage.category || "general"
    };
    this.galleryImages.set(id, image);
    return image;
  }

  async deleteGalleryImage(id: string): Promise<boolean> {
    return this.galleryImages.delete(id);
  }

  // Pastors
  async getAllPastors(): Promise<Pastor[]> {
    return Array.from(this.pastors.values()).sort((a, b) => a.order - b.order);
  }

  async getLeadPastor(): Promise<Pastor | undefined> {
    return Array.from(this.pastors.values()).find(p => p.isLead);
  }

  async createPastor(insertPastor: InsertPastor): Promise<Pastor> {
    const id = randomUUID();
    const pastor: Pastor = { 
      ...insertPastor, 
      id,
      order: insertPastor.order || 0,
      email: insertPastor.email || null,
      imageUrl: insertPastor.imageUrl || null,
      isLead: insertPastor.isLead || false
    };
    this.pastors.set(id, pastor);
    return pastor;
  }

  async updatePastor(id: string, updateData: Partial<InsertPastor>): Promise<Pastor> {
    const pastor = this.pastors.get(id);
    if (!pastor) throw new Error("Pastor not found");
    
    const updatedPastor = { ...pastor, ...updateData };
    this.pastors.set(id, updatedPastor);
    return updatedPastor;
  }

  async deletePastor(id: string): Promise<boolean> {
    return this.pastors.delete(id);
  }
}

export const storage = new MemStorage();
