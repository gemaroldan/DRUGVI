# Windows
#python -m venv venv
#.\venv\Scripts\activate.bat

#linux
python3 -m venv .venv
source .venv/bin/activate

python -m pip --version

pip install -r cli/requirements.txt


deactivate
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
python -m pip --version
pip --version