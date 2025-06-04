from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import *
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
import json, requests
from django.contrib.auth.models import User
import re
from django.core.mail import send_mail
from django.core import serializers
from django.http import JsonResponse
from django.views import View


def home(request):
    return render(request, "index.html")

@csrf_exempt
def authent(request):
    if request.method == 'POST':
        userrec = json.loads(request.body.decode("utf-8"))
        emailJson = userrec["username"]
        passwordJson = userrec["password"]
        print(userrec)

        user = authenticate(username=emailJson, password=passwordJson)
        if user is not None:
            print("user gefunden")
            login(request, user)
            response_data = {'message': 'User authenticated successfully'}
            return JsonResponse(response_data, status=200)
        else:
            print("Falsche Login daten")
            response_data = {'message': 'Invalid login credentials'}
            return JsonResponse(response_data, status=401)
    else:
        response_data = {"message": "Illegal method"}
        return JsonResponse(response_data, status=405)


@csrf_exempt
def addUser(request):
    regexMail = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'

    if request.method == 'POST':

        if (re.fullmatch(regexMail, request.POST["username"])):
            if (request.POST["repeatedPassword"] == request.POST["password"]):
                if User.objects.filter(username=request.POST["username"]).exists():
                    response_data = {"message": "E-Mail already in use"}
                    return JsonResponse(response_data, status=401)
                else:
                    User.objects.create_user(username=request.POST["username"], password=request.POST["password"],
                                             email=request.POST["username"])

                    u = User.objects.get(username=request.POST["username"])
                    themeQuery = ListUser(user=u)
                    themeQuery.save()

                    send_mail(
                        "Registration Shopping Lists",
                        "Hello,\n\nYou successfully created an account on 'Shopping Lists'",
                        None,
                        [str(request.POST["username"])],
                        fail_silently=False
                    )

                    response_data = {"message": "User successfully added"}
                    return JsonResponse(response_data, status=201)
            else:
                response_data = {"message": "Not identical Passwords"}
                return JsonResponse(response_data, status=401)
        else:
            if (request.POST["repeatedPassword"] != request.POST["password"]):
                response_data = {"message": "Illegal E-mail and Password"}
                return JsonResponse(response_data, status=401)
            else:
                response_data = {"message": "Illegal E-mail"}
                return JsonResponse(response_data, status=401)
    else:
        response_data = {"message": "Illegal method"}
        return JsonResponse(response_data, status=405)


@csrf_exempt
def addList(request):
    if request.method == "POST":
        listJson = json.loads(request.body.decode("utf-8"))
        print(listJson)
        print("List Name: " + str(listJson["name"]))
        print(request.user.id)
        userObject = User.objects.get(id=request.user.id)
        if str(listJson["name"]) == "":
            listCount = List.objects.filter(userid=userObject).count()
            listJson["name"] = "List " + str(listCount+1)
        queryList = List(listname=str(listJson["name"]), userid=userObject)
        queryList.save()
        listObject = List.objects.get(listid=queryList.pk)
        for item in listJson["items"]:
            print(item)
            queryItem = Item(listid=listObject, itemname=item["name"], amount=item["amount"], done="false",
                             unit=item["unit"])
            queryItem.save()

        response_data = {"message": "List successfully added"}
        return JsonResponse(response_data, status=201)
    else:
        response_data = {"message": "Illegal method"}
        return JsonResponse(response_data, status=405)


def getList(request):
    userObject = User.objects.get(id=request.user.id)
    print(request.user.username)
    listDB = List.objects.filter(userid=userObject)

    allLists = []
    for sList1 in listDB:
        print("Richtige Version: " + str(sList1.listid))
        listJson1 = {
            "listid": sList1.listid,
            "listname": sList1.listname,
            "items": []
        }

        itemDB = Item.objects.filter(listid=sList1.listid)

        for sItem in itemDB:
            itemJson = {
                "itemid": sItem.itemid,
                "itemname": sItem.itemname,
                "amount": sItem.amount,
                "done": sItem.done,
                "unit": sItem.unit
            }
            listJson1["items"].append(itemJson)
        allLists.append(listJson1)

    print(allLists)

    return JsonResponse(allLists, safe=False)


def logout_view(request):
    logout(request)
    return redirect("/")

