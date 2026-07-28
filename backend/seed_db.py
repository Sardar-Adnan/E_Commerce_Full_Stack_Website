import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from products.models import Category, Product, ProductVariant, ProductImage

User = get_user_model()

def seed_database():
    print("[+] Starting Leaf & Bloom database seeding...")

    # 1. Create Admin / Staff User
    admin_user, created = User.objects.get_or_create(
        email='admin@leafandbloom.pk',
        defaults={
            'username': 'admin',
            'phone_number': '03001234567',
            'is_staff': True,
            'is_superuser': True,
            'is_active': True,
        }
    )
    admin_user.set_password('admin123password')
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.save()
    print("  [OK] Admin user ready: admin@leafandbloom.pk / admin123password")

    # 2. Create Demo Customer User
    customer_user, _ = User.objects.get_or_create(
        email='customer@leafandbloom.pk',
        defaults={
            'username': 'customer',
            'phone_number': '03007654321',
            'is_staff': False,
            'is_active': True,
        }
    )
    customer_user.set_password('customer123password')
    customer_user.save()
    print("  [OK] Customer user ready: customer@leafandbloom.pk / customer123password")

    # 3. Create Categories
    categories_data = [
        {'name': 'Indoor Plants', 'slug': 'indoor-plants', 'description': 'Lush greenery for your living room, office, or bedroom.'},
        {'name': 'Pet-Safe Plants', 'slug': 'pet-safe-plants', 'description': 'Non-toxic, pet-friendly plants safe for cats and dogs.'},
        {'name': 'Low Light Plants', 'slug': 'low-light-plants', 'description': 'Hardy plants that thrive in indirect or low sunlight.'},
        {'name': 'Planters & Pots', 'slug': 'planters-pots', 'description': 'Stylish ceramic, terracotta, and drainage-friendly pots.'},
        {'name': 'Plant Care & Supplies', 'slug': 'plant-care-supplies', 'description': 'Organic fertilizers, soils, pruners, and care essentials.'},
    ]

    category_objs = {}
    for cat_data in categories_data:
        cat, _ = Category.objects.get_or_create(
            slug=cat_data['slug'],
            defaults={'name': cat_data['name'], 'description': cat_data['description']}
        )
        category_objs[cat_data['slug']] = cat

    print(f"  [OK] {len(category_objs)} Categories ready.")

    # 4. Products Data with verified Unsplash image URLs
    products = [
        {
            'name': 'Monstera Deliciosa',
            'slug': 'monstera-deliciosa',
            'category': category_objs['indoor-plants'],
            'sku': 'LNB-MON-001',
            'base_price': '2450.00',
            'discount_price': '1950.00',
            'description': 'Monstera Deliciosa is a tropical indoor favorite known for its large, glossy split leaves. Easy to care for and fast growing.',
            'care_instructions': 'Light: Medium to bright indirect light.\nWater: Water when top 2 inches of soil feel dry.\nHumidity: Prefers moderate to high humidity.',
            'light_requirement': Product.LightRequirement.BRIGHT,
            'is_pet_safe': False,
            'is_featured': True,
            'is_active': True,
            'stock_quantity': 15,
            'image_url': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
            'variants': [
                {'name': 'Small (4" Pot)', 'price_override': '1450.00', 'stock_quantity': 10, 'sku_suffix': 'S'},
                {'name': 'Medium (6" Pot)', 'price_override': '1950.00', 'stock_quantity': 15, 'sku_suffix': 'M'},
                {'name': 'Large (8" Pot)', 'price_override': '2650.00', 'stock_quantity': 8, 'sku_suffix': 'L'},
            ]
        },
        {
            'name': 'Snake Plant (Sansevieria Laurentii)',
            'slug': 'snake-plant-sansevieria',
            'category': category_objs['low-light-plants'],
            'sku': 'LNB-SNK-002',
            'base_price': '1800.00',
            'discount_price': '1450.00',
            'description': 'Snake plant features upright, sword-like leaves with yellow borders. Excellent air purifier and extremely low maintenance.',
            'care_instructions': 'Light: Low to bright indirect light.\nWater: Allow soil to dry completely between waterings.\nHumidity: Tolerates dry indoor air.',
            'light_requirement': Product.LightRequirement.LOW,
            'is_pet_safe': False,
            'is_featured': True,
            'is_active': True,
            'stock_quantity': 25,
            'image_url': 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
            'variants': [
                {'name': 'Standard (6" Pot)', 'price_override': '1450.00', 'stock_quantity': 20, 'sku_suffix': 'STD'},
                {'name': 'Tall (8" Pot)', 'price_override': '2100.00', 'stock_quantity': 10, 'sku_suffix': 'TL'},
            ]
        },
        {
            'name': 'Areca Palm',
            'slug': 'areca-palm',
            'category': category_objs['pet-safe-plants'],
            'sku': 'LNB-PLM-003',
            'base_price': '3200.00',
            'discount_price': '2750.00',
            'description': 'Areca Palm brings tropical vibes into any room with its graceful, arching fronds. 100% pet-friendly and non-toxic.',
            'care_instructions': 'Light: Bright, indirect sunlight.\nWater: Keep soil slightly moist but never waterlogged.\nHumidity: Enjoys misting.',
            'light_requirement': Product.LightRequirement.BRIGHT,
            'is_pet_safe': True,
            'is_featured': True,
            'is_active': True,
            'stock_quantity': 12,
            'image_url': 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
            'variants': [
                {'name': 'Medium (3 Feet)', 'price_override': '2750.00', 'stock_quantity': 8, 'sku_suffix': '3FT'},
                {'name': 'Large (5 Feet)', 'price_override': '3900.00', 'stock_quantity': 4, 'sku_suffix': '5FT'},
            ]
        },
        {
            'name': 'Boston Fern',
            'slug': 'boston-fern',
            'category': category_objs['pet-safe-plants'],
            'sku': 'LNB-FRN-004',
            'base_price': '1500.00',
            'discount_price': '1250.00',
            'description': 'Boston Fern features lush green fronds that cascade beautifully in hanging baskets. Safe for curiosity-driven cats and dogs.',
            'care_instructions': 'Light: Filtered indirect light.\nWater: Keep soil consistently moist.\nHumidity: Needs high humidity, mist daily.',
            'light_requirement': Product.LightRequirement.MEDIUM,
            'is_pet_safe': True,
            'is_featured': True,
            'is_active': True,
            'stock_quantity': 18,
            'image_url': 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
            'variants': []
        },
        {
            'name': 'Peace Lily (Spathiphyllum)',
            'slug': 'peace-lily',
            'category': category_objs['low-light-plants'],
            'sku': 'LNB-PCL-005',
            'base_price': '1650.00',
            'discount_price': '1350.00',
            'description': 'Peace Lily communicates when it needs water by wilting slightly and bounces right back after watering. Known for producing elegant white spathes.',
            'care_instructions': 'Light: Medium to low light.\nWater: Water when leaves begin to droop slightly.\nHumidity: Prefers moist environment.',
            'light_requirement': Product.LightRequirement.LOW,
            'is_pet_safe': False,
            'is_featured': True,
            'is_active': True,
            'stock_quantity': 20,
            'image_url': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
            'variants': []
        },
        {
            'name': 'ZZ Plant (Zamioculcas Zamiifolia)',
            'slug': 'zz-plant',
            'category': category_objs['low-light-plants'],
            'sku': 'LNB-ZZP-006',
            'base_price': '2200.00',
            'discount_price': '1850.00',
            'description': 'The ZZ plant can thrive in almost any lighting condition including low light office spaces. Drought tolerant and forgiving.',
            'care_instructions': 'Light: Low to bright indirect light.\nWater: Water every 2-3 weeks, let dry completely.\nHumidity: Normal indoor humidity.',
            'light_requirement': Product.LightRequirement.LOW,
            'is_pet_safe': False,
            'is_featured': True,
            'is_active': True,
            'stock_quantity': 30,
            'image_url': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80',
            'variants': []
        },
        {
            'name': 'Minimalist Ceramic Cylinder Planter',
            'slug': 'minimalist-ceramic-planter',
            'category': category_objs['planters-pots'],
            'sku': 'LNB-POT-007',
            'base_price': '1400.00',
            'discount_price': '1150.00',
            'description': 'Sleek white ceramic pot with matching saucer tray. Perfect for modern living rooms and indoor plant displays.',
            'care_instructions': 'Wipe clean with a damp cloth.',
            'light_requirement': Product.LightRequirement.DIRECT,
            'is_pet_safe': True,
            'is_featured': False,
            'is_active': True,
            'stock_quantity': 45,
            'image_url': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80',
            'variants': [
                {'name': 'White Ceramic (6")', 'price_override': '1150.00', 'stock_quantity': 25, 'sku_suffix': 'WHT'},
                {'name': 'Terracotta Matte (6")', 'price_override': '1150.00', 'stock_quantity': 20, 'sku_suffix': 'TER'},
            ]
        },
        {
            'name': 'Organic Potting Soil Mix (5kg)',
            'slug': 'organic-potting-soil-mix',
            'category': category_objs['plant-care-supplies'],
            'sku': 'LNB-SOL-008',
            'base_price': '650.00',
            'discount_price': '550.00',
            'description': 'Enriched with coco peat, perlite, and organic compost for optimal root aeration and water retention.',
            'care_instructions': 'Store in a dry place.',
            'light_requirement': Product.LightRequirement.LOW,
            'is_pet_safe': True,
            'is_featured': False,
            'is_active': True,
            'stock_quantity': 80,
            'image_url': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
            'variants': []
        }
    ]

    for p_data in products:
        variants_data = p_data.pop('variants', [])
        image_url = p_data.pop('image_url', '')

        product, created = Product.objects.get_or_create(
            slug=p_data['slug'],
            defaults=p_data
        )

        # Force update primary image with clean working Unsplash URL
        ProductImage.objects.filter(product=product).delete()
        if image_url:
            ProductImage.objects.create(
                product=product,
                image=image_url,
                alt_text=product.name,
                is_primary=True
            )

        print(f"  [+] Product image updated: {product.name}")

    print("\n[SUCCESS] Seeding completed successfully with working product images!")

if __name__ == '__main__':
    seed_database()
