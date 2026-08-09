class Vehicle:
    """Base class for all vehicles."""

    def __init__(self, brand, speed):
        self.brand = brand
        self.speed = speed
        self.fuel = 100

    def drive(self):
        self.fuel -= 10
        print(f"{self.brand} is driving at {self.speed} km/h. Fuel left: {self.fuel}")

    def honk(self):
        print(f"{self.brand} goes Beep!")


class Car(Vehicle):
    def __init__(self, brand: str, speed: int, doors :int):
        super().__init__(brand, speed)
        self.doors = doors

    def open_trunk(self):
        print(f"{self.brand}'s trunk is now open.")


class Motorcycle(Vehicle):
    def __init__(self, brand, speed):
        super().__init__(brand, speed)

    def honk(self):
        print(f"{self.brand} goes Vroom-Beep!")

    def wheelie(self):
        self.fuel -= 5
        print(f"{self.brand} pops a wheelie! Fuel left: {self.fuel}")

# Now try to work out what this usage code does before running it:

car = Car("Toyota", 120, 4)
bike = Motorcycle("Harley", 160)

car.drive()
car.honk()
car.open_trunk()

bike.drive()
bike.honk()
bike.wheelie()

print(isinstance(car, Vehicle))  #boolean situatuin
print(isinstance(bike, Car))    #boolean situatuin
print(isinstance(car, Motorcycle))  #boolean situatuin


# A few questions to test your understanding — try answering them before running the code:

# 1. What will car.honk() print, and why is it different from bike.honk()?
# 2. After bike.drive() and bike.wheelie(), what is bike.fuel?
# 3. Would car.wheelie() work? Why or why not?
# 4. What do the three isinstance() calls print, and why?