import string
import random

longitud = int (input ("Ingrese el tamaño de la contraseña: "))

#ascii_letters = para letras minusculas y mayusculas
#digits = genera digitos
#puctuation = genera todos los signos de puntuacion

caracteres = string.ascii_letters + string.digits + string.punctuation 

contraseña = "".join(random.choice(caracteres) for i in range (longitud))

print ("La contraseña generada es: " + contraseña)