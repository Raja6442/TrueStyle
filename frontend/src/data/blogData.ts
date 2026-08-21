export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: 'threat-intel' | 'cybersec' | 'guides';
  image: string;
  content: any[];
}

export const FASHION_SCAM_DB: BlogArticle[] = [
  {
    id: 'art-meesho-delivery',
    title: 'Meesho "Free iPhone" Scam: The Latest Fashion Delivery Trap',
    excerpt: 'Beware of fake delivery boys asking for OTPs claiming you won a free iPhone with your ₹299 Meesho ethnic wear order.',
    readTime: '3 min read',
    category: 'threat-intel',
    image: '/meesho_scam.png',
    content: [
      { type: 'image', src: '/meesho_scam.png', alt: 'Meesho Delivery Scam' },
      { type: 'heading', text: 'The Setup: Too Good To Be True' },
      { type: 'paragraph', text: 'Shoppers ordering low-cost ethnic wear on Meesho are being targeted by a sophisticated delivery ring. When the package arrives, the "delivery boy" informs the customer they won a brand new iPhone.' },
      { type: 'alert', variant: 'danger', title: 'The Attack Vector', text: 'To "verify" the prize, the agent asks the customer for an OTP. This OTP is actually authorizing a UPI transfer or logging into the victim\'s e-wallet.' },
      { type: 'heading', text: 'How TrueStyle Protects You' },
      { type: 'paragraph', text: 'TrueStyle\'s Seller Reputation Profiling actively monitors seller accounts associated with these scam logistics, warning you before you place the order.' }
    ]
  },
  {
    id: 'art-myntra-inflation',
    title: 'Myntra End of Reason Sale: How to Spot Fake "70% OFF" Labels',
    excerpt: 'Sellers are artificially inflating MSRPs before the big sale. We break down how to use TruePrice to see if you are actually getting a deal.',
    readTime: '4 min read',
    category: 'guides',
    image: '/myntra_sale.png',
    content: [
      { type: 'image', src: '/myntra_sale.png', alt: 'Fake Sale Tag' },
      { type: 'heading', text: 'The Price Inflation Trick' },
      { type: 'paragraph', text: 'During major sales, 3rd party sellers artificially inflate the MSRP of an item by 300% a week before. When the sale starts, they apply a "70% discount", making it look like a massive steal.' },
      { type: 'alert', variant: 'warning', title: 'Red Flag', text: 'If you see an unbranded item claiming an MSRP of ₹8,999 but selling for ₹999, it is almost certainly utilizing artificial inflation.' },
      { type: 'heading', text: 'The TruePrice Solution' },
      { type: 'paragraph', text: 'Our TruePrice engine scrapes historical pricing data over a 6-month period, letting you know instantly if that 70% OFF is genuine.' }
    ]
  },
  {
    id: 'art-amazon-sleeper',
    title: 'Amazon Fashion Clones: The Rise of Counterfeit Sneaker Stores',
    excerpt: 'We tracked down 14 newly created "sleeper stores" on Amazon India selling AAA grade replica Jordans as authentic.',
    readTime: '5 min read',
    category: 'cybersec',
    image: '/amazon_sneaker.png',
    content: [
      { type: 'image', src: '/amazon_sneaker.png', alt: 'Amazon Fake Sneakers' },
      { type: 'heading', text: 'The "Sleeper Store" Phenomenon' },
      { type: 'paragraph', text: 'We recently tracked highly coordinated "sleeper stores" on Amazon India. These are seller accounts created months ago that lay dormant to build trust. Overnight, they activate and flood the market with AAA grade replica Air Jordans.' },
      { type: 'alert', variant: 'success', title: 'Safe Shopping Rules', text: 'Always check if the seller is an "Authorized Retailer". High-end sneakers are rarely sold by random 3rd party stores.' },
      { type: 'heading', text: 'Detecting Clones with TrueStyle' },
      { type: 'paragraph', text: 'Our Brand Supply Chain Checks instantly query the luxury brand\'s authorized ledger to flag counterfeit risks.' }
    ]
  },
  {
    id: 'art-insta-thrift',
    title: 'Instagram Thrift Stores: The "Pay First, Get Blocked" Syndicate',
    excerpt: 'Hundreds of fake thrift and streetwear pages on Instagram are stealing money via UPI and immediately blocking customers.',
    readTime: '4 min read',
    category: 'threat-intel',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    content: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', alt: 'Instagram Scam' },
      { type: 'heading', text: 'The Social Media Trap' },
      { type: 'paragraph', text: 'Scammers create highly curated Instagram pages featuring stolen pictures of vintage clothing or trendy streetwear. They buy fake followers and post fake reviews to build legitimacy.' },
      { type: 'alert', variant: 'danger', title: 'The Modus Operandi', text: 'They demand upfront payment via UPI (GPay/PhonePe) because "stock is limited". Once you send the money, they instantly block you on Instagram and WhatsApp.' },
      { type: 'heading', text: 'Awareness is Key' },
      { type: 'paragraph', text: 'Never pay upfront to unverified Instagram pages without a secure payment gateway. TrueStyle\'s Review Rate feature can help you check cross-platform reports of fraudulent UPI IDs.' }
    ]
  },
  {
    id: 'art-first-copy',
    title: '"Custom Seized Goods": The New Cover for Selling First-Copy Fakes',
    excerpt: 'Scammers are selling low-quality replica watches and bags by claiming they are 100% original goods seized by Indian Customs.',
    readTime: '6 min read',
    category: 'cybersec',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop',
    content: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop', alt: 'Fake Watches' },
      { type: 'heading', text: 'The "Customs" Alibi' },
      { type: 'paragraph', text: 'To explain why a ₹2,00,000 Rolex or Gucci bag is being sold for ₹5,000, scammers have invented a clever alibi: they claim the goods are 100% authentic but were seized by airport customs and are being auctioned off.' },
      { type: 'alert', variant: 'warning', title: 'The Reality Check', text: 'Indian Customs does NOT auction seized luxury goods to random Facebook or Telegram sellers. These are simply cheap, low-grade replicas imported from unauthorized factories.' },
      { type: 'paragraph', text: 'The materials used in these "first copies" often contain toxic dyes and cheap alloys that can cause skin allergies. By educating users, TrueStyle aims to destroy the market for hazardous fakes.' }
    ]
  },
  {
    id: 'art-dropshipping',
    title: 'The "Premium Linen" Lie: Exposing Fast Fashion Dropshipping',
    excerpt: 'Ads showing premium cotton and linen sets actually ship you unbreathable, low-quality polyester garments from overseas factories.',
    readTime: '5 min read',
    category: 'guides',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format&fit=crop',
    content: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1000&auto=format&fit=crop', alt: 'Fast Fashion Trap' },
      { type: 'heading', text: 'Stolen Photography' },
      { type: 'paragraph', text: 'You see a Facebook ad for a beautiful, flowy linen summer dress for ₹1,200. The photo looks premium because it was stolen from a high-end designer\'s website.' },
      { type: 'alert', variant: 'danger', title: 'Bait and Switch', text: 'What arrives 3 weeks later is a shiny, thin polyester knockoff that looks nothing like the photo. The sizing is completely off, and the return policy is non-existent because the seller is based in a different country.' },
      { type: 'heading', text: 'Scan Before You Buy' },
      { type: 'paragraph', text: 'Using TrueStyle\'s "Scan Style" feature, you can upload the ad\'s image. Our AI instantly reverse-searches the image to show you the original designer and exposes the dropshipping scam site.' }
    ]
  },
  {
    id: 'art-phishing-zara',
    title: 'Fake Brand Promos: How Phishing Sites Impersonate Zara & H&M',
    excerpt: 'Clicking that WhatsApp link for an "H&M 90% Anniversary Sale" could lead to your credit card details being stolen.',
    readTime: '3 min read',
    category: 'threat-intel',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    content: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop', alt: 'Shopping Mall' },
      { type: 'heading', text: 'The Viral Forward' },
      { type: 'paragraph', text: 'A message goes viral on WhatsApp claiming a massive anniversary sale for Zara or H&M. The link takes you to a website that looks exactly like the official store.' },
      { type: 'alert', variant: 'danger', title: 'Data Theft', text: 'These are phishing sites hosted on domains like "zara-sale-offer.in". Any payment made here doesn\'t just lose you money; it gives hackers your complete credit card information.' },
      { type: 'paragraph', text: 'Always verify the URL. If you aren\'t on the official domain, close the tab immediately. TrueStyle\'s FirstSite URL verification checks the domain registry age to block newly created phishing links.' }
    ]
  },
  {
    id: 'art-factory-reject',
    title: 'The "Factory Reject" Myth: Unmasking Counterfeit Sellers',
    excerpt: 'Sellers claim their shoes have "minor glue defects" to explain why they are cheap. It is a lie to sell you fakes.',
    readTime: '4 min read',
    category: 'cybersec',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
    content: [
      { type: 'image', src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop', alt: 'Sneaker Close up' },
      { type: 'heading', text: 'The Clever Excuse' },
      { type: 'paragraph', text: 'Counterfeiters have realized buyers are getting smarter. So, instead of claiming an item is 100% perfect, they claim it is an "unauthorized authentic" or "factory reject" with minor flaws.' },
      { type: 'alert', variant: 'warning', title: 'The Truth', text: 'Major brands destroy factory rejects. They do not hand them to black market sellers. "Factory Reject" is just the modern marketing term for a fake.' },
      { type: 'paragraph', text: 'TrueStyle warns users against falling for this psychological trick. By keeping buyers aware of how scammers operate, we reduce the profitability of the counterfeit industry.' }
    ]
  }
];
