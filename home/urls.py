from django.urls import path
from . import views



urlpatterns = [
    path("", views.home, name="home"),
    path("authenticate", views.authent, name="authent"),
    path("User", views.addUser, name="User"),
    path("List", views.addList, name="List"),
    path("getList", views.getList, name="getList"),
    path("logout", views.logout_view, name="logout"),
    path("deleteAccount", views.delete_Account_view, name="deleteAccount"),
    path("checkedItems", views.checkedItems, name="checkedItems"),
    path("addItem", views.addItem, name="addItem"),
    path("checkLoginStatus", views.checkLoginStatus, name="checkLoginStatus"),
    path("deleteLists", views.deleteLists, name="deleteLists"),
    path("deleteItems", views.deleteItems, name="deleteItems"),
    path("searchBrocadeItem", views.searchBrocadeItem, name="searchBrocadeItem"),
    path("themeSet", views.themeSet, name="themeSet"),
    path("themeGet", views.themeGet, name="themeGet"),
    path("dark-mode-switch", views.dark_mode_switch, name="dark-mode-switch"),

]
