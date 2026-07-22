"""
Seeds the database with realistic demo data for Leaf & Bloom:
categories and products, so the Admin Panel and (later) the customer
website have real content to work with during development.

Usage:
    python manage.py seed_data
"""
from decimal import Decimal
from django.core.management.base import BaseCommand
from products.models import Category, Product, ProductVariant


CATEGORIES = [
    {
        "name": "Indoor Plants",
        "description": "Low-maintenance and statement indoor plants for every room.",
    },
    {
        "name": "Planters & Pots",
        "description": "Ceramic, terracotta, and self-watering planters in all sizes.",
    },
    {
        "name": "Soil & Fertilizers",
        "description": "Potting mixes, nutrients, and soil amendments for healthy growth.",
    },
    {
        "name": "Plant Care Tools",
        "description": "Watering cans, pruning shears, misters, and moisture meters.",
    },
    {
        "name": "Seeds & Bulbs",
        "description": "Grow your own herbs, flowers, and vegetables from seed.",
    },
]

PRODUCTS = [
    {
        "category": "Indoor Plants",
        "name": "Monstera Deliciosa",
        "description": "The iconic split-leaf philodendron. A statement plant that thrives in bright, indirect light.",
        "care_instructions": "Water when top 2 inches of soil are dry. Loves humidity. Wipe leaves monthly.",
        "light_requirement": "bright",
        "is_pet_safe": False,
        "base_price": Decimal("2499.00"),
        "discount_price": None,
        "sku": "PLT-MON-001",
        "stock_quantity": 18,
        "is_featured": True,
        "variants": [("Small (4in pot)", None, 10), ("Large (10in pot)", Decimal("4499.00"), 8)],
    },
    {
        "category": "Indoor Plants",
        "name": "Snake Plant (Sansevieria)",
        "description": "Nearly indestructible, air-purifying, and perfect for low-light corners.",
        "care_instructions": "Water every 2-3 weeks. Tolerates low light. Avoid overwatering.",
        "light_requirement": "low",
        "is_pet_safe": False,
        "base_price": Decimal("1299.00"),
        "discount_price": Decimal("999.00"),
        "sku": "PLT-SNK-002",
        "stock_quantity": 30,
        "is_featured": True,
        "variants": [("Small (4in pot)", None, 20), ("Medium (6in pot)", Decimal("1799.00"), 10)],
    },
    {
        "category": "Indoor Plants",
        "name": "Pilea Peperomioides",
        "description": "The trendy 'Chinese Money Plant' with round, coin-shaped leaves. Pet safe.",
        "care_instructions": "Bright indirect light, water when soil is dry, rotate weekly for even growth.",
        "light_requirement": "bright",
        "is_pet_safe": True,
        "base_price": Decimal("1599.00"),
        "discount_price": None,
        "sku": "PLT-PIL-003",
        "stock_quantity": 12,
        "is_featured": False,
        "variants": [],
    },
    {
        "category": "Indoor Plants",
        "name": "Boston Fern",
        "description": "Lush, feathery fronds that add a lively pop of green. Great for hanging baskets.",
        "care_instructions": "Keep soil consistently moist. Loves humidity — mist regularly.",
        "light_requirement": "medium",
        "is_pet_safe": True,
        "base_price": Decimal("999.00"),
        "discount_price": None,
        "sku": "PLT-FRN-004",
        "stock_quantity": 0,
        "is_featured": False,
        "variants": [],
    },
    {
        "category": "Planters & Pots",
        "name": "Terracotta Classic Pot",
        "description": "Handmade breathable terracotta pot with drainage hole and saucer.",
        "care_instructions": "",
        "light_requirement": "",
        "is_pet_safe": True,
        "base_price": Decimal("450.00"),
        "discount_price": None,
        "sku": "POT-TER-001",
        "stock_quantity": 60,
        "is_featured": False,
        "variants": [("4 inch", None, 30), ("6 inch", Decimal("650.00"), 20), ("8 inch", Decimal("950.00"), 10)],
    },
    {
        "category": "Planters & Pots",
        "name": "Self-Watering Ceramic Planter",
        "description": "Modern matte-finish planter with a built-in water reservoir — ideal for busy plant parents.",
        "care_instructions": "",
        "light_requirement": "",
        "is_pet_safe": True,
        "base_price": Decimal("1899.00"),
        "discount_price": Decimal("1599.00"),
        "sku": "POT-SLW-002",
        "stock_quantity": 15,
        "is_featured": True,
        "variants": [],
    },
    {
        "category": "Soil & Fertilizers",
        "name": "Premium Potting Mix (5L)",
        "description": "Well-draining, nutrient-rich mix suitable for most indoor plants.",
        "care_instructions": "",
        "light_requirement": "",
        "is_pet_safe": True,
        "base_price": Decimal("650.00"),
        "discount_price": None,
        "sku": "SOL-MIX-001",
        "stock_quantity": 40,
        "is_featured": False,
        "variants": [],
    },
    {
        "category": "Soil & Fertilizers",
        "name": "Organic Liquid Fertilizer (250ml)",
        "description": "Gentle, balanced liquid fertilizer for consistent, healthy growth.",
        "care_instructions": "",
        "light_requirement": "",
        "is_pet_safe": True,
        "base_price": Decimal("899.00"),
        "discount_price": None,
        "sku": "SOL-FERT-002",
        "stock_quantity": 25,
        "is_featured": False,
        "variants": [],
    },
    {
        "category": "Plant Care Tools",
        "name": "Stainless Steel Pruning Shears",
        "description": "Sharp, precise shears for trimming and propagating houseplants.",
        "care_instructions": "",
        "light_requirement": "",
        "is_pet_safe": True,
        "base_price": Decimal("799.00"),
        "discount_price": None,
        "sku": "TOOL-PRN-001",
        "stock_quantity": 22,
        "is_featured": False,
        "variants": [],
    },
    {
        "category": "Plant Care Tools",
        "name": "Copper Watering Can (1.5L)",
        "description": "Long-spout copper-finish watering can for precise, mess-free watering.",
        "care_instructions": "",
        "light_requirement": "",
        "is_pet_safe": True,
        "base_price": Decimal("1299.00"),
        "discount_price": None,
        "sku": "TOOL-WTR-002",
        "stock_quantity": 14,
        "is_featured": True,
        "variants": [],
    },
    {
        "category": "Seeds & Bulbs",
        "name": "Basil Herb Seed Kit",
        "description": "Everything you need to grow fresh basil at home — seeds, mix, and pot.",
        "care_instructions": "",
        "light_requirement": "bright",
        "is_pet_safe": True,
        "base_price": Decimal("399.00"),
        "discount_price": None,
        "sku": "SEED-BAS-001",
        "stock_quantity": 50,
        "is_featured": False,
        "variants": [],
    },
    {
        "category": "Seeds & Bulbs",
        "name": "Sunflower Seed Pack",
        "description": "Grow tall, cheerful sunflowers in your garden or balcony.",
        "care_instructions": "",
        "light_requirement": "direct",
        "is_pet_safe": True,
        "base_price": Decimal("249.00"),
        "discount_price": None,
        "sku": "SEED-SUN-002",
        "stock_quantity": 45,
        "is_featured": False,
        "variants": [],
    },
]


