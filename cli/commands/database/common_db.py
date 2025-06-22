import numpy as np

def clean_param(value):
    if value is None:
        return None

    if isinstance(value, float) and np.isnan(value):
        return None

    value_str = str(value).strip()
    if value_str.lower() == "nan" or value_str == "":
        return None
    
    try:
        num = float(value_str)
        if num.is_integer():
            return int(num)  # parse float x.0 t x 
        else:
            return num       # float with decimals
    except ValueError:
        return value_str 


def get_list(names_str, separator = ","):
    if not names_str or str(names_str).strip().lower() == "nan":
        names_list = []
    else:
        names_list = [name.strip() for name in names_str.split(separator) if name.strip()]
    return names_list  