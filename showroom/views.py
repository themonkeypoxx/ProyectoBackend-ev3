import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db.models import Q
from .models import CarModel, PackageOption, CarInquiry, PaintColor, WheelOption


@ensure_csrf_cookie
def showroom_index(request, initial_slug=None):
    cars = CarModel.objects.prefetch_related('colors', 'wheels', 'hotspots').select_related('specs').all()
    packages = PackageOption.objects.all()

    cars_list = [car.to_dict() for car in cars]

    active_index = 0
    if initial_slug:
        for idx, car in enumerate(cars):
            if car.slug == initial_slug:
                active_index = idx
                break

    initial_car = cars[active_index] if cars else None

    context = {
        'cars': cars,
        'cars_json': json.dumps(cars_list),
        'packages': packages,
        'packages_json': json.dumps([
            {
                'id': p.package_id,
                'name': p.name,
                'description': p.description,
                'price': p.price,
                'selected': p.is_default,
            }
            for p in packages
        ]),
        'active_index': active_index,
        'current_car': initial_car,
    }
    return render(request, 'showroom/index.html', context)


@require_GET
def api_cars_list(request):
    cars = CarModel.objects.prefetch_related('colors', 'wheels', 'hotspots').select_related('specs').all()
    return JsonResponse({'models': [car.to_dict() for car in cars]})


@require_GET
def api_car_detail(request, slug):
    car = get_object_or_404(
        CarModel.objects.prefetch_related('colors', 'wheels', 'hotspots').select_related('specs'),
        slug=slug
    )
    return JsonResponse(car.to_dict())


@require_GET
def api_search(request):
    query = request.GET.get('q', '').strip()
    cars = CarModel.objects.prefetch_related('colors', 'wheels', 'hotspots').select_related('specs').all()
    
    if query:
        cars = cars.filter(
            Q(name__icontains=query) |
            Q(full_name__icontains=query) |
            Q(series__icontains=query) |
            Q(tagline__icontains=query) |
            Q(description__icontains=query) |
            Q(specs__engine__icontains=query)
        ).distinct()

    return JsonResponse({
        'query': query,
        'count': cars.count(),
        'results': [car.to_dict() for car in cars]
    })


@require_POST
def api_save_inquiry(request):
    try:
        data = json.loads(request.body)
        car_slug = data.get('car_slug')
        car = get_object_or_404(CarModel, slug=car_slug)

        color_id = data.get('color_id')
        color = PaintColor.objects.filter(car=car, color_id=color_id).first()

        wheel_id = data.get('wheel_id')
        wheel = WheelOption.objects.filter(car=car, wheel_id=wheel_id).first()

        selected_packages = data.get('packages', [])
        total_price = int(data.get('total_price', car.base_price))

        customer_name = data.get('customer_name', 'VIP Client').strip()
        customer_email = data.get('customer_email', 'client@porsche-exclusive.com').strip()
        customer_phone = data.get('customer_phone', '').strip()
        dealer_location = data.get('dealer_location', 'Porsche Centre Stuttgart')
        notes = data.get('notes', '')

        inquiry = CarInquiry.objects.create(
            car=car,
            color=color,
            wheel=wheel,
            selected_packages=selected_packages,
            total_price=total_price,
            customer_name=customer_name or "Exclusive Client",
            customer_email=customer_email or "client@porsche-exclusive.com",
            customer_phone=customer_phone,
            dealer_location=dealer_location,
            notes=notes,
        )

        return JsonResponse({
            'success': True,
            'inquiry_id': inquiry.id,
            'reservation_code': f"PRSH-2026-{inquiry.id:05d}",
            'message': f"Vehículo {car.name} reservado con éxito. Su asesor de Porsche Centre Stuttgart se comunicará en breve."
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
