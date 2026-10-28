import json
from django.test import TestCase, Client
from django.urls import reverse
from showroom.models import CarModel, CarSpec, PaintColor, WheelOption, PackageOption, CarInquiry


class ShowroomTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.car = CarModel.objects.create(
            slug='test-911-gt3-rs',
            name='Kia Soluto',
            full_name='Kia Soluto',
            tagline='Born from Flacht.',
            series='911',
            base_price=241300,
            hero_image='/static/cars/porsche-911-studio.jpg',
            description='Track capability engineered for road legality.',
            badge_text='GT MOTORSPORT',
            order=1
        )
        self.spec = CarSpec.objects.create(
            car=self.car,
            acceleration='3.2s',
            top_speed='296 km/h',
            power_hp='525 HP',
            power_kw='386 kW',
            engine='4.0L Boxer-6'
        )
        self.color = PaintColor.objects.create(
            car=self.car,
            color_id='c-arctic',
            name='Arctic Grey',
            hex_code='#83878b',
            code='1A',
            image='/static/cars/porsche-911-arctic-grey.jpg',
            color_type='special',
            price=4220
        )
        self.wheel = WheelOption.objects.create(
            car=self.car,
            wheel_id='w1',
            name='Forged Magnesium Wheels',
            size='20/21"',
            finish='Satin Neodyme',
            price=14500
        )
        self.package = PackageOption.objects.create(
            package_id='pkg-weissach',
            name='Weissach Package',
            description='Lightweight package',
            price=33520,
            is_default=True
        )

    def test_showroom_index_view(self):
        response = self.client.get(reverse('showroom:index'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'PORSCHE')
        self.assertContains(response, '911 GT3 RS')

    def test_model_detail_view(self):
        response = self.client.get(reverse('showroom:model_detail', kwargs={'initial_slug': 'test-911-gt3-rs'}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context['active_index'], 0)

    def test_api_cars_list(self):
        response = self.client.get(reverse('showroom:api_cars_list'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('models', data)
        self.assertEqual(len(data['models']), 1)
        self.assertEqual(data['models'][0]['name'], '911 GT3 RS')

    def test_api_car_detail(self):
        response = self.client.get(reverse('showroom:api_car_detail', kwargs={'slug': 'test-911-gt3-rs'}))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], 'test-911-gt3-rs')
        self.assertEqual(data['specs']['acceleration'], '3.2s')
        self.assertEqual(len(data['colors']), 1)

    def test_api_search(self):
        response = self.client.get(reverse('showroom:api_search') + '?q=flacht')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['count'], 1)
        self.assertEqual(data['results'][0]['slug'] if 'slug' in data['results'][0] else data['results'][0]['id'], 'test-911-gt3-rs')

    def test_api_inquiry_post(self):
        payload = {
            'car_slug': 'test-911-gt3-rs',
            'color_id': 'c-arctic',
            'wheel_id': 'w1',
            'packages': ['pkg-weissach'],
            'total_price': 293540,
            'customer_name': 'Carlos Sainz',
            'customer_email': 'carlos@motorsport.com',
            'customer_phone': '+34600123456',
            'dealer_location': 'Porsche Centre Madrid'
        }
        response = self.client.post(
            reverse('showroom:api_save_inquiry'),
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('reservation_code', data)
        self.assertEqual(CarInquiry.objects.count(), 1)
        inquiry = CarInquiry.objects.first()
        self.assertEqual(inquiry.customer_name, 'Carlos Sainz')
        self.assertEqual(inquiry.total_price, 293540)
