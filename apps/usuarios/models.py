from django.db import models

from django.contrib.auth.models import AbstractUser

#eso de AbstractUser ya encripta contraseñas y tal. chido Bv
## te amo Django :"v
class User(AbstractUser):
    email = models.EmailField(unique=True)

