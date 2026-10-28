from django.contrib import admin
from .models import CarModel, CarSpec, PaintColor, WheelOption, CarHotspot, PackageOption, CarInquiry


class CarSpecInline(admin.StackedInline):
    model = CarSpec
    can_delete = False
    verbose_name = "Ficha Técnica"
    verbose_name_plural = "Ficha Técnica"


class PaintColorInline(admin.TabularInline):
    model = PaintColor
    extra = 1
    fields = ('name', 'color_id', 'hex_code', 'code', 'color_type', 'price', 'image', 'order')


class WheelOptionInline(admin.TabularInline):
    model = WheelOption
    extra = 1
    fields = ('name', 'wheel_id', 'size', 'finish', 'price', 'order')


class CarHotspotInline(admin.TabularInline):
    model = CarHotspot
    extra = 1
    fields = ('title', 'hotspot_id', 'category', 'spec', 'x', 'y')


@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'series', 'base_price', 'badge_text', 'order')
    list_filter = ('series',)
    search_fields = ('name', 'full_name', 'tagline', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [CarSpecInline, PaintColorInline, WheelOptionInline, CarHotspotInline]


@admin.register(PackageOption)
class PackageOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'package_id', 'price', 'is_default', 'order')
    list_editable = ('price', 'is_default', 'order')
    search_fields = ('name', 'description')


@admin.register(CarInquiry)
class CarInquiryAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'customer_email', 'car', 'total_price', 'dealer_location', 'created_at')
    list_filter = ('car', 'created_at')
    search_fields = ('customer_name', 'customer_email', 'customer_phone', 'notes')
    readonly_fields = ('created_at',)
