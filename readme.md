# Shoppinglists

Website for managing shoppinglists.

Before starting, remember that you may need to replace the `python` command with `py` or `python3` depending on your operating system or installed Python version.

---

## Project Description

This web application allows users to create, manage, and check off shopping lists easily. It is built using the Django framework (Python) and offers an intuitive interface with core features for organizing shopping items.

---

## Features

- Create, edit, and delete shopping lists  
- Add, edit, and check off items in the lists  
- User-friendly interface  
- Local SQLite database for simplicity  
- Easy setup and launch via Django development server  

---

## Configuring your virtual environment

* Install pip by running `python -m ensurepip --upgrade` in your terminal  
* Open the terminal in the project folder and type `python -m venv venv`  
* Activate the virtual environment by typing `venv\Scripts\activate.bat` on Windows or `source venv/bin/activate` on Linux/macOS  
* Install Django by running `python -m pip install Django`

---

## Setting up your own page

* To start your server, activate your virtual environment and type:  
  `python manage.py runserver`

* You can now access the page by opening:  
  [http://127.0.0.1:8000](http://127.0.0.1:8000)

* If you want to change the port or IP, run:  
  `python manage.py runserver your_ip:your_port`

  However, you will need to register this URL under `ALLOWED_HOSTS` in `settings.py` and update the URL in `index.js` accordingly.

---

# Technologies Used

* Python 3.x  
* Django Web Framework  
* SQLite (local database)  
* HTML, CSS, JavaScript (frontend)  

---

# Group Work Notice

This project was developed as part of a group assignment at the Technical University of Würzburg-Schweinfurt (THWS). Due to lost contact with some contributors, their involvement cannot be verified or credited further. The code and functionality represent the state of the exercise as completed by the team.

---

# License

This project is free to use for educational purposes. Commercial use requires the consent of all contributors.

---

# Contact

For questions or further information, please contact:

**AresCodes01**  
[https://github.com/AresCodes01](https://github.com/AresCodes01)

