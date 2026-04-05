import { useState } from 'react';

const COURSES = [
  {
    title: 'How to Start a Small Business', icon: '🚀',
    color: '#ffffff', textColor: '#7F77DD', duration: '6 lessons', level: 'Beginner',
    lessons: [
      {
        title: 'Identifying your business idea',
        duration: '8 min',
        content: `Every successful business starts with solving a real problem. Ask yourself:
        
- What am I good at? What skills do I have?
- What problems do people around me face daily?
- Is there something I can make or do better than others?

Examples of great business ideas from everyday life:
- Meena noticed no one sold fresh homemade pickles in her area → started a pickle business
- Priya learned weaving from her grandmother → turned it into a handloom brand
- Anita was always good at making jewellery → started selling online

✅ Action Step: Write down 3 problems you see around you. Pick the one you can solve best.`,
      },
      {
        title: 'Market research basics',
        duration: '10 min',
        content: `Before starting, you need to understand your customers and competition.

How to do simple market research:
1. Talk to 10 potential customers — ask if they would buy your product
2. Search for similar products on Google, Amazon, Flipkart
3. Visit local markets to see what sells and at what price
4. Join Facebook groups related to your product and observe

Key questions to answer:
- Who is my customer? (age, location, income)
- How much will they pay?
- Who are my competitors?
- What makes my product different?

✅ Action Step: Talk to 5 people today about your product idea and write down their feedback.`,
      },
      {
        title: 'Writing a simple business plan',
        duration: '12 min',
        content: `A business plan does not need to be complicated. Here is a simple one-page format:

1. PRODUCT: What are you selling?
   Example: Handmade coconut oil soap bars

2. CUSTOMER: Who will buy it?
   Example: Women aged 25-45 who prefer natural products

3. PRICE: How much will you charge?
   Example: ₹80 per bar (cost: ₹30, profit: ₹50)

4. HOW TO SELL: Where will you sell?
   Example: SafeHer marketplace, local shops, WhatsApp groups

5. MONEY NEEDED TO START: How much investment?
   Example: ₹5,000 for raw materials and packaging

6. MONTHLY TARGET: How much do you want to earn?
   Example: Sell 100 bars/month = ₹8,000 profit

✅ Action Step: Fill in all 6 points above for your own business idea.`,
      },
      {
        title: 'Registering your business in India',
        duration: '9 min',
        content: `You do not need to register immediately, but here are your options as you grow:

STAGE 1 — Just Starting (No Registration Needed)
- Sell as an individual
- Use your personal bank account
- Keep records of income and expenses

STAGE 2 — Growing (Udyam Registration — FREE)
- Register at udyamregistration.gov.in
- Takes 30 minutes, completely free
- Gets you government scheme benefits
- Required for bank loans

STAGE 3 — Established (GST Registration)
- Required if annual turnover exceeds ₹20 Lakhs
- Allows you to sell on Amazon, Flipkart officially
- File quarterly returns

STAGE 4 — Scaling (Private Limited Company)
- Best for raising investment
- Register at mca.gov.in
- Costs around ₹10,000-15,000 with a CA

✅ Action Step: Start with Udyam Registration today — it's free and gives you MSME benefits.`,
      },
      {
        title: 'Pricing your products correctly',
        duration: '11 min',
        content: `Most beginners underprice their products. Here is the correct formula:

COST PRICE FORMULA:
Raw Material Cost + Labour Cost + Packaging Cost + Overhead Cost = Total Cost

SELLING PRICE FORMULA:
Total Cost × 2.5 to 3 = Selling Price (this gives you 60-70% profit margin)

Example — Handmade Candle:
- Wax: ₹30
- Fragrance oil: ₹20
- Jar + wick: ₹15
- Your time (2 hours): ₹40
- Packaging: ₹10
- Total Cost: ₹115
- Selling Price: ₹115 × 2.5 = ₹288 → Round to ₹299

Common Pricing Mistakes:
❌ Forgetting to include your own labour cost
❌ Pricing based on what competitors charge (without knowing their costs)
❌ Giving too many discounts that eat your profit

✅ Action Step: Calculate the exact cost of making one of your products using the formula above.`,
      },
      {
        title: 'Setting up your online store on SafeHer',
        duration: '14 min',
        content: `Congratulations on reaching the final lesson! Here is how to set up your store:

STEP 1 — Register as a Seller
- Click Register on SafeHer
- Select "I want to sell"
- Fill in your name, email and password

STEP 2 — Set Up Your Profile
- Go to My Shop in the navbar
- Add your first product

STEP 3 — Add Your Products
- Product name: Be specific (e.g. "Handmade Rose Petal Soap — 100g" not just "Soap")
- Description: Mention ingredients, size, how it's made
- Price: Use the formula from Lesson 5
- Photos: Take in natural light, clean background

STEP 4 — Promote Your Store
- Share your product links on WhatsApp groups
- Post on Instagram with relevant hashtags
- Ask family and friends to share

STEP 5 — Manage Orders
- Check My Shop daily for new orders
- Pack carefully, ship on time
- Reply to customer questions quickly

✅ You are ready! Add your first product to SafeHer today and start your entrepreneurial journey! 🎉`,
      },
    ],
  },
  {
    title: 'Digital Marketing for Beginners', icon: '📱',
    color: '#ffffff', textColor: '#D4537E', duration: '5 lessons', level: 'Beginner',
    lessons: [
      {
        title: 'Introduction to social media marketing',
        duration: '7 min',
        content: `Social media is the most powerful free marketing tool for small businesses.

The 3 best platforms for women entrepreneurs in India:

1. WHATSAPP BUSINESS
- Best for: Direct sales, customer service
- How to use: Create a business profile, share product catalogue, use broadcast lists
- Tip: Keep a separate WhatsApp Business number from personal

2. INSTAGRAM
- Best for: Visual products (jewellery, clothing, food, crafts)
- How to use: Post product photos, use Reels for more reach, use Stories daily
- Tip: Post at 8-10 AM or 7-9 PM for maximum engagement

3. FACEBOOK
- Best for: Reaching customers aged 30-50, running ads
- How to use: Create a Facebook Page, join local buy/sell groups
- Tip: Facebook groups in your city/state are goldmines for local sales

Content Formula (3-2-1 Rule):
- 3 posts about your products
- 2 posts about behind-the-scenes/your story
- 1 post asking a question or running a poll

✅ Action Step: Create a WhatsApp Business account today and set up your product catalogue.`,
      },
      {
        title: 'Taking great product photos with your phone',
        duration: '10 min',
        content: `You do NOT need an expensive camera. Your phone camera is enough if you follow these tips:

LIGHTING (Most Important):
- Always shoot near a window with natural light
- Never use the camera flash — it creates harsh shadows
- Cloudy days give the softest, most beautiful light
- Shoot between 9 AM - 11 AM or 4 PM - 6 PM for best light

BACKGROUND:
- Use a white or neutral background (a white bedsheet works!)
- You can also use coloured paper or wooden surfaces
- Remove all clutter from the background
- Marble tiles, wooden boards, fabric — all make great backgrounds

COMPOSITION:
- Fill 70% of the frame with your product
- Try flat lay shots (product photographed from above)
- Show the product in use (model wearing jewellery, candle lit, food plated)
- Take 20+ photos, pick the best 3-4

FREE EDITING APPS:
- Snapseed — best for brightness and contrast
- Lightroom Mobile — best for professional colour grading
- Canva — best for adding text and branding

✅ Action Step: Take 10 photos of your best product using these tips and compare with your previous photos.`,
      },
      {
        title: 'Writing product descriptions that sell',
        duration: '8 min',
        content: `A good product description answers these 5 questions:

1. WHAT IS IT? (Clear and specific)
   ❌ "Handmade soap"
   ✅ "Cold-pressed goat milk soap with lavender and shea butter — 100g"

2. WHO IS IT FOR?
   ❌ "For everyone"
   ✅ "Perfect for women with dry or sensitive skin"

3. WHAT DOES IT DO?
   ❌ "Good for skin"
   ✅ "Deeply moisturises, reduces dryness and leaves skin soft within 7 days"

4. WHAT MAKES IT SPECIAL?
   ❌ "Handmade with care"
   ✅ "Made using a 3-generation old recipe from Kerala, with zero chemicals"

5. WHAT SHOULD THEY DO?
   ❌ Nothing
   ✅ "Order today — only 12 pieces left!"

POWER WORDS that increase sales:
Handcrafted, Authentic, Limited Edition, Natural, Traditional, Artisan, Pure, Organic, Exclusive

✅ Action Step: Rewrite your best product description using this 5-question formula.`,
      },
      {
        title: 'Running your first Facebook/Instagram ad',
        duration: '15 min',
        content: `You can run an effective ad with just ₹100-200 per day. Here is how:

BEFORE YOU START:
- You need a Facebook Page (not personal profile)
- Connect Instagram to your Facebook Page
- Have a clear product photo and description ready

STEP-BY-STEP AD SETUP:
1. Go to facebook.com/adsmanager
2. Click "Create Campaign"
3. Choose Objective: "Traffic" (to your SafeHer store) or "Engagement"
4. Set Budget: Start with ₹100/day
5. Set Audience:
   • Location: Your state or nearby cities
   • Age: 22-45
   • Interests: Handmade products, ethnic wear, natural beauty, etc.
6. Upload your best product photo
7. Write a short caption: Problem → Solution → Call to Action
8. Click Publish

SAMPLE AD CAPTION:
"Tired of chemical soaps drying out your skin? 🌿 Try our pure coconut milk soap, handmade with love in Kerala. Free delivery across India. Shop now → [link]"

MEASURING SUCCESS:
- Cost per click should be under ₹5
- If it's higher, change your photo or caption
- Run for 3-4 days before judging results

✅ Action Step: Create your first Facebook Page and boost your best post with ₹50.`,
      },
      {
        title: 'Building a loyal customer base',
        duration: '12 min',
        content: `Getting a new customer costs 5x more than keeping an existing one. Focus on loyalty!

AFTER EVERY SALE:
- Send a thank you message personally
- Ask for feedback after delivery
- Follow up after 7 days: "How are you enjoying the product?"

TURNING CUSTOMERS INTO FANS:
- Include a handwritten thank you note with every order
- Give a small freebie with repeat orders
- Create a "Loyal Customer" WhatsApp group with exclusive deals
- Give a discount code for their second purchase

GETTING REVIEWS:
- Ask nicely: "Would you mind leaving a review on SafeHer? It really helps our small business"
- Make it easy — send the direct link
- Never offer money for reviews — it's against policy and unethical

REFERRAL STRATEGY:
- "Refer a friend and get ₹50 off your next order"
- This is the cheapest and most effective marketing
- Happy customers are your best salespeople

WHAT TO DO WHEN SOMETHING GOES WRONG:
- Respond within 2 hours
- Apologise sincerely even if not fully your fault
- Offer a refund or replacement without argument
- A resolved complaint often creates a more loyal customer than a smooth transaction

✅ Action Step: Message your last 5 customers today and ask them how they liked the product.`,
      },
    ],
  },
  {
    title: 'Financial Literacy for Entrepreneurs', icon: '💰',
    color: '#ffffff', textColor: '#BA7517', duration: '5 lessons', level: 'Intermediate',
    lessons: [
      {
        title: 'Understanding profit and loss',
        duration: '9 min',
        content: `Every business owner must understand these 3 numbers:

REVENUE = Total money coming in from sales
EXPENSES = Total money going out (materials, packaging, shipping, etc.)
PROFIT = Revenue - Expenses

Example for a month:
- You sold 50 soap bars at ₹200 each = ₹10,000 Revenue
- Materials cost ₹3,000
- Packaging cost ₹1,000
- Shipping cost ₹500
- Total Expenses = ₹4,500
- NET PROFIT = ₹10,000 - ₹4,500 = ₹5,500

PROFIT MARGIN = (Profit / Revenue) × 100
= (5,500 / 10,000) × 100 = 55%

A good profit margin for handmade products is 50-70%.

HOW TO TRACK DAILY:
- Keep a simple notebook: Date | Sale Amount | Expense | Balance
- Or use a free app like Khatabook or OkCredit (designed for Indian small businesses)
- Review your numbers every Sunday evening

✅ Action Step: Calculate last month's profit or loss using the formula above.`,
      },
      {
        title: 'Managing cash flow',
        duration: '11 min',
        content: `Cash flow means the money actually available to you right now — not what you are owed.

THE GOLDEN RULE: Never spend money you haven't received yet.

Common Cash Flow Problems for Small Businesses:
1. Buying too much stock before getting orders
2. Offering credit to buyers without a clear repayment date
3. Not setting aside money for next month's materials
4. Mixing personal and business money

THE 50-30-20 RULE FOR BUSINESS MONEY:
- 50% — Back into business (materials, packaging, marketing)
- 30% — Your personal salary/income
- 20% — Savings and emergency fund

SEASONAL CASH FLOW:
- Festival seasons (Diwali, Christmas, Eid) bring 3-4x normal sales
- Prepare stock 2 months before the festival season
- Save money during slow months for this preparation

TIPS:
- Always have at least 2 months of operating costs saved
- If a customer hasn't paid, follow up politely after 7 days
- Consider asking for 50% payment upfront for custom orders

✅ Action Step: Open a separate bank account for your business today — even a simple savings account.`,
      },
      {
        title: 'Opening a business bank account',
        duration: '7 min',
        content: `Keeping business money separate from personal money is critical. Here's how:

OPTION 1 — Current Account (Best for businesses)
Banks: SBI, Bank of Baroda, Canara Bank, HDFC
Documents needed: Aadhaar, PAN, Udyam registration (if registered)
Monthly fees: ₹0-500 depending on bank
Benefits: No limits on transactions, cheque book, business name on account

OPTION 2 — Jan Dhan Account (Best for beginners)
- Zero balance account — no minimum balance required
- Available at all government banks
- Free RuPay debit card included
- Perfect starting point if you don't have a large business yet

OPTION 3 — Business Account with Paytm/PhonePe for Business
- Instant setup on your phone
- Accept UPI payments directly
- Track all transactions in the app
- Free for small businesses

WHAT TO DO WITH YOUR BUSINESS ACCOUNT:
- All customer payments go here
- All business expenses paid from here
- Transfer your "salary" to personal account on a fixed date
- Keep all account statements — needed for loan applications

✅ Action Step: Visit your nearest bank this week and open a current account for your business.`,
      },
      {
        title: 'Filing GST as a small business',
        duration: '13 min',
        content: `GST (Goods and Services Tax) is mandatory only if your annual turnover exceeds ₹20 Lakhs.

DO YOU NEED GST?
- Below ₹20 Lakhs/year: No GST registration needed
- Above ₹20 Lakhs/year: Must register
- Selling on Amazon/Flipkart: GST mandatory regardless of turnover
- Exporting products: GST registration beneficial

IF YOU NEED TO REGISTER:
1. Go to gst.gov.in
2. Click "New Registration"
3. Fill in business details
4. Upload: PAN, Aadhaar, bank statement, address proof
5. Verification takes 3-7 working days
6. You receive a GSTIN (15-digit number)

FILING RETURNS:
- GSTR-1: Monthly — details of sales (file by 11th of each month)
- GSTR-3B: Monthly — summary return (file by 20th of each month)
- Annual Return: Once a year

COST OF COMPLIANCE:
- Hire a CA or accountant: ₹500-1,500/month for small businesses
- Use apps like ClearTax or Zoho Books for easy filing
- Government portal is free to use yourself

✅ Action Step: Calculate your last 12 months of sales to check if you need GST registration.`,
      },
      {
        title: 'Applying for a business loan',
        duration: '10 min',
        content: `Getting a business loan is easier than most people think. Here is the complete guide:

TYPES OF LOANS FOR WOMEN ENTREPRENEURS:

1. Mudra Loan (Most Popular)
- Amount: ₹50,000 to ₹10 Lakhs
- No collateral needed
- Apply at any nationalised bank or NBFC
- Interest rate: 8-12% per year

2. Stree Shakti Scheme (SBI)
- Amount: Up to ₹25 Lakhs
- 0.5% interest concession for women
- Need: Business plan, Udyam registration

3. CGTMSE Scheme
- Government guarantees your loan
- Banks cannot ask for collateral
- Perfect for businesses without property

DOCUMENTS USUALLY NEEDED:
- Aadhaar and PAN card
- Bank statements (last 6 months)
- Business registration (Udyam)
- Proof of business address
- 6-month income/sales record (even a notebook is accepted)

TIPS FOR GETTING APPROVED:
- Maintain a good credit score (check free on CIBIL app)
- Start with a small loan and repay on time to build credit history
- Visit a bank where you already have an account — they know you
- Bring your Udyam certificate — it shows you are serious

✅ Action Step: Check your CIBIL score for free today at cibil.com using your PAN card.`,
      },
    ],
  },
  {
    title: 'Packaging & Branding Your Products', icon: '🎁',
    color: '#ffffff', textColor: '#0F6E56', duration: '4 lessons', level: 'Beginner',
    lessons: [
      {
        title: 'Why packaging matters',
        duration: '6 min',
        content: `Packaging is the first physical thing your customer touches. It sets expectations before they even use your product.

THE UNBOXING EFFECT:
Studies show that 72% of buyers say packaging design influences their purchase decision. And 40% share products with attractive packaging on social media — giving you free marketing!

What Good Packaging Does:
1. Protects the product during shipping
2. Communicates your brand values
3. Creates a memorable first impression
4. Encourages repeat purchases and gifting

PACKAGING LEVELS:
- Level 1 — Basic: Plain box or bag with a printed sticker label (₹5-15 per unit)
- Level 2 — Standard: Branded kraft paper box with tissue paper (₹20-40 per unit)
- Level 3 — Premium: Custom printed box with ribbon and handwritten note (₹50-100 per unit)

Start with Level 1 and move up as you grow. Even a simple sticker with your brand name and logo makes a huge difference.

THE HANDWRITTEN NOTE:
A small handwritten "Thank you [customer name]!" increases repeat purchase rate by 25%. It takes 30 seconds and costs nothing.

✅ Action Step: Design a simple sticker label for your product on Canva (free) today.`,
      },
      {
        title: 'Low-cost packaging ideas',
        duration: '9 min',
        content: `You do not need to spend a lot to have beautiful packaging. Here are ideas at every budget:

UNDER ₹10 PER UNIT:
- Kraft paper bags with a washi tape seal
- Newspaper wrapped with a twine bow (eco-friendly and unique!)
- Plain ziplock bags with a branded sticker
- Brown paper boxes from local stationery shop with your sticker

₹10-30 PER UNIT:
- Custom stickers (order 500 from Vistaprint for ₹800 = ₹1.6 each)
- Branded tissue paper to wrap items inside
- Small thank you cards (print at local shop)
- Organza bags for jewellery (₹10-15 each on Meesho)

₹30-60 PER UNIT:
- Custom printed kraft boxes (MOQ 50 units from IndiaMART)
- Stamped or printed fabric bags
- Glass jars with branded labels for food items

WHERE TO ORDER PACKAGING IN INDIA:
- IndiaMART.com — bulk custom packaging
- Amazon Business — ready-made boxes and bags
- Local stationary market — cheapest option
- Canva + local printer — for stickers and cards

ECO-FRIENDLY IDEAS (customers love this):
- Seed paper packaging that customers can plant
- Newspaper wrapping instead of bubble wrap
- Reusable cloth bags as packaging

✅ Action Step: Order 100 custom stickers with your brand name and logo this week.`,
      },
      {
        title: 'Creating your brand logo for free',
        duration: '12 min',
        content: `A logo is not just a design — it is your identity. Here is how to create one free:

USING CANVA (Easiest Option):
1. Go to canva.com (free account)
2. Search "Logo" in templates
3. Choose a template that matches your brand feel
4. Change: Company name, colours, font, icon
5. Download as PNG (transparent background)
6. Total time: 30-60 minutes

WHAT MAKES A GOOD LOGO:
- Simple — should be recognisable even at small sizes
- Relevant — reflects what you sell
- Memorable — unique enough to remember
- Versatile — looks good in black and white too

CHOOSING YOUR BRAND COLOURS:
- Purple/Violet: Trust, luxury, creativity (great for beauty, jewellery)
- Green: Natural, healthy, eco-friendly (great for food, wellness)
- Red/Orange: Energy, warmth, appetite (great for food businesses)
- Blue: Trust, reliability, calm (great for service businesses)
- Pink: Feminine, soft, caring (great for handmade, gifts)

CHOOSING YOUR FONT:
- Serif fonts (like Times New Roman style): Traditional, trustworthy
- Script fonts (handwritten): Personal, artisan, handmade
- Sans-serif (clean, modern): Professional, contemporary

FREE TOOLS:
- Canva.com — best for beginners
- Looka.com — AI generates logo options
- Namecheap Logo Maker — free

✅ Action Step: Create your brand logo on Canva today. Share it with 5 friends for feedback.`,
      },
      {
        title: 'Building customer trust through branding',
        duration: '8 min',
        content: `Branding is not just a logo — it is the complete feeling people get when they think of your business.

THE 5 ELEMENTS OF A STRONG BRAND:

1. BRAND NAME
- Easy to pronounce and remember
- Tells a story or has meaning
- Example: "Priya's Kitchen" is more personal than "PK Foods"

2. BRAND STORY
- Why did you start this business?
- What problem does it solve?
- What makes you personally connected to this product?
- Share this story on your packaging, website and social media

3. CONSISTENT VISUAL IDENTITY
- Use the same colours, fonts and logo everywhere
- Your Instagram, WhatsApp DP, packaging and website should all look the same
- Consistency builds recognition and trust

4. BRAND VOICE
- How do you speak to customers?
- Warm and personal? Professional? Fun and energetic?
- Whatever you choose, be consistent

5. SOCIAL PROOF
- Customer photos using your product
- Reviews and testimonials
- "As seen in" or any press mentions
- Number of happy customers served

THE TRUST LADDER:
First time visitor → Curious buyer → First purchase → Satisfied customer → Repeat buyer → Brand advocate (tells others)

Your goal is to move every customer up this ladder.

✅ Action Step: Write your brand story in 5 sentences. Pin it above your workspace as a daily reminder of why you do this.`,
      },
    ],
  },
  {
    title: 'Legal Rights of Women Entrepreneurs', icon: '⚖️',
    color: '#ffffff', textColor: '#185FA5', duration: '4 lessons', level: 'All Levels',
    lessons: [
      {
        title: 'Business structures in India',
        duration: '10 min',
        content: `Choosing the right business structure affects your taxes, liability and growth options.

1. SOLE PROPRIETORSHIP (Best for beginners)
- You and the business are the same legally
- No registration needed to start
- Simplest and cheapest to set up
- You are personally responsible for all debts
- Best for: Small home businesses, freelancers, solo craftswomen

2. PARTNERSHIP
- Two or more people running a business together
- Create a Partnership Deed (agreement document)
- Each partner is liable for the business's debts
- Best for: Sisters, friends or family starting together

3. LIMITED LIABILITY PARTNERSHIP (LLP)
- Partners are NOT personally liable for business debts
- More credible for clients and banks
- Registration cost: ₹5,000-10,000
- Best for: Growing businesses with 2+ partners

4. PRIVATE LIMITED COMPANY (Pvt Ltd)
- Separate legal identity from founders
- Can raise investment from investors
- Most credible business structure
- Registration cost: ₹10,000-20,000 with a CA
- Best for: Businesses planning to scale significantly

RECOMMENDATION FOR MOST WOMEN ON SAFEHER:
Start as Sole Proprietorship → Get Udyam Registration → Move to LLP or Pvt Ltd when you exceed ₹10 Lakhs annual revenue

✅ Action Step: Register for free Udyam MSME certificate at udyamregistration.gov.in`,
      },
      {
        title: 'Intellectual property basics',
        duration: '8 min',
        content: `Your business ideas, designs and brand name are valuable assets that need protection.

1. TRADEMARK (Protect your brand name and logo)
- Prevents others from using your brand name
- Register at ipindia.gov.in
- Cost: ₹4,500 for small businesses (reduced fee for women)
- Processing time: 18-24 months
- Valid for 10 years, renewable

Why it matters: If you build a popular brand and don't trademark it, someone else can register your name and force you to stop using it.

2. COPYRIGHT (Protects creative works automatically)
- Your original photos, designs, patterns and written content are automatically protected
- No registration needed in India
- Keep dated records (email yourself original designs)
- If someone copies your work, you can send a legal notice

3. TRADE SECRET (Protect your recipes and processes)
- Keep your formulas, recipes and processes confidential
- Have employees sign Non-Disclosure Agreements (NDAs)
- Don't share complete recipes even with friends

WHAT TO DO IF SOMEONE COPIES YOU:
1. Document everything — screenshots, dates, evidence
2. Send a polite but firm cease and desist message first
3. Contact IP India helpline: 1800-111-549
4. Consult a lawyer if serious — many offer free first consultations

✅ Action Step: Apply for trademark of your brand name at ipindia.gov.in`,
      },
      {
        title: 'Consumer protection laws',
        duration: '9 min',
        content: `As a seller, you have legal obligations to your customers. Understanding these protects both you and them.

THE CONSUMER PROTECTION ACT 2019 — KEY POINTS:

YOUR OBLIGATIONS AS A SELLER:
- Provide accurate product descriptions — don't mislead buyers
- Honour your stated return/refund policy
- Deliver within the promised timeframe
- Not use unfair trade practices

CUSTOMER RIGHTS YOU MUST RESPECT:
1. Right to Safety — product must not harm the buyer
2. Right to Information — all ingredients/materials must be disclosed
3. Right to Choose — no forced bundling
4. Right to be Heard — must respond to complaints
5. Right to Redressal — must provide refund/replacement for defective goods

WHEN A CUSTOMER COMPLAINS:
- Respond within 48 hours
- Offer solution: replacement, refund, or discount on next purchase
- Keep records of all transactions and communications
- Do not argue or be defensive — stay professional

E-COMMERCE SPECIFIC RULES (2021 Rules):
- Must display: Product name, price, country of origin, seller details
- Grievance Officer contact must be available
- Must not charge hidden fees

COMPLAINT ESCALATION:
- Customer can file complaint at consumerhelpline.gov.in
- Or call 1915 (National Consumer Helpline — free)
- District Consumer Forum handles disputes under ₹1 Crore

✅ Action Step: Write a clear return policy for your products and add it to your SafeHer product listings.`,
      },
      {
        title: "Women's legal protections in business",
        duration: '11 min',
        content: `India has several laws specifically protecting women entrepreneurs. Know your rights!

1. PROTECTION FROM WORKPLACE HARASSMENT
- Sexual Harassment of Women at Workplace Act (POSH) 2013
- Applies to all workplaces including home-based businesses with employees
- Must have Internal Complaints Committee if you have 10+ employees
- Contact: Helpline 181 (Women Helpline — 24x7, free)

2. MATERNITY BENEFIT ACT
- If you employ women, they are entitled to 26 weeks paid maternity leave
- Cannot terminate employment during maternity leave
- Crèche facility mandatory if you have 50+ employees

3. EQUAL REMUNERATION ACT
- Must pay equal wages for equal work regardless of gender
- Cannot discriminate in hiring based on gender

4. PROTECTIONS SPECIFICALLY FOR WOMEN ENTREPRENEURS:
- Priority processing for loans under government schemes
- Reduced fees for Udyam and trademark registration
- Reserved seats in government procurement tenders (25% for women-led MSMEs)
- Preferential treatment in Startup India recognition

5. IF YOU FACE DISCRIMINATION OR HARASSMENT IN BUSINESS:
- National Commission for Women: ncw.nic.in
- Helpline: 7827170170
- Women Entrepreneurship Platform: wep.gov.in
- Legal aid (free): nalsa.gov.in (National Legal Services Authority)

IMPORTANT GOVERNMENT PORTALS FOR WOMEN:
- wep.gov.in — Women Entrepreneurship Platform (Government of India)
- ondc.org — Open Network for Digital Commerce (sell everywhere)
- gem.gov.in — Government e-Marketplace (sell to government)

✅ Action Step: Register your business on wep.gov.in to access all government benefits for women entrepreneurs.`,
      },
    ],
  },
  {
    title: 'Shipping & Order Management', icon: '📦',
    color: '#ffffff', textColor: '#854F0B', duration: '4 lessons', level: 'Beginner',
    lessons: [
      {
        title: 'Setting up shipping on SafeHer',
        duration: '7 min',
        content: `Shipping is one of the most important parts of running an online business. Here is everything you need to know:

HOW SHIPPING WORKS ON SAFEHER:
1. Customer places an order with their delivery address
2. You receive a notification in My Shop
3. You pack the order carefully
4. You hand it to a courier partner
5. Customer receives the order and can track it

COURIER PARTNERS YOU CAN USE:
- Delhivery — best rates for pan-India shipping, easy pickup
- Shiprocket — aggregator, gives you access to multiple couriers from one dashboard
- India Post Speed Post — cheapest option, reliable for small towns
- DTDC — good network in tier 2 and tier 3 cities
- Blue Dart — premium, best for fragile items

TYPICAL SHIPPING RATES:
- 500g package: ₹40-80 within state, ₹60-120 inter-state
- 1kg package: ₹60-100 within state, ₹90-150 inter-state
- Use Shiprocket rate calculator to compare prices

OFFERING FREE SHIPPING:
- Build shipping cost into your product price
- "Free shipping on orders above ₹499" increases average order value
- SafeHer recommends offering free shipping as it increases conversions by 30%

✅ Action Step: Create a free account on Shiprocket (shiprocket.in) and explore their rates.`,
      },
      {
        title: 'Packaging orders safely for shipping',
        duration: '8 min',
        content: `Poor packaging leads to damaged products, returns, bad reviews and losses. Pack smart!

THE GOLDEN RULE: If you would not be happy receiving it packaged this way, don't send it.

PACKAGING MATERIALS YOU NEED:
- Bubble wrap or newspaper — for cushioning fragile items
- Brown kraft paper — for wrapping
- Corrugated boxes — for rigid protection
- BOPP tape (brown tape) — seal all edges completely
- Address labels — print clearly or write with permanent marker

PACKING PROCESS STEP BY STEP:
1. Wrap the product in tissue paper first (for presentation)
2. Wrap fragile items in bubble wrap (minimum 2 layers)
3. Place in box with at least 2cm of cushioning on all sides
4. Fill empty space with newspaper or foam peanuts
5. Close and tape all edges and corners
6. Write/print address label clearly
7. Add "Fragile" or "Handle with Care" sticker if needed

WEIGHT AND SIZE TIPS:
- Weigh all packed orders on a kitchen scale before quoting shipping
- Couriers charge by actual weight OR volumetric weight (whichever is higher)
- Volumetric weight formula: L × W × H (in cm) ÷ 5000

SEALING:
- Use minimum 3 rounds of tape on all seams
- For liquids: double-seal in a ziplock bag first, then box
- For powders: seal in airtight container, then wrap

✅ Action Step: Buy a kitchen weighing scale (₹200-300 on Amazon) for accurate shipping cost calculation.`,
      },
      {
        title: 'Working with courier partners',
        duration: '9 min',
        content: `Building a good relationship with courier partners saves you time, money and headaches.

HOW TO GET THE BEST RATES:
- Volume matters — the more you ship, the lower your rates
- Negotiate after shipping 50+ orders per month
- Shiprocket gives discounted rates even for small sellers

PICKUP VS DROPOFF:
- Pickup: Courier comes to your home/shop (convenient, slightly more expensive)
- Dropoff: You take packages to their nearest facility (cheaper, takes your time)
- Most sellers with daily orders prefer pickup

TRACKING AND COMMUNICATION:
- Always share tracking number with customer immediately after dispatch
- Good message: "Your order #[X] has been dispatched! Track here: [link]. Expected delivery in 3-5 days."
- Use WhatsApp to send tracking updates — customers appreciate this

HANDLING COURIER ISSUES:
- Lost package: File complaint with courier immediately. Keep all receipts.
- Damaged package: Take photos immediately upon delivery (before customer opens)
- Delivery failure: Verify address with customer and reschedule

COD (Cash on Delivery) VS PREPAID:
- COD: Customer pays at delivery. Higher acceptance but courier deducts their fee.
- Prepaid: Customer pays online. Faster payment for you, lower returns.
- Recommendation: Offer both options. Prepaid gives 10% discount to encourage online payment.

✅ Action Step: Ship your first order using India Post Speed Post — it is the simplest way to start.`,
      },
      {
        title: 'Handling returns and complaints professionally',
        duration: '10 min',
        content: `Returns and complaints are a normal part of business. How you handle them defines your brand reputation.

YOUR RETURN POLICY SHOULD COVER:
- How many days customer has to raise a return request (recommend 7 days)
- What condition the product must be in
- Who pays return shipping
- How refund is processed (original payment method, within how many days)

TYPES OF COMPLAINTS AND HOW TO HANDLE:

1. WRONG PRODUCT SENT
Response: "I sincerely apologise. I will send the correct product immediately and arrange for the wrong one to be picked up. No need to return until correct item arrives."

2. DAMAGED PRODUCT
Response: "I am so sorry this happened. Please send me photos of the damage. I will send a replacement within 2 days at no extra cost."

3. PRODUCT NOT AS DESCRIBED
Response: "I apologise for the confusion. Let me offer you a full refund or a replacement. Your satisfaction is my priority."

4. LATE DELIVERY
Response: "I understand your frustration. The delay was due to [courier issue/festival rush]. Your order is on its way and will arrive by [date]. Here is a 10% discount on your next order."

THE MAGIC PHRASE THAT RESOLVES 90% OF COMPLAINTS:
"I completely understand your frustration and I am going to make this right for you."

WHEN TO OFFER A REFUND WITHOUT QUESTION:
- Product arrived damaged
- Wrong item sent
- Significant quality difference from listing
- Delivery delay exceeding 15 days

WHAT TO NEVER DO:
- Never argue with a customer publicly
- Never delay response beyond 24 hours
- Never offer a partial refund without explanation
- Never blame the courier to the customer (it is your responsibility)

✅ Action Step: Write a return policy for your business right now. Keep it fair, clear and simple.`,
      },
    ],
  },
];

