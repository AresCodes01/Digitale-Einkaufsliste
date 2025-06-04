import json
from typing import ItemsView

from django.test import TestCase, Client
from home.models import *
from home.tests import *
from django.urls import reverse
from django.contrib.auth.models import User

urlStart = "http://127.0.0.1:8000/"


class UserTests(TestCase):
    DATABASE = "default"

    def test_user_created(self):
        client = Client()
        url = urlStart + "User"
        data = {
            "username": "test@test.de",
            "password": "test",
            "repeatedPassword": "test"
        }
        response = client.post(url, data)
        self.assertEqual(response.status_code, 201)

    def test_user_login(self):
        client = Client()
        User.objects.create_user(username="test@test.de", password="test")
        url = urlStart + "authenticate"
        data = '{"username": "test@test.de", "password": "test"}'
        response = client.post(url, data, content_type="application/json")
        self.assertEqual(response.status_code, 200)


class ListTests(TestCase):

    def test_create_new_list(self):
        client = Client()
        User.objects.create_user(username="test@test.de", password="test")
        client.login(username="test@test.de", password="test")
        url = urlStart + "List"
        data = '{"name": "List1", "items": [{"name": "Butter", "amount": "0.5", "unit": "kg"}]}'
        print(json.loads(data))
        response = client.post(url, data, content_type="application/json")
        self.assertEqual(response.status_code, 201)


    def test_remove_item_from_list(self):
        client = Client()
        User.objects.create_user(username="test@test.de", password="test")
        client.login(username="test@test.de", password="test")

        # Erstellt eine Einkaufsliste mit einem Element
        list_url = urlStart + "List"
        list_data = '{"name": "List1", "items": [{"name": "Butter", "amount": "0.5", "unit": "kg"}]}'
        list_response = client.post(list_url, list_data, content_type="application/json")
        self.assertEqual(list_response.status_code, 201)

        # Holt die ID der liste
        list_id = list_response.json().get("id")

        # Entfernt das Element aus der liste
        item_url = f"{list_url}/{list_id}/items"
        item_response = client.delete(item_url)
        self.assertEqual(item_response.status_code, 404)

        # Überprüft, ob das Element erfolgreich entfernt wurde
        updated_list_response = client.get(list_url)
        updated_list_data = updated_list_response.json()
        items = updated_list_data.get("items", [])
        self.assertEqual(len(items), 0)


    def test_entferne_liste(self):
     client = Client()
     User.objects.create_user(username="test@test.de", password="test")
     client.login(username="test@test.de", password="test")
     list_url = urlStart + "List"
     list_data = '{"name": "Liste2", "items": [{"name": "Butter", "amount": "0.5", "unit": "kg"}]}'
      
      # Erstellt eine liste
     list_response = client.post(list_url, list_data, content_type="application/json")
     self.assertEqual(list_response.status_code, 201)

      # Holt die ID der liste
     list_id = list_response.json().get("id")
    
     # Entfernt die Liste
     entfernen_url = f"{list_url}/{list_id}"
     entfernen_response = client.delete(entfernen_url)
     self.assertEqual(entfernen_response.status_code, 404)
       
     # Überprüft ob die Liste erfolgreich entfernt wurde
     abfrage_url = f"{list_url}/{list_id}"
     abfrage_response = client.get(abfrage_url)
     self.assertEqual(abfrage_response.status_code, 404)

  

    def test_dark_mode_switch(self):
        
        url = reverse("dark-mode-switch")
        data = {"darkmodeSwitch": "on"}
        response = self.client.post(url, data)

        # prüfe den Statuscode der Antwort
        self.assertEqual(response.status_code, 200)

        # Überprüft, ob es dark ist
        self.assertEqual(response.json()["theme"], "dark")
    
    def test_dark_mode_switch_fail(self):
        
        url = reverse("dark-mode-switch")
        data = {"darkmodeSwitch": "off"}
        response = self.client.post(url, data)

        # prüfe den Statuscode der Antwort
        self.assertEqual(response.status_code, 200)

        # Überprüft, ob es nicht dark ist
        self.assertNotEqual(response.json()["theme"], "dark")
    
    def test_light_mode_switch(self):
        
        url = reverse("dark-mode-switch")
        data = {"darkmodeSwitch": "off"}        
        response = self.client.post(url, data)

        # prüfe den Statuscode der Antwort
        self.assertEqual(response.status_code, 200)

        # Überprüft, ob es light ist
        self.assertEqual(response.json()["theme"], "light")

    def test_light_mode_switch_fail(self):
        
        url = reverse("dark-mode-switch")
        data = {"darkmodeSwitch": "on"}
        response = self.client.post(url, data)

        # prüfe den Statuscode der Antwort
        self.assertEqual(response.status_code, 200)

        # Überprüft, ob es nicht light ist
        self.assertNotEqual(response.json()["theme"], "light")

    def test_add_item_to_list(self):
        client = Client()
        User.objects.create_user(username="test@test.de", password="test")
        client.login(username="test@test.de", password="test")

        # Erstellen einer Einkaufsliste
        list_url = urlStart + "List"
        list_data = '{"name": "List1", "items": []}'
        einkaufsliste = client.post(list_url, list_data, content_type="application/json")
        self.assertEqual(einkaufsliste.status_code, 201)

        # Holen der List Id
        list = List.objects.get(listname = "List1")
        list_id = list.listid

        # Hinzufügen eines neuen Elements zur Einkaufsliste
        list_json = {"listid": list_id, "items": []}
        itemArray_json = {"name": "Banane", "amount": "1", "unit": "pc"}
        list_json["items"].append(itemArray_json)        
        item_url = urlStart + "addItem"
        send_item = client.post(item_url, list_json, content_type="application/json")
        self.assertEqual(send_item.status_code, 200)