def delete_Account_view(request):
    user = User.objects.get(id=request.user.id)
    List.objects.filter(userid_id=request.user.id).delete()
    user.delete()
    return redirect("/")


@csrf_exempt
def checkedItems(request):
    if request.method == "POST":
        itemsJson = json.loads(request.body.decode("utf-8"))
        print("Items: " + str(itemsJson))

        for item in itemsJson:
            if item["checked"]:
                print(item["itemId"])
                itemDB = Item.objects.get(itemid=item["itemId"])
                itemDB.done = "true"
                itemDB.save()
            else:
                itemDB = Item.objects.get(itemid=item["itemId"])
                itemDB.done = "false"
                itemDB.save()
        response_data = {"message": "Item status successfully updated"}
        return JsonResponse(response_data, status=200)
    else:
        response_data = {"message": "Illegal method"}
        return JsonResponse(response_data, status=405)


@csrf_exempt
def addItem(request):
    if request.method == "POST":
        listJson = json.loads(request.body.decode("utf-8"))
        print("List Name: " + str(listJson["listid"]))
        print(request.user.id)
        listObject = List.objects.get(listid=listJson["listid"])
        for item in listJson["items"]:
            print(item)
            queryItem = Item(listid=listObject, itemname=item["name"], amount=item["amount"], done="false",
                             unit=item["unit"])
            queryItem.save()
        response_data = {"message": "Item successfully added"}
        return JsonResponse(response_data, status=200)
    else:
        response_data = {"message": "Illegal method"}
        return JsonResponse(response_data, status=405)


def checkLoginStatus(request):
    if request.user.is_authenticated:
        return JsonResponse({'loggedIn': True})
    else:
        return JsonResponse({'loggedIn': False})


@csrf_exempt
def deleteLists(request):
    if request.method == "POST":
        listID = request.body.decode("utf-8")
        print("List ID: " + str(listID))
        print(request.user.id)
        List.objects.filter(listid=listID).delete()
        response_data = {"message": "List deleted!"}
        return JsonResponse(response_data, status=200)
    else:
        response_data = {"message": "Illegal method"}
        return JsonResponse(response_data, status=405)


@csrf_exempt
def deleteItems(request):
    if request.method == "POST":
        itemID = request.body.decode("utf-8")
        print("Item ID: " + str(itemID))
        print(request.user.id)
        Item.objects.filter(itemid=itemID).delete()
        response_data = {"message": "Item deleted!"}
        return JsonResponse(response_data, status=200)
    else:
        response_data = {"message": "Illegal method"}
        return JsonResponse(response_data, status=405)


@csrf_exempt
def searchBrocadeItem(request):
    if request.method == "POST":
        itemName = request.body.decode("utf-8")
        print("Search: " + itemName)

        url = "https://www.brocade.io/api/items"

        if itemName.isnumeric():
            print("Number")
            urlComp = url + "/" + itemName
            print(urlComp)
        else:
            print("Name")
            urlComp = url + "?query=" + itemName.replace(" ", "+")
            print(urlComp)

        response = requests.get(urlComp)
        response_data = response.json()
        print("Response " + str(response_data))
        return JsonResponse(response_data, status=200, safe=False)
    else:
        response_data = {"message": "Illegal method"}
        return JsonResponse(response_data, status=405)


@csrf_exempt
def themeSet(request):
    if request.method == "POST":
        theme = json.loads(request.body.decode("utf-8"))
        print("Theme: " + theme["theme"])

        userObject = User.objects.get(id=request.user.id)
        themeQuery = ListUser.objects.get(user=userObject)
        themeQuery.theme = theme["theme"]
        themeQuery.save()
        response_data = {'message': 'Theme set'}
        return JsonResponse(response_data, status=200, safe=False)
    else:
        response_data = {"message": "Illegal method"}
        return JsonResponse(response_data, status=405)


def themeGet(request):
    userObject = User.objects.get(id=request.user.id)
    theme = ListUser.objects.get(user=userObject)
    response_data = {'theme': theme.theme}
    return JsonResponse(response_data, status=200)


def dark_mode_switch(request):
    dark_mode = request.POST.get('darkmodeSwitch')
    theme = 'dark' if dark_mode == 'on' else 'light'
    theme_json = {'theme': theme}
    return JsonResponse(theme_json)
