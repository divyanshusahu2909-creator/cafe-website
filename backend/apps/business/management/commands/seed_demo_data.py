from decimal import Decimal
from django.core.management.base import BaseCommand
from apps.menu.models import Category, Product
from apps.reservations.models import CafeTable
from apps.orders.models import Coupon
from apps.gallery.models import GalleryImage
from apps.reviews.models import Review
from apps.business.models import BusinessSettings

class Command(BaseCommand):
    help = "Seeds initial demo data for Aesthetic Aroma cafe (categories, products, tables, coupons, gallery, reviews, settings)"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding Aesthetic Aroma demo catalog..."))

        # 1. Business Settings
        settings = BusinessSettings.get_settings()
        settings.name = "Aesthetic Aroma"
        settings.tagline = "Where Every Sip Feels Special."
        settings.city = "Indore"
        settings.state = "Madhya Pradesh"
        settings.country = "India"
        settings.address_placeholder = "Scheme 54, Near Meghdoot Garden, Vijay Nagar, Indore, MP 452010"
        settings.phone = "+91 98765 43210"
        settings.whatsapp_number = "+919876543210"
        settings.email = "hello@aestheticaroma.in"
        settings.delivery_available = True
        settings.delivery_fee = Decimal('40.00')
        settings.free_delivery_threshold = Decimal('500.00')
        settings.save()
        self.stdout.write(self.style.SUCCESS("✓ Business settings verified."))

        # 2. Categories
        categories_data = [
            ("Hot Coffee", "hot-coffee", "Artisan espresso and handcrafted steam infusions", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80", 1),
            ("Cold Coffee", "cold-coffee", "Refreshing iced brews and velvety cold coffee concoctions", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80", 2),
            ("Tea & Matcha", "tea-matcha", "Ceremonial grade Uji matcha and traditional spiced teas", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80", 3),
            ("Mocktails & Shakes", "mocktails-shakes", "Signature botanical coolers and decadent artisan shakes", "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80", 4),
            ("Pizza & Pasta", "pizza-pasta", "Stone-baked vegetarian sourdough pizzas and rich Italian pastas", "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", 5),
            ("Snacks & Sandwiches", "snacks-sandwiches", "Artisan toasted paninis and hand-cut truffle crisps", "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80", 6),
            ("Waffles & Pancakes", "waffles-pancakes", "Golden Belgian waffles and fluffy buttermilk stacks", "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80", 7),
            ("Desserts", "desserts", "European inspired patisserie and warm chocolate indulgence", "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80", 8),
        ]

        cat_objs = {}
        for name, slug, desc, img, order in categories_data:
            cat, created = Category.objects.get_or_create(
                slug=slug,
                defaults={
                    'name': name,
                    'description': desc,
                    'image': img,
                    'display_order': order,
                    'is_active': True,
                }
            )
            cat_objs[slug] = cat
        self.stdout.write(self.style.SUCCESS(f"✓ {len(cat_objs)} Categories verified."))

        # 3. Products (28 Vegetarian Products across 8 categories)
        products_data = [
            # Hot Coffee
            ("Espresso Solo", "espresso-solo", "hot-coffee", "Intense single-origin espresso shot with rich, golden crema.", Decimal("99.00"), None, "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=600&q=80", False, True, 5),
            ("Classic Cappuccino", "classic-cappuccino", "hot-coffee", "Balanced espresso topped with equal parts steamed milk and dense milk foam.", Decimal("149.00"), None, "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80", False, True, 10),
            ("Aesthetic Signature Latte", "aesthetic-signature-latte", "hot-coffee", "Our house masterpiece: double-shot espresso, Madagascar vanilla bean, micro-textured warm milk, and edible gold dust.", Decimal("199.00"), Decimal("179.00"), "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80", True, True, 10),
            ("Spanish-Style Latte", "spanish-style-latte", "hot-coffee", "Espresso poured over rich sweetened condensed milk and silky steamed milk.", Decimal("189.00"), None, "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80", False, True, 10),
            ("Mocha Velvet", "mocha-velvet", "hot-coffee", "Single-origin espresso blended with 70% dark Belgian chocolate ganache.", Decimal("219.00"), None, "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80", True, True, 12),
            ("Flat White", "flat-white", "hot-coffee", "Bold ristretto espresso shots topped with smooth velvety microfoam.", Decimal("169.00"), None, "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80", False, True, 10),

            # Cold Coffee
            ("Classic Cold Coffee", "classic-cold-coffee", "cold-coffee", "Creamy, chilled espresso whipped with milk and organic cane sugar.", Decimal("159.00"), None, "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80", False, True, 8),
            ("Iced Caramel Latte", "iced-caramel-latte", "cold-coffee", "Chilled milk, espresso float, and ribbons of handcrafted golden salted caramel.", Decimal("199.00"), Decimal("189.00"), "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80", True, True, 8),
            ("Hazelnut Frappe", "hazelnut-frappe", "cold-coffee", "Blended iced coffee with roasted hazelnut butter, whipped cream, and cocoa dusting.", Decimal("229.00"), None, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", False, True, 10),
            ("Cold Brew on the Rocks", "cold-brew-on-the-rocks", "cold-coffee", "18-hour steep Ethiopian cold brew served over a hand-carved ice sphere with citrus twist.", Decimal("179.00"), None, "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80", False, True, 5),

            # Tea & Matcha
            ("Indori Masala Chai", "indori-masala-chai", "tea-matcha", "Slow-simmered Assam CTC tea with green cardamom, fresh ginger, cloves, and whole milk.", Decimal("89.00"), None, "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80", False, True, 8),
            ("Ceremonial Matcha Latte", "ceremonial-matcha-latte", "tea-matcha", "Authentic stone-ground Japanese matcha whisked with oat or whole milk and vanilla.", Decimal("229.00"), None, "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80", True, True, 10),
            ("Kashmiri Saffron Kahwa", "kashmiri-saffron-kahwa", "tea-matcha", "Fragrant green tea brewed with saffron strands, crushed almonds, cinnamon, and cardamom.", Decimal("139.00"), None, "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80", False, True, 8),
            ("Iced Hibiscus Peach Tea", "iced-hibiscus-peach-tea", "tea-matcha", "Crimson hibiscus infusion with ripe white peach nectar and fresh mint leaves.", Decimal("149.00"), None, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80", False, True, 6),

            # Mocktails & Shakes
            ("Virgin Garden Mojito", "virgin-garden-mojito", "mocktails-shakes", "Muddled fresh garden mint, lime rounds, cane syrup, and sparkling soda.", Decimal("149.00"), None, "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", False, True, 8),
            ("Belgian Dark Chocolate Shake", "belgian-dark-chocolate-shake", "mocktails-shakes", "Decadent dark chocolate gelato churned with whole milk and shaved chocolate shards.", Decimal("179.00"), None, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80", True, True, 10),
            ("Lotus Biscoff Thickshake", "lotus-biscoff-thickshake", "mocktails-shakes", "Caramelized Biscoff spread blended with vanilla ice cream and biscuit crumble.", Decimal("219.00"), None, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", False, True, 10),

            # Pizza & Pasta
            ("Margherita Rustica Pizza", "margherita-rustica-pizza", "pizza-pasta", "San Marzano tomato reduction, fresh mozzarella bocconcini, aromatic basil, and olive drizzle on sourdough crust.", Decimal("249.00"), None, "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80", True, True, 20),
            ("Truffle Mushroom Pizza", "truffle-mushroom-pizza", "pizza-pasta", "Sautéed button and shiitake mushrooms, white truffle oil, fontina cheese, and fresh thyme.", Decimal("299.00"), None, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80", False, True, 20),
            ("Creamy Parmesan White Sauce Pasta", "creamy-parmesan-white-sauce-pasta", "pizza-pasta", "Penne tossed in silky garlic-herb béchamel, sweet bell peppers, and sun-dried tomatoes.", Decimal("229.00"), None, "https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=600&q=80", False, True, 18),
            ("Spicy Arrabbiata Red Pasta", "spicy-arrabbiata-red-pasta", "pizza-pasta", "Slow-cooked fiery tomato sauce with bird's eye chili, black olives, and fresh basil.", Decimal("219.00"), None, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80", False, True, 18),

            # Snacks & Sandwiches
            ("Grilled Pesto Veg Sandwich", "grilled-pesto-veg-sandwich", "snacks-sandwiches", "Artisan sourdough stuffed with basil pesto, zucchini, bell peppers, and melted cheddar.", Decimal("149.00"), None, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80", False, True, 12),
            ("Smoky Peri-Peri Fries", "smoky-peri-peri-fries", "snacks-sandwiches", "Crispy hand-cut russet fries tossed in our signature African peri-peri herb blend.", Decimal("129.00"), None, "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80", False, True, 10),
            ("Garlic Confit Sourdough with Cheese", "garlic-confit-sourdough-cheese", "snacks-sandwiches", "Slow-roasted sweet garlic butter spread over toasted sourdough, melted mozzarella.", Decimal("169.00"), None, "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80", False, True, 12),

            # Waffles & Pancakes
            ("Belgian Dark Chocolate Waffle", "belgian-dark-chocolate-waffle", "waffles-pancakes", "Crispy exterior, fluffy interior waffle smothered with melted dark chocolate and chocolate chips.", Decimal("199.00"), None, "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80", True, True, 15),
            ("Classic Buttermilk Pancakes", "classic-buttermilk-pancakes", "waffles-pancakes", "Triple-stack fluffy golden pancakes served with salted French butter and pure maple syrup.", Decimal("219.00"), None, "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80", False, True, 15),

            # Desserts
            ("Warm Sizzling Chocolate Brownie", "warm-sizzling-brownie", "desserts", "Fudgy walnut brownie served on a cast-iron skillet with rich chocolate sauce.", Decimal("129.00"), None, "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", False, True, 10),
            ("New York Baked Cheesecake Slice", "new-york-cheesecake-slice", "desserts", "Dense, creamy baked cheesecake on graham cracker crust with raspberry coulis.", Decimal("249.00"), None, "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80", True, True, 5),
        ]

        created_count = 0
        for name, slug, cat_slug, desc, price, disc_price, img, featured, available, prep_time in products_data:
            cat = cat_objs.get(cat_slug)
            prod, created = Product.objects.get_or_create(
                slug=slug,
                defaults={
                    'category': cat,
                    'name': name,
                    'description': desc,
                    'price': price,
                    'discounted_price': disc_price,
                    'image': img,
                    'is_vegetarian': True,
                    'is_featured': featured,
                    'is_available': available,
                    'preparation_time_minutes': prep_time,
                }
            )
            if created:
                created_count += 1
        self.stdout.write(self.style.SUCCESS(f"✓ {len(products_data)} Vegetarian products verified ({created_count} newly created)."))

        # 4. Cafe Tables
        tables_data = [
            ("Table 1 - Window View", 2, "indoor"),
            ("Table 2 - Cozy Corner", 2, "indoor"),
            ("Table 3 - Velvet Dining", 4, "indoor"),
            ("Table 4 - Family Banquet", 6, "indoor"),
            ("Table 5 - Courtyard Patio", 4, "patio"),
            ("Table 6 - Garden Oasis", 6, "patio"),
            ("Table 7 - Velvet Lounge", 4, "lounge"),
        ]
        for t_name, cap, loc in tables_data:
            CafeTable.objects.get_or_create(
                table_number=t_name,
                defaults={'capacity': cap, 'location': loc, 'is_active': True}
            )
        self.stdout.write(self.style.SUCCESS("✓ Cafe tables verified."))

        # 5. Coupons
        coupons_data = [
            ("WELCOME50", "percentage", Decimal("50.00"), Decimal("199.00"), Decimal("100.00")),
            ("AROMA20", "percentage", Decimal("20.00"), Decimal("299.00"), Decimal("200.00")),
        ]
        for code, dtype, val, min_amt, max_disc in coupons_data:
            Coupon.objects.get_or_create(
                code=code,
                defaults={
                    'discount_type': dtype,
                    'discount_value': val,
                    'minimum_order_amount': min_amt,
                    'max_discount': max_disc,
                    'is_active': True,
                }
            )
        self.stdout.write(self.style.SUCCESS("✓ Promotional coupons verified."))

        # 6. Gallery Images
        gallery_data = [
            ("https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80", "Artisan Coffee Bar Counter", "Aesthetic espresso machine and pour-over station", 1),
            ("https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80", "Velvet Interior Lounge", "Warm amber illumination and modern architectural seating", 2),
            ("https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80", "Pour-Over Precision Craft", "Single-origin filter coffee brewing ritual", 3),
            ("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", "Sunlit Outdoor Patio", "Quiet foliage retreat for afternoon work or conversations", 4),
            ("https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80", "Latte Art Presentation", "Silky Spanish latte with intricate rosette pour", 5),
            ("https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80", "Evening Atmosphere", "Atmospheric cafe serenity in Indore", 6),
        ]
        for img, cap, alt, order in gallery_data:
            GalleryImage.objects.get_or_create(
                image=img,
                defaults={'caption': cap, 'alt_text': alt, 'display_order': order, 'is_active': True}
            )
        self.stdout.write(self.style.SUCCESS("✓ Gallery records verified."))

        # 7. Demo Reviews (clearly labeled with is_demo=True)
        reviews_data = [
            ("Aanya Sharma", 5, "The Aesthetic Signature Latte with gold dust is a visual and sensory treat. The calm lighting and soundtrack make it the best place in Indore to read or meet friends."),
            ("Rohan Mehta", 5, "Finally, an elevated 100% vegetarian cafe that treats coffee like an art. The Sourdough Margherita and Cold Brew on the rocks were exceptional."),
            ("Priya Kulkarni", 5, "Super smooth table reservation on their website. We had a corner table reserved in the patio for our anniversary. Hospitality was first-class."),
            ("Aditya Verma", 4, "High quality brew and tasteful aesthetic. Peri-peri fries are crunchy and generous. Love the dark, minimalist ambience."),
        ]
        for name, rating, text in reviews_data:
            Review.objects.get_or_create(
                name=name,
                defaults={'rating': rating, 'review_text': text, 'is_approved': True, 'is_demo': True}
            )
        self.stdout.write(self.style.SUCCESS("✓ Demo reviews verified."))

        self.stdout.write(self.style.SUCCESS("\n🎉 Aesthetic Aroma demo data seeding completed successfully!"))
