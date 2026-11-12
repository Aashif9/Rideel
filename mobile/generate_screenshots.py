import os
from PIL import Image, ImageDraw, ImageFont

output_dir = r"C:\Users\aashi\OneDrive\Desktop\Rideel\mobile\screenshots"
os.makedirs(output_dir, exist_ok=True)

W, H = 1080, 2340
PRIMARY = (108, 99, 255)       # #6C63FF
PRIMARY_DARK = (90, 82, 224)   # #5A52E0
SECONDARY = (255, 101, 132)    # #FF6584
BG_LIGHT = (248, 249, 254)     # #F8F9FE
SURFACE = (255, 255, 255)
TEXT_DARK = (26, 26, 46)       # #1A1A2E
TEXT_MUTED = (107, 114, 128)   # #6B7280
SUCCESS = (16, 185, 129)       # #10B981
WARNING = (245, 158, 11)       # #F59E0B
BORDER = (229, 231, 235)
LIGHT_PURPLE = (238, 237, 255)

def get_font(size, bold=False):
    font_paths = [
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibri.ttf"
    ]
    if bold:
        font_paths = [
            r"C:\Windows\Fonts\segoeuib.ttf",
            r"C:\Windows\Fonts\arialbd.ttf",
            r"C:\Windows\Fonts\calibrib.ttf"
        ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_status_bar(draw, dark=False):
    fill = (255, 255, 255) if dark else TEXT_DARK
    font = get_font(38, bold=True)
    draw.text((70, 45), "9:41", fill=fill, font=font)
    draw.text((W - 220, 45), "5G  100%", fill=fill, font=font)

def draw_bottom_nav(img, active_idx=0, is_traveler=False):
    draw = ImageDraw.Draw(img)
    nav_h = 220
    y = H - nav_h
    draw.rectangle([0, y, W, H], fill=SURFACE)
    draw.line([0, y, W, y], fill=BORDER, width=2)
    
    items = [
        ("Home", "H"),
        ("Trips" if is_traveler else "Deliveries", "T" if is_traveler else "D"),
        ("Wallet", "W"),
        ("Alerts", "A"),
        ("Profile", "P")
    ]
    step = W // len(items)
    for i, (title, icon) in enumerate(items):
        cx = i * step + step // 2
        color = PRIMARY if i == active_idx else TEXT_MUTED
        font_b = get_font(32, bold=(i == active_idx))
        if i == active_idx:
            draw.rounded_rectangle([cx - 45, y + 25, cx + 45, y + 105], radius=24, fill=LIGHT_PURPLE)
        draw.text((cx - 12, y + 42), icon, fill=color, font=get_font(42, bold=True))
        draw.text((cx - len(title)*9, y + 125), title, fill=color, font=font_b)

def draw_app_bar(draw, title, show_back=True, right_text=""):
    draw.rectangle([0, 110, W, 230], fill=SURFACE)
    draw.line([0, 230, W, 230], fill=BORDER, width=2)
    if show_back:
        draw.text((60, 145), "<", fill=TEXT_DARK, font=get_font(52, bold=True))
        draw.text((140, 145), title, fill=TEXT_DARK, font=get_font(46, bold=True))
    else:
        draw.text((70, 145), title, fill=TEXT_DARK, font=get_font(48, bold=True))
    if right_text:
        draw.text((W - 70 - len(right_text)*22, 150), right_text, fill=PRIMARY, font=get_font(38, bold=True))

# ─── 1. Splash & Onboarding ───────────────────────────────────────────────────
def make_splash_screen():
    img = Image.new("RGB", (W, H), PRIMARY)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw, dark=True)
    
    # Logo container
    cx, cy = W // 2, H // 2 - 200
    draw.rounded_rectangle([cx - 120, cy - 120, cx + 120, cy + 120], radius=50, fill=(255, 255, 255))
    draw.text((cx - 45, cy - 85), "R", fill=PRIMARY, font=get_font(130, bold=True))
    
    # Title
    draw.text((cx - 150, cy + 160), "Rideel", fill=(255, 255, 255), font=get_font(84, bold=True))
    draw.text((cx - 280, cy + 280), "Peer-to-Peer Same-Day Intercity Delivery", fill=(230, 230, 255), font=get_font(36))
    
    # Bottom Onboarding Card
    draw.rounded_rectangle([60, H - 750, W - 60, H - 120], radius=40, fill=SURFACE)
    draw.text((110, H - 680), "Same-Day Delivery by Real Travelers", fill=TEXT_DARK, font=get_font(46, bold=True))
    draw.text((110, H - 600), "Send parcels intercity safely, affordably, and in hours.\nConnect with verified commuters on your route.", fill=TEXT_MUTED, font=get_font(34))
    
    # Indicators
    for i in range(3):
        color = PRIMARY if i == 0 else BORDER
        w = 60 if i == 0 else 24
        draw.rounded_rectangle([110 + i * 80, H - 380, 110 + i * 80 + w, H - 364], radius=8, fill=color)
        
    # Get Started Button
    draw.rounded_rectangle([110, H - 280, W - 110, H - 170], radius=28, fill=PRIMARY)
    draw.text((W // 2 - 120, H - 245), "Get Started", fill=(255, 255, 255), font=get_font(42, bold=True))
    
    img.save(os.path.join(output_dir, "01_splash_onboarding.png"))

# ─── 2. Login Screen ──────────────────────────────────────────────────────────
def make_login_screen():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    
    # Top banner
    draw.text((70, 250), "Welcome to Rideel", fill=TEXT_DARK, font=get_font(68, bold=True))
    draw.text((70, 340), "Enter your mobile number to get started with OTP", fill=TEXT_MUTED, font=get_font(38))
    
    # Phone Input Card
    draw.rounded_rectangle([70, 480, W - 70, 620], radius=24, fill=SURFACE, outline=BORDER, width=2)
    draw.text((110, 525), "+91", fill=PRIMARY, font=get_font(44, bold=True))
    draw.line([220, 510, 220, 590], fill=BORDER, width=2)
    draw.text((250, 525), "98765 43210", fill=TEXT_DARK, font=get_font(44, bold=True))
    
    # Send OTP Button
    draw.rounded_rectangle([70, 670, W - 70, 790], radius=28, fill=PRIMARY)
    draw.text((W // 2 - 110, 705), "Send OTP", fill=(255, 255, 255), font=get_font(44, bold=True))
    
    # OTP Input area
    draw.rounded_rectangle([70, 880, W - 70, 1380], radius=32, fill=SURFACE, outline=BORDER, width=2)
    draw.text((110, 930), "Verify Demo OTP", fill=TEXT_DARK, font=get_font(46, bold=True))
    draw.text((110, 1000), "Enter code sent to +91 98765 43210 (Demo: 1234)", fill=TEXT_MUTED, font=get_font(34))
    
    # 4 OTP boxes
    box_w = 170
    start_x = 110
    gap = (W - 220 - (box_w * 4)) // 3
    digits = ["1", "2", "3", "4"]
    for i in range(4):
        bx = start_x + i * (box_w + gap)
        draw.rounded_rectangle([bx, 1080, bx + box_w, 1220], radius=20, fill=LIGHT_PURPLE, outline=PRIMARY, width=3)
        draw.text((bx + 65, 1115), digits[i], fill=PRIMARY, font=get_font(60, bold=True))
        
    draw.rounded_rectangle([110, 1260, W - 110, 1360], radius=24, fill=PRIMARY)
    draw.text((W // 2 - 120, 1285), "Verify & Login", fill=(255, 255, 255), font=get_font(40, bold=True))
    
    # Role Selection preview
    draw.text((70, 1460), "Choose Role to Continue", fill=TEXT_DARK, font=get_font(46, bold=True))
    
    # Sender Card
    draw.rounded_rectangle([70, 1540, W // 2 - 20, 1880], radius=28, fill=LIGHT_PURPLE, outline=PRIMARY, width=4)
    draw.text((110, 1600), "📦 Sender", fill=PRIMARY, font=get_font(44, bold=True))
    draw.text((110, 1680), "Send packages\nsame-day with\ntrusted travelers.", fill=TEXT_DARK, font=get_font(32))
    draw.text((110, 1800), "✓ Selected", fill=PRIMARY, font=get_font(34, bold=True))
    
    # Traveler Card
    draw.rounded_rectangle([W // 2 + 20, 1540, W - 70, 1880], radius=28, fill=SURFACE, outline=BORDER, width=2)
    draw.text((W // 2 + 60, 1600), "🚗 Traveler", fill=TEXT_DARK, font=get_font(44, bold=True))
    draw.text((W // 2 + 60, 1680), "Earn by carrying\nparcels along\nyour daily route.", fill=TEXT_MUTED, font=get_font(32))
    
    img.save(os.path.join(output_dir, "02_login.png"))

# ─── 3. Sender Dashboard ──────────────────────────────────────────────────────
def make_sender_dashboard():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    
    # Header
    draw.text((70, 140), "Hello, Aashi 👋", fill=TEXT_DARK, font=get_font(56, bold=True))
    draw.text((70, 215), "Where do you want to send a parcel today?", fill=TEXT_MUTED, font=get_font(34))
    
    # Hero Send Card
    draw.rounded_rectangle([70, 290, W - 70, 680], radius=36, fill=PRIMARY)
    draw.text((120, 350), "Same-Day Intercity Delivery", fill=(255, 255, 255), font=get_font(48, bold=True))
    draw.text((120, 420), "Deliver across Mumbai, Pune, Bangalore & more\nwith verified peer travelers in under 8 hours.", fill=(230, 230, 255), font=get_font(32))
    
    # Send Parcel CTA
    draw.rounded_rectangle([120, 540, 480, 630], radius=24, fill=(255, 255, 255))
    draw.text((160, 565), "+ Send Parcel", fill=PRIMARY, font=get_font(38, bold=True))
    
    # Quick Stats Row
    stats = [("3", "Active"), ("12", "Delivered"), ("⭐ 4.8", "Rating")]
    sw = (W - 140 - 40) // 3
    for i, (val, lbl) in enumerate(stats):
        bx = 70 + i * (sw + 20)
        draw.rounded_rectangle([bx, 720, bx + sw, 880], radius=24, fill=SURFACE, outline=BORDER, width=2)
        draw.text((bx + 30, 750), val, fill=PRIMARY if i == 0 else TEXT_DARK, font=get_font(48, bold=True))
        draw.text((bx + 30, 815), lbl, fill=TEXT_MUTED, font=get_font(30))
        
    # Active Deliveries Section
    draw.text((70, 930), "Active Deliveries", fill=TEXT_DARK, font=get_font(46, bold=True))
    draw.text((W - 220, 935), "View All", fill=PRIMARY, font=get_font(36, bold=True))
    
    # Delivery Card 1
    draw.rounded_rectangle([70, 1010, W - 70, 1370], radius=32, fill=SURFACE, outline=BORDER, width=2)
    draw.rounded_rectangle([110, 1050, 260, 1100], radius=16, fill=(254, 243, 199))
    draw.text((130, 1060), "IN TRANSIT", fill=(180, 83, 9), font=get_font(28, bold=True))
    draw.text((W - 240, 1055), "₹ 125", fill=SUCCESS, font=get_font(42, bold=True))
    draw.text((110, 1130), "Mumbai  →  Pune", fill=TEXT_DARK, font=get_font(48, bold=True))
    draw.text((110, 1200), "Traveler: Rahul Sharma (Toyota Glanza) • ETA: 6:00 PM", fill=TEXT_MUTED, font=get_font(32))
    draw.text((110, 1250), "Parcel: Electronics (MacBook Air) • 2.5 kg", fill=TEXT_MUTED, font=get_font(32))
    
    draw.rounded_rectangle([110, 1300, 360, 1360], radius=16, fill=PRIMARY)
    draw.text((160, 1315), "Track Live", fill=(255, 255, 255), font=get_font(30, bold=True))
    
    # Delivery Card 2
    draw.rounded_rectangle([70, 1410, W - 70, 1770], radius=32, fill=SURFACE, outline=BORDER, width=2)
    draw.rounded_rectangle([110, 1450, 250, 1500], radius=16, fill=(209, 250, 229))
    draw.text((130, 1460), "DELIVERED", fill=(6, 95, 70), font=get_font(28, bold=True))
    draw.text((W - 240, 1455), "₹ 75", fill=TEXT_MUTED, font=get_font(42, bold=True))
    draw.text((110, 1530), "Delhi  →  Jaipur", fill=TEXT_DARK, font=get_font(48, bold=True))
    draw.text((110, 1600), "Traveler: Priya Patel • Delivered Dec 10", fill=TEXT_MUTED, font=get_font(32))
    draw.text((110, 1650), "Parcel: Legal Documents • 1.0 kg", fill=TEXT_MUTED, font=get_font(32))
    
    draw_bottom_nav(img, active_idx=0)
    img.save(os.path.join(output_dir, "03_sender_dashboard.png"))

# ─── 4. Parcel Booking ────────────────────────────────────────────────────────
def make_parcel_booking():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    draw_app_bar(draw, "Create New Parcel")
    
    # Steps bar
    draw.text((70, 270), "Step 1 of 2: Parcel Details", fill=PRIMARY, font=get_font(34, bold=True))
    draw.rounded_rectangle([70, 320, W - 70, 332], radius=6, fill=BORDER)
    draw.rounded_rectangle([70, 320, W // 2, 332], radius=6, fill=PRIMARY)
    
    # Form Container
    draw.rounded_rectangle([70, 380, W - 70, 1900], radius=36, fill=SURFACE, outline=BORDER, width=2)
    
    # Pickup City
    draw.text((110, 430), "Pickup City", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 480, W - 110, 590], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((150, 515), "📍 Mumbai, Maharashtra", fill=TEXT_DARK, font=get_font(38, bold=True))
    
    # Destination City
    draw.text((110, 630), "Destination City", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 680, W - 110, 790], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((150, 715), "🎯 Pune, Maharashtra", fill=TEXT_DARK, font=get_font(38, bold=True))
    
    # Category Selection
    draw.text((110, 830), "Parcel Category", fill=TEXT_MUTED, font=get_font(32, bold=True))
    cats = ["Documents", "Electronics", "Clothing", "Medicine"]
    cw = (W - 220 - 60) // 2
    for i, cat in enumerate(cats):
        row = i // 2
        col = i % 2
        bx = 110 + col * (cw + 20)
        by = 880 + row * 110
        sel = (cat == "Electronics")
        draw.rounded_rectangle([bx, by, bx + cw, by + 90], radius=18, fill=LIGHT_PURPLE if sel else BG_LIGHT, outline=PRIMARY if sel else BORDER, width=2)
        draw.text((bx + 30, by + 25), cat, fill=PRIMARY if sel else TEXT_DARK, font=get_font(34, bold=sel))
        
    # Weight Slider
    draw.text((110, 1140), "Weight (kg): 2.5 kg", fill=TEXT_DARK, font=get_font(36, bold=True))
    draw.rounded_rectangle([110, 1210, W - 110, 1226], radius=8, fill=BORDER)
    draw.rounded_rectangle([110, 1210, 450, 1226], radius=8, fill=PRIMARY)
    draw.ellipse([430, 1200, 470, 1240], fill=PRIMARY)
    
    # Description
    draw.text((110, 1270), "Package Description", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 1320, W - 110, 1460], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((150, 1360), "MacBook Air M2 with protective case & charger", fill=TEXT_DARK, font=get_font(34))
    
    # Addresses
    draw.text((110, 1500), "Pickup Address", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 1540, W - 110, 1650], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((150, 1575), "Andheri West, Mumbai (Near Metro Station)", fill=TEXT_DARK, font=get_font(32))
    
    draw.text((110, 1690), "Delivery Address", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 1730, W - 110, 1840], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((150, 1765), "Hinjewadi Phase 1, Pune (Tech Park)", fill=TEXT_DARK, font=get_font(32))
    
    # CTA Button
    draw.rounded_rectangle([70, 1960, W - 70, 2080], radius=32, fill=PRIMARY)
    draw.text((W // 2 - 160, 2000), "Find Travelers  →", fill=(255, 255, 255), font=get_font(44, bold=True))
    
    img.save(os.path.join(output_dir, "04_parcel_booking.png"))

# ─── 5. Available Travelers ───────────────────────────────────────────────────
def make_available_travelers():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    draw_app_bar(draw, "Available Travelers", right_text="Filter")
    
    # Route Summary Banner
    draw.rounded_rectangle([70, 260, W - 70, 390], radius=28, fill=PRIMARY)
    draw.text((120, 290), "Mumbai  →  Pune", fill=(255, 255, 255), font=get_font(46, bold=True))
    draw.text((120, 345), "Today, Dec 15 • 4 Verified Travelers Available", fill=(230, 230, 255), font=get_font(30))
    
    travelers = [
        ("Rahul Sharma", "RS", "4.8", "45 trips", "Car (Glanza)", "₹50 / kg", "10 kg left", "Departs 2:30 PM", True),
        ("Priya Patel", "PP", "4.9", "78 trips", "Train (Express)", "₹45 / kg", "15 kg left", "Departs 4:00 PM", True),
        ("Amit Kumar", "AK", "4.5", "23 trips", "Bike", "₹40 / kg", "5 kg left", "Departs 3:15 PM", False),
        ("Sneha Joshi", "SJ", "4.7", "56 trips", "Bus (Volvo AC)", "₹35 / kg", "20 kg left", "Departs 5:00 PM", True),
    ]
    
    for i, (name, init, rating, trips, veh, price, cap, dep, ver) in enumerate(travelers):
        y = 430 + i * 400
        draw.rounded_rectangle([70, y, W - 70, y + 360], radius=32, fill=SURFACE, outline=BORDER, width=2)
        
        # Avatar
        draw.ellipse([110, y + 40, 220, y + 150], fill=LIGHT_PURPLE)
        draw.text((140, y + 65), init, fill=PRIMARY, font=get_font(44, bold=True))
        
        # Name & Badge
        draw.text((250, y + 45), name, fill=TEXT_DARK, font=get_font(42, bold=True))
        if ver:
            draw.rounded_rectangle([250, y + 105, 410, y + 145], radius=12, fill=(209, 250, 229))
            draw.text((265, y + 112), "✓ VERIFIED", fill=(6, 95, 70), font=get_font(24, bold=True))
            
        # Price tag
        draw.text((W - 270, y + 45), price, fill=SUCCESS, font=get_font(44, bold=True))
        
        # Details row
        draw.text((110, y + 180), f"⭐ {rating} ({trips}) • {veh} • {cap}", fill=TEXT_MUTED, font=get_font(32))
        draw.text((110, y + 230), f"Departure: {dep}", fill=TEXT_DARK, font=get_font(32, bold=True))
        
        # Select Button
        draw.rounded_rectangle([W - 320, y + 250, W - 110, y + 330], radius=20, fill=PRIMARY)
        draw.text((W - 275, y + 270), "Book", fill=(255, 255, 255), font=get_font(34, bold=True))
        
    img.save(os.path.join(output_dir, "05_available_travelers.png"))

# ─── 6. Booking Confirmation ──────────────────────────────────────────────────
def make_booking_confirmation():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    draw_app_bar(draw, "Booking Confirmation")
    
    # Success Summary Card
    draw.rounded_rectangle([70, 270, W - 70, 820], radius=36, fill=SURFACE, outline=BORDER, width=2)
    draw.text((110, 320), "Delivery Summary", fill=TEXT_DARK, font=get_font(46, bold=True))
    
    draw.text((110, 400), "Route:", fill=TEXT_MUTED, font=get_font(32))
    draw.text((320, 400), "Mumbai → Pune", fill=TEXT_DARK, font=get_font(36, bold=True))
    
    draw.text((110, 470), "Traveler:", fill=TEXT_MUTED, font=get_font(32))
    draw.text((320, 470), "Rahul Sharma (Car)", fill=TEXT_DARK, font=get_font(36, bold=True))
    
    draw.text((110, 540), "Parcel:", fill=TEXT_MUTED, font=get_font(32))
    draw.text((320, 540), "Electronics • 2.5 kg", fill=TEXT_DARK, font=get_font(36, bold=True))
    
    draw.text((110, 610), "Est. Arrival:", fill=TEXT_MUTED, font=get_font(32))
    draw.text((320, 610), "Today, 6:00 PM", fill=SUCCESS, font=get_font(36, bold=True))
    
    draw.line([110, 680, W - 110, 680], fill=BORDER, width=2)
    draw.text((110, 720), "Order ID: #RD-84920", fill=PRIMARY, font=get_font(38, bold=True))
    
    # Price Breakdown Card
    draw.rounded_rectangle([70, 870, W - 70, 1340], radius=36, fill=SURFACE, outline=BORDER, width=2)
    draw.text((110, 920), "Price Breakdown", fill=TEXT_DARK, font=get_font(44, bold=True))
    
    draw.text((110, 1000), "Traveler Fare (2.5 kg × ₹50)", fill=TEXT_MUTED, font=get_font(34))
    draw.text((W - 240, 1000), "₹ 125.00", fill=TEXT_DARK, font=get_font(34, bold=True))
    
    draw.text((110, 1070), "Platform & Insurance Fee", fill=TEXT_MUTED, font=get_font(34))
    draw.text((W - 240, 1070), "₹ 15.00", fill=TEXT_DARK, font=get_font(34, bold=True))
    
    draw.line([110, 1140, W - 110, 1140], fill=BORDER, width=2)
    draw.text((110, 1190), "Total Payable", fill=TEXT_DARK, font=get_font(42, bold=True))
    draw.text((W - 270, 1190), "₹ 140.00", fill=PRIMARY, font=get_font(46, bold=True))
    
    # Payment Method Card
    draw.text((70, 1400), "Select Payment Method", fill=TEXT_DARK, font=get_font(42, bold=True))
    methods = [("Rideel Wallet (₹650 Available)", True), ("UPI / GPay / PhonePe", False), ("Cash on Delivery", False)]
    for i, (m, sel) in enumerate(methods):
        my = 1470 + i * 130
        draw.rounded_rectangle([70, my, W - 70, my + 105], radius=24, fill=LIGHT_PURPLE if sel else SURFACE, outline=PRIMARY if sel else BORDER, width=2)
        draw.text((120, my + 30), m, fill=PRIMARY if sel else TEXT_DARK, font=get_font(34, bold=sel))
        if sel:
            draw.text((W - 140, my + 30), "✓", fill=PRIMARY, font=get_font(38, bold=True))
            
    # Confirm CTA
    draw.rounded_rectangle([70, 1950, W - 70, 2080], radius=32, fill=PRIMARY)
    draw.text((W // 2 - 160, 1995), "Confirm Booking", fill=(255, 255, 255), font=get_font(44, bold=True))
    
    img.save(os.path.join(output_dir, "06_booking_confirmation.png"))

# ─── 7. Traveler Dashboard ────────────────────────────────────────────────────
def make_traveler_dashboard():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    
    # Header
    draw.text((70, 140), "Hello, Rahul 👋", fill=TEXT_DARK, font=get_font(56, bold=True))
    draw.text((70, 215), "Traveler Mode • Mumbai - Pune Corridor", fill=TEXT_MUTED, font=get_font(34))
    
    # Hero Create Trip Card
    draw.rounded_rectangle([70, 290, W - 70, 680], radius=36, fill=(45, 55, 72))
    draw.text((120, 350), "Create a New Trip", fill=(255, 255, 255), font=get_font(48, bold=True))
    draw.text((120, 420), "Traveling between cities? List your vehicle capacity\nand earn ₹500–₹2000 on your everyday trip.", fill=(200, 210, 225), font=get_font(32))
    
    draw.rounded_rectangle([120, 540, 450, 630], radius=24, fill=PRIMARY)
    draw.text((160, 565), "+ Post Trip", fill=(255, 255, 255), font=get_font(38, bold=True))
    
    # Earnings Stats
    stats = [("₹ 650", "Earned"), ("5", "Trips Done"), ("⭐ 4.9", "Rating")]
    sw = (W - 140 - 40) // 3
    for i, (val, lbl) in enumerate(stats):
        bx = 70 + i * (sw + 20)
        draw.rounded_rectangle([bx, 720, bx + sw, 880], radius=24, fill=SURFACE, outline=BORDER, width=2)
        draw.text((bx + 30, 750), val, fill=SUCCESS if i == 0 else TEXT_DARK, font=get_font(44, bold=True))
        draw.text((bx + 30, 815), lbl, fill=TEXT_MUTED, font=get_font(30))
        
    # Incoming Delivery Requests
    draw.text((70, 930), "Delivery Requests on Your Route", fill=TEXT_DARK, font=get_font(44, bold=True))
    
    reqs = [
        ("Aashi Gupta", "4.6", "Electronics (Laptop)", "2.5 kg", "Andheri → Hinjewadi", "₹ 125"),
        ("Ravi Verma", "4.2", "Legal Documents", "0.5 kg", "Bandra → Kothrud", "₹ 75"),
    ]
    for i, (snd, rt, desc, wt, route, earn) in enumerate(reqs):
        y = 1010 + i * 360
        draw.rounded_rectangle([70, y, W - 70, y + 320], radius=32, fill=SURFACE, outline=BORDER, width=2)
        draw.text((110, y + 40), snd, fill=TEXT_DARK, font=get_font(40, bold=True))
        draw.text((420, y + 45), f"⭐ {rt}", fill=TEXT_MUTED, font=get_font(30))
        draw.text((W - 250, y + 40), earn, fill=SUCCESS, font=get_font(42, bold=True))
        
        draw.text((110, y + 105), f"Route: {route}", fill=PRIMARY, font=get_font(34, bold=True))
        draw.text((110, y + 160), f"Item: {desc} • {wt}", fill=TEXT_MUTED, font=get_font(32))
        
        # Buttons
        draw.rounded_rectangle([110, y + 225, 340, y + 295], radius=18, fill=SUCCESS)
        draw.text((160, y + 242), "Accept", fill=(255, 255, 255), font=get_font(32, bold=True))
        
        draw.rounded_rectangle([370, y + 225, 580, y + 295], radius=18, fill=BG_LIGHT, outline=BORDER)
        draw.text((430, y + 242), "Decline", fill=TEXT_MUTED, font=get_font(32, bold=True))
        
    draw_bottom_nav(img, active_idx=0, is_traveler=True)
    img.save(os.path.join(output_dir, "07_traveler_dashboard.png"))

# ─── 8. Create Trip Screen ───────────────────────────────────────────────────
def make_create_trip():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    draw_app_bar(draw, "Create Trip")
    
    # Form Container
    draw.rounded_rectangle([70, 270, W - 70, 1900], radius=36, fill=SURFACE, outline=BORDER, width=2)
    
    # From City
    draw.text((110, 320), "Departure City", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 370, W - 110, 480], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((150, 405), "📍 Mumbai, Maharashtra", fill=TEXT_DARK, font=get_font(38, bold=True))
    
    # To City
    draw.text((110, 520), "Destination City", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 570, W - 110, 680], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((150, 605), "🎯 Pune, Maharashtra", fill=TEXT_DARK, font=get_font(38, bold=True))
    
    # Date & Time
    draw.text((110, 720), "Travel Date & Departure Time", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 770, W // 2 - 20, 880], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((140, 805), "📅 Today, Dec 15", fill=TEXT_DARK, font=get_font(34, bold=True))
    
    draw.rounded_rectangle([W // 2 + 20, 770, W - 110, 880], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((W // 2 + 50, 805), "⏰ 2:30 PM", fill=TEXT_DARK, font=get_font(34, bold=True))
    
    # Vehicle Type Chips
    draw.text((110, 920), "Vehicle Type", fill=TEXT_MUTED, font=get_font(32, bold=True))
    vehs = ["Car", "Train", "Bus", "Bike", "Flight"]
    for i, v in enumerate(vehs):
        vx = 110 + i * 175
        sel = (v == "Car")
        draw.rounded_rectangle([vx, 970, vx + 155, 1050], radius=18, fill=LIGHT_PURPLE if sel else BG_LIGHT, outline=PRIMARY if sel else BORDER, width=2)
        draw.text((vx + 45, 995), v, fill=PRIMARY if sel else TEXT_DARK, font=get_font(32, bold=sel))
        
    # Available Weight Slider
    draw.text((110, 1110), "Available Carrying Capacity: 15 kg", fill=TEXT_DARK, font=get_font(36, bold=True))
    draw.rounded_rectangle([110, 1170, W - 110, 1186], radius=8, fill=BORDER)
    draw.rounded_rectangle([110, 1170, 600, 1186], radius=8, fill=PRIMARY)
    draw.ellipse([580, 1160, 620, 1200], fill=PRIMARY)
    
    # Rate per kg
    draw.text((110, 1250), "Price per kg (₹)", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 1300, W - 110, 1410], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((150, 1335), "₹ 50 / kg", fill=TEXT_DARK, font=get_font(40, bold=True))
    
    # Route Notes
    draw.text((110, 1450), "Route Notes", fill=TEXT_MUTED, font=get_font(32, bold=True))
    draw.rounded_rectangle([110, 1500, W - 110, 1640], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((150, 1540), "Traveling via Mumbai-Pune Expressway. Can stop at\nNavi Mumbai, Lonavala & Wakad.", fill=TEXT_MUTED, font=get_font(32))
    
    # Potential Earnings
    draw.rounded_rectangle([110, 1700, W - 110, 1840], radius=24, fill=(240, 253, 244))
    draw.text((150, 1735), "Estimated Trip Earnings", fill=(21, 128, 61), font=get_font(32, bold=True))
    draw.text((150, 1780), "₹ 500 – ₹ 750 (with 15 kg max load)", fill=SUCCESS, font=get_font(38, bold=True))
    
    # CTA
    draw.rounded_rectangle([70, 1960, W - 70, 2080], radius=32, fill=PRIMARY)
    draw.text((W // 2 - 120, 2000), "Post Trip Now", fill=(255, 255, 255), font=get_font(44, bold=True))
    
    img.save(os.path.join(output_dir, "08_create_trip.png"))

# ─── 9. Delivery Requests ─────────────────────────────────────────────────────
def make_delivery_requests():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    draw_app_bar(draw, "Delivery Requests", right_text="Filter")
    
    # Filter chips
    chips = ["All (4)", "Electronics", "Documents", "Clothing"]
    for i, c in enumerate(chips):
        cx = 70 + i * 235
        sel = (i == 0)
        draw.rounded_rectangle([cx, 260, cx + 215, 330], radius=20, fill=LIGHT_PURPLE if sel else SURFACE, outline=PRIMARY if sel else BORDER, width=2)
        draw.text((cx + 35, 280), c, fill=PRIMARY if sel else TEXT_DARK, font=get_font(30, bold=sel))
        
    reqs = [
        ("Aashi Gupta", "4.6", "Electronics (Laptop)", "2.5 kg", "Andheri West → Hinjewadi", "₹ 125", "Ready now"),
        ("Ravi Verma", "4.2", "Legal Documents", "0.5 kg", "Bandra → Kothrud", "₹ 75", "Today 3 PM"),
        ("Meera Singh", "4.8", "Clothing Items", "3.0 kg", "Dadar → Viman Nagar", "₹ 90", "Flexible"),
        ("Suresh Kumar", "4.4", "Urgent Medicine", "1.0 kg", "Borivali → Wakad", "₹ 60", "Urgent"),
    ]
    for i, (snd, rt, desc, wt, route, earn, time) in enumerate(reqs):
        y = 370 + i * 400
        draw.rounded_rectangle([70, y, W - 70, y + 360], radius=32, fill=SURFACE, outline=BORDER, width=2)
        draw.text((110, y + 40), snd, fill=TEXT_DARK, font=get_font(42, bold=True))
        draw.text((420, y + 45), f"⭐ {rt}", fill=TEXT_MUTED, font=get_font(30))
        draw.text((W - 240, y + 40), earn, fill=SUCCESS, font=get_font(44, bold=True))
        
        draw.text((110, y + 105), f"Route: {route}", fill=PRIMARY, font=get_font(34, bold=True))
        draw.text((110, y + 160), f"Item: {desc} • {wt} • Timing: {time}", fill=TEXT_MUTED, font=get_font(32))
        
        # Action Buttons
        draw.rounded_rectangle([110, y + 240, 360, y + 320], radius=20, fill=SUCCESS)
        draw.text((180, y + 260), "Accept", fill=(255, 255, 255), font=get_font(32, bold=True))
        
        draw.rounded_rectangle([390, y + 240, 620, y + 320], radius=20, fill=BG_LIGHT, outline=BORDER)
        draw.text((460, y + 260), "Decline", fill=TEXT_MUTED, font=get_font(32, bold=True))
        
        draw.rounded_rectangle([W - 320, y + 240, W - 110, y + 320], radius=20, fill=LIGHT_PURPLE)
        draw.text((W - 275, y + 260), "Details", fill=PRIMARY, font=get_font(32, bold=True))
        
    img.save(os.path.join(output_dir, "09_delivery_requests.png"))

# ─── 10. Live Tracking ────────────────────────────────────────────────────────
def make_live_tracking():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    draw_app_bar(draw, "Live Tracking #RD-84920")
    
    # Map area placeholder (simulated map view)
    draw.rounded_rectangle([70, 260, W - 70, 1100], radius=36, fill=(235, 240, 245), outline=BORDER, width=2)
    
    # Map roads pattern
    for i in range(5):
        draw.line([70, 400 + i * 140, W - 70, 420 + i * 140], fill=(215, 225, 235), width=8)
    for j in range(4):
        draw.line([250 + j * 200, 260, 270 + j * 200, 1100], fill=(215, 225, 235), width=8)
        
    # Highway route line (Mumbai to Pune)
    draw.line([200, 950, 540, 680, 880, 420], fill=PRIMARY, width=14)
    
    # Start Point Marker (Mumbai)
    draw.ellipse([170, 920, 230, 980], fill=SUCCESS, outline=(255, 255, 255), width=4)
    draw.text((120, 995), "Mumbai (Origin)", fill=TEXT_DARK, font=get_font(28, bold=True))
    
    # Current Vehicle Marker (En Route)
    draw.ellipse([500, 640, 580, 720], fill=SECONDARY, outline=(255, 255, 255), width=6)
    draw.text((450, 580), "🚗 Rahul Sharma", fill=TEXT_DARK, font=get_font(32, bold=True))
    draw.text((470, 735), "Speed: 75 km/h", fill=SECONDARY, font=get_font(26, bold=True))
    
    # End Point Marker (Pune)
    draw.ellipse([850, 390, 910, 450], fill=PRIMARY, outline=(255, 255, 255), width=4)
    draw.text((790, 465), "Pune (Destination)", fill=TEXT_DARK, font=get_font(28, bold=True))
    
    # Status Card
    draw.rounded_rectangle([70, 1140, W - 70, 1420], radius=32, fill=SURFACE, outline=BORDER, width=2)
    draw.rounded_rectangle([110, 1180, 260, 1225], radius=14, fill=(254, 243, 199))
    draw.text((130, 1188), "IN TRANSIT", fill=(180, 83, 9), font=get_font(26, bold=True))
    draw.text((W - 320, 1180), "ETA: 6:00 PM", fill=PRIMARY, font=get_font(38, bold=True))
    
    draw.text((110, 1250), "Distance Remaining: 48 km (approx 45 mins)", fill=TEXT_DARK, font=get_font(34, bold=True))
    draw.text((110, 1310), "Current Location: Near Lonavala Toll Plaza", fill=TEXT_MUTED, font=get_font(32))
    
    # Tracking Milestones Timeline
    draw.rounded_rectangle([70, 1460, W - 70, 1940], radius=32, fill=SURFACE, outline=BORDER, width=2)
    draw.text((110, 1500), "Delivery Milestones", fill=TEXT_DARK, font=get_font(42, bold=True))
    
    milestones = [
        ("Booking Confirmed", "Today 10:15 AM", True),
        ("Parcel Picked Up (Andheri West)", "Today 1:30 PM", True),
        ("In Transit on Expressway", "Today 3:45 PM", True),
        ("Delivered to Hinjewadi, Pune", "Expected 6:00 PM", False),
    ]
    for i, (m, tm, done) in enumerate(milestones):
        my = 1580 + i * 85
        color = SUCCESS if done else BORDER
        draw.ellipse([120, my + 5, 144, my + 29], fill=color)
        if i < 3:
            draw.line([132, my + 29, 132, my + 85], fill=SUCCESS if done else BORDER, width=4)
        draw.text((170, my), m, fill=TEXT_DARK if done else TEXT_MUTED, font=get_font(32, bold=done))
        draw.text((W - 320, my), tm, fill=TEXT_MUTED, font=get_font(26))
        
    # Traveler Contact Bar
    draw.rounded_rectangle([70, 1980, W - 70, 2100], radius=28, fill=PRIMARY)
    draw.text((120, 2015), "📞 Call Traveler (Rahul Sharma)", fill=(255, 255, 255), font=get_font(38, bold=True))
    
    img.save(os.path.join(output_dir, "10_live_tracking.png"))

# ─── 11. Profile & Wallet ─────────────────────────────────────────────────────
def make_profile():
    img = Image.new("RGB", (W, H), BG_LIGHT)
    draw = ImageDraw.Draw(img)
    draw_status_bar(draw)
    
    # Profile Header
    draw.rounded_rectangle([70, 130, W - 70, 480], radius=36, fill=PRIMARY)
    draw.ellipse([120, 180, 280, 340], fill=(255, 255, 255))
    draw.text((170, 220), "AG", fill=PRIMARY, font=get_font(64, bold=True))
    
    draw.text((320, 190), "Aashi Gupta", fill=(255, 255, 255), font=get_font(52, bold=True))
    draw.text((320, 260), "+91 98765 43210 • Mumbai", fill=(230, 230, 255), font=get_font(34))
    draw.text((320, 310), "Verified Sender & Traveler ⭐ 4.8", fill=(255, 230, 150), font=get_font(32, bold=True))
    
    # Wallet Balance Card
    draw.rounded_rectangle([70, 520, W - 70, 840], radius=36, fill=SURFACE, outline=BORDER, width=2)
    draw.text((120, 560), "Rideel Wallet Balance", fill=TEXT_MUTED, font=get_font(32))
    draw.text((120, 610), "₹ 650.00", fill=TEXT_DARK, font=get_font(68, bold=True))
    
    draw.rounded_rectangle([120, 720, 360, 800], radius=20, fill=PRIMARY)
    draw.text((170, 740), "+ Add Cash", fill=(255, 255, 255), font=get_font(32, bold=True))
    
    draw.rounded_rectangle([390, 720, 630, 800], radius=20, fill=BG_LIGHT, outline=BORDER)
    draw.text((450, 740), "Withdraw", fill=TEXT_DARK, font=get_font(32, bold=True))
    
    # Menu Items
    menu = [
        ("Edit Profile Details", ">"),
        ("Transaction History", ">"),
        ("Saved Addresses (Home, Office)", ">"),
        ("Push & SMS Notifications", ">"),
        ("App Settings & Dark Mode", ">"),
        ("Help, Support & FAQs", ">"),
        ("Terms & Privacy Policy", ">"),
        ("Logout Account", "")
    ]
    for i, (m, arr) in enumerate(menu):
        my = 880 + i * 115
        is_logout = (m == "Logout Account")
        draw.rounded_rectangle([70, my, W - 70, my + 95], radius=22, fill=SURFACE, outline=BORDER, width=2)
        draw.text((120, my + 25), m, fill=(239, 68, 68) if is_logout else TEXT_DARK, font=get_font(34, bold=is_logout))
        if arr:
            draw.text((W - 140, my + 25), arr, fill=TEXT_MUTED, font=get_font(36, bold=True))
            
    draw_bottom_nav(img, active_idx=4)
    img.save(os.path.join(output_dir, "11_profile.png"))

print("Generating screenshots...")
make_splash_screen()
make_login_screen()
make_sender_dashboard()
make_parcel_booking()
make_available_travelers()
make_booking_confirmation()
make_traveler_dashboard()
make_create_trip()
make_delivery_requests()
make_live_tracking()
make_profile()
print("All 11 screenshots successfully generated in:", output_dir)
