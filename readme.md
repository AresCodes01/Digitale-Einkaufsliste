# Shoppinglists
Website for managing shoppinglists

Before starting, remember that you may need to replace the `python` command with `py` or `python3` depending on your operating sytem or installed python version

## Configuring your virtual environment

* Install pip by running `python -m ensurepip --upgrade` in your terminal
* Open the terminal in the project folder and type `python -m venv venv`
* Activate the virtual environment by typing `venv\Scripts\activate.bat` on Windows and `source venv/bin/activate` on Linux
* Install Django by running `python -m pip install Django`

## Setting up your own page

* To start your server, activate your virtual environment and type `python manage.py runserver`
* You can now access the page by going to ["http://127.0.0.1:8000"](http://127.0.0.1:8000)
* If you want to change the port or ip, type `python manage.py runserver your_ip:your_port`, however you will need to 
register this url under `ALLOWED_HOSTS` in the `settings.py` and replace the url in the `index.js`