const TIPS = [
  { icon: '📸', tip: 'Use natural light for product photos — it makes products look 3x more appealing.' },
  { icon: '💬', tip: 'Reply to customer messages within 2 hours — it increases conversion by 40%.' },
  { icon: '🎯', tip: 'Focus on one product category first. Master it before expanding.' },
  { icon: '📊', tip: 'Track your best-selling products weekly and keep them always in stock.' },
  { icon: '🌟', tip: 'Ask happy customers for reviews — social proof is your best marketing.' },
  { icon: '💡', tip: 'Create festival-specific products — Diwali, Eid, Christmas drive 60% more sales.' },
];

export default function Learn() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});

  const toggleLesson = (courseTitle, lessonIndex) => {
    const key = `${courseTitle}-${lessonIndex}`;
    setCompletedLessons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getCourseProgress = (course) => {
    const done = course.lessons.filter((_, i) =>
      completedLessons[`${course.title}-${i}`]
    ).length;
    return Math.round((done / course.lessons.length) * 100);
  };

  if (selectedLesson) {
    const { course, lesson, index } = selectedLesson;
    return (
      <div style={{ maxWidth: 760, margin: '32px auto', padding: '0 24px 60px' }}>
        <button onClick={() => setSelectedLesson(null)} style={{
          background: 'none', border: '1.5px solid #ede8ff', color: '#7F77DD',
          padding: '8px 16px', borderRadius: 10, fontSize: 13,
          fontWeight: 500, marginBottom: 24, cursor: 'pointer' }}>
          ← Back to Course
        </button>
        <div style={{ background: '#fff', borderRadius: 20, padding: 36,
          boxShadow: '0 4px 32px rgba(127,119,221,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 20 }}>
            <span style={{ fontSize: 36 }}>{course.icon}</span>
            <div>
              <p style={{ fontSize: 12, color: '#aaa', marginBottom: 2 }}>
                {course.title} · Lesson {index + 1}
              </p>
              <h2 style={{ fontFamily: 'Playfair Display, serif',
                fontSize: 22, fontWeight: 600 }}>{lesson.title}</h2>
            </div>
          </div>
          <div style={{ background: '#f7f5ff', borderRadius: 12, padding: 24,
            marginBottom: 24, fontSize: 14, color: '#444', lineHeight: 2,
            whiteSpace: 'pre-line', border: '1px solid #ede8ff' }}>
            {lesson.content}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => {
              toggleLesson(course.title, index);
              setSelectedLesson(null);
            }} style={{
              background: completedLessons[`${course.title}-${index}`]
                ? '#f0eeff' : 'linear-gradient(135deg, #7F77DD, #D4537E)',
              color: completedLessons[`${course.title}-${index}`]
                ? '#7F77DD' : '#fff',
              border: completedLessons[`${course.title}-${index}`]
                ? '1.5px solid #7F77DD' : 'none',
              padding: '12px 24px', borderRadius: 10, fontSize: 14,
              fontWeight: 600, cursor: 'pointer' }}>
              {completedLessons[`${course.title}-${index}`]
                ? '↩ Mark as Incomplete' : '✓ Mark as Complete'}
            </button>
            {index < course.lessons.length - 1 && (
              <button onClick={() => {
                if (!completedLessons[`${course.title}-${index}`])
                  toggleLesson(course.title, index);
                setSelectedLesson({
                  course,
                  lesson: course.lessons[index + 1],
                  index: index + 1
                });
              }} style={{
                background: '#f0eeff', color: '#7F77DD',
                border: '1.5px solid #7F77DD', padding: '12px 24px',
                borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: 'pointer' }}>
                Next Lesson →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    const course = selectedCourse;
    const progress = getCourseProgress(course);
    return (
      <div style={{ maxWidth: 760, margin: '32px auto', padding: '0 24px 60px' }}>
        <button onClick={() => setSelectedCourse(null)} style={{
          background: 'none', border: '1.5px solid #ede8ff', color: '#7F77DD',
          padding: '8px 16px', borderRadius: 10, fontSize: 13,
          fontWeight: 500, marginBottom: 24, cursor: 'pointer' }}>
          ← Back to Courses
        </button>
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 4px 32px rgba(127,119,221,0.12)' }}>
          <div style={{ background: `linear-gradient(135deg, ${course.color}, #fff)`,
            padding: '32px' }}>
            <span style={{ fontSize: 48 }}>{course.icon}</span>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26,
              fontWeight: 600, marginTop: 12, marginBottom: 8 }}>
              {course.title}
            </h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.8)',
                color: course.textColor, padding: '4px 12px',
                borderRadius: 20, fontWeight: 500 }}>{course.duration}</span>
              <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.8)',
                color: '#888', padding: '4px 12px',
                borderRadius: 20 }}>{course.level}</span>
            </div>
            {progress > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: '#555' }}>Progress</span>
                  <span style={{ fontWeight: 600,
                    color: course.textColor }}>{progress}%</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.5)',
                  borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4,
                    background: `linear-gradient(90deg, ${course.textColor}, #D4537E)`,
                    width: `${progress}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: '24px 32px' }}>
            {course.lessons.map((lesson, i) => {
              const key = `${course.title}-${i}`;
              const done = completedLessons[key];
              return (
                <div key={i} onClick={() => setSelectedLesson({ course, lesson, index: i })}
                  style={{ display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 12, marginBottom: 8,
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: done ? '#f0fff4' : '#faf9ff',
                    border: `1.5px solid ${done ? '#b2f5d0' : '#f0eeff'}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%',
                    background: done
                      ? 'linear-gradient(135deg, #1D9E75, #0F6E56)' : '#f0eeff',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                    color: done ? '#fff' : '#7F77DD',
                    fontSize: done ? 14 : 13, fontWeight: 600 }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500,
                      color: done ? '#0F6E56' : '#1a1a2e' }}>
                      {lesson.title}
                    </p>
                  </div>
                  <span style={{ fontSize: 12, color: '#aaa',
                    flexShrink: 0 }}>{lesson.duration}</span>
                  <span style={{ fontSize: 12, color: '#7F77DD' }}>→</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 60px' }}>
      <div style={{ background: 'linear-gradient(135deg, #185FA5, #7F77DD)',
        borderRadius: 20, padding: '48px 40px', marginBottom: 48,
        color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220,
          height: 220, borderRadius: '50%',
          background: 'rgba(255,255,255,0.07)' }} />
        <p style={{ fontSize: 12, fontWeight: 600, opacity: 0.75,
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          Free Learning Resources
        </p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 40,
          fontWeight: 600, marginBottom: 12 }}>Learning Hub</h1>
        <p style={{ opacity: 0.85, fontSize: 16, maxWidth: 520, lineHeight: 1.7 }}>
          Free business courses designed specifically for women entrepreneurs.
          Click any lesson to read the full content and mark it complete.
        </p>
      </div>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24,
        fontWeight: 600, marginBottom: 20 }}>Free Courses</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
        gap: 20, marginBottom: 48 }}>
        {COURSES.map(course => {
          const progress = getCourseProgress(course);
          return (
            <div key={course.title} onClick={() => setSelectedCourse(course)}
              style={{ background: '#fff', borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(127,119,221,0.08)', cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '0.5px solid #f0eeff' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(127,119,221,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 16px rgba(127,119,221,0.08)';
              }}>
              <div style={{ background: course.color, padding: '24px 20px 16px' }}>
                <span style={{ fontSize: 36 }}>{course.icon}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 10,
                  lineHeight: 1.4, color: '#1a1a2e' }}>{course.title}</h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 8,
                  flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.7)',
                    color: course.textColor, padding: '3px 8px',
                    borderRadius: 20, fontWeight: 500 }}>{course.duration}</span>
                  <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.7)',
                    color: '#888', padding: '3px 8px',
                    borderRadius: 20 }}>{course.level}</span>
                </div>
              </div>
              <div style={{ padding: '14px 20px 20px' }}>
                {progress > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                      marginBottom: 4, fontSize: 12 }}>
                      <span style={{ color: '#888' }}>Progress</span>
                      <span style={{ fontWeight: 600,
                        color: course.textColor }}>{progress}%</span>
                    </div>
                    <div style={{ height: 6, background: '#f0eeff',
                      borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3,
                        background: `linear-gradient(90deg, ${course.textColor}, #D4537E)`,
                        width: `${progress}%` }} />
                    </div>
                  </div>
                )}
                <button style={{ width: '100%',
                  background: progress === 100 ? '#eafaf3'
                    : progress > 0 ? `linear-gradient(135deg, ${course.textColor}, #D4537E)`
                    : '#f0eeff',
                  color: progress === 100 ? '#0F6E56'
                    : progress > 0 ? '#fff' : course.textColor,
                  border: 'none', padding: '10px', borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {progress === 100 ? '✓ Completed'
                    : progress > 0 ? 'Continue Learning' : 'Start Course →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24,
        fontWeight: 600, marginBottom: 20 }}>Quick Business Tips</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {TIPS.map((t, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: 18,
            boxShadow: '0 2px 12px rgba(127,119,221,0.07)',
            border: '0.5px solid #f0eeff',
            display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{t.icon}</span>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{t.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}