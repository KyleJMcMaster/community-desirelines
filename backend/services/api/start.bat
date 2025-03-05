@ECHO OFF
pip install -r requirements.txt
pm2 start services/api/main.py
pm2 save