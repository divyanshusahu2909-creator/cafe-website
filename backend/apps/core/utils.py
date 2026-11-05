import random
import string
from django.utils import timezone

def generate_order_reference():
    """Generates a human-friendly unique order reference, e.g. AA-ORD-20261026-X8F2"""
    date_str = timezone.now().strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"AA-ORD-{date_str}-{random_str}"

def generate_reservation_reference():
    """Generates a unique reservation reference, e.g. AA-RES-20261026-K3M9"""
    date_str = timezone.now().strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"AA-RES-{date_str}-{random_str}"