class Command(BaseCommand):
    help = "Seed the database with demo categories and products for Leaf & Bloom."

    def handle(self, *args, **options):
        category_map = {}
        for cat in CATEGORIES:
            obj, created = Category.objects.get_or_create(
                name=cat["name"], defaults={"description": cat["description"]}
            )
            category_map[cat["name"]] = obj
            self.stdout.write(self.style.SUCCESS(f"{'Created' if created else 'Exists'}: Category '{obj.name}'"))

        for p in PRODUCTS:
            category = category_map[p["category"]]
            product, created = Product.objects.get_or_create(
                sku=p["sku"],
                defaults={
                    "category": category,
                    "name": p["name"],
                    "description": p["description"],
                    "care_instructions": p["care_instructions"],
                    "light_requirement": p["light_requirement"],
                    "is_pet_safe": p["is_pet_safe"],
                    "base_price": p["base_price"],
                    "discount_price": p["discount_price"],
                    "stock_quantity": p["stock_quantity"],
                    "is_featured": p["is_featured"],
                },
            )
            self.stdout.write(self.style.SUCCESS(f"{'Created' if created else 'Exists'}: Product '{product.name}'"))

            for variant_name, price_override, stock in p["variants"]:
                variant, v_created = ProductVariant.objects.get_or_create(
                    product=product,
                    name=variant_name,
                    defaults={"price_override": price_override, "stock_quantity": stock},
                )
                if v_created:
                    self.stdout.write(f"    + Variant '{variant.name}'")

        self.stdout.write(self.style.SUCCESS("\nSeeding complete."))
