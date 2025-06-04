"""shoppinglist URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("", include("home.urls")),
    path('admin/', admin.site.urls),
    path("authenticate", include("home.urls")),
    path("User", include("home.urls")),
    path("List", include("home.urls")),
    path("getList", include("home.urls")),
    path("logout", include("home.urls")),
    path("deleteAccount", include("home.urls")),
    path("checkedItems", include("home.urls")),
    path("addItems", include("home.urls")),
    path("checkLoginStatus", include("home.urls")),
    path("deleteLists", include("home.urls")),
    path("deleteItems", include("home.urls")),
    path("searchBrocadeItem", include("home.urls")),
    path("themeSet", include("home.urls")),
    path("themeGet", include("home.urls")),
]
