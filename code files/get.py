import importlib.util
import subprocess
import subprocess
import sys

def install_missing_packages(packages):
    for package_name in packages:
        try:
            # Check if the package is already installed
            check = subprocess.run(
                [sys.executable, "-m", "pip", "show", package_name],
                capture_output=True, text=True
            )

            if check.returncode == 0:
                continue  # Already installed, skip silently

            # Custom UI message
            if package_name == "cosmodb":
                print("Wait for a moment... 'cosmodb' is not downloaded in your machine.")
                print("When it's finished, you can use the 'get' function in the CosmoTalker Python library. Thank you.")
            else:
                print(f"Please wait, installing {package_name}...")

            # Install silently
            subprocess.run(
                [sys.executable, "-m", "pip", "install", package_name],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )

            # After install, try to fetch version
            version_check = subprocess.run(
                [sys.executable, "-m", "pip", "show", package_name],
                capture_output=True, text=True
            )

            if version_check.returncode == 0:
                version = next(
                    (line.split(":")[1].strip() for line in version_check.stdout.splitlines() if line.startswith("Version:")),
                    "Unknown"
                )
                print(f"Installed version: {version}")

        except Exception:
            pass  # Stay silent on all errors





d={'sun':'''The Sun is a G-type main-sequence star, roughly 4.6 billion years old.It’s 99.86% of the solar system’s mass, primarily hydrogen and helium.Its core reaches 15 million°C, driving nuclear fusion.he Sun’s diameter is about 1.39 million kilometers.It sustains life on Earth via photosynthesis and heat.''','mercury':'''Mercury is the smallest planet in our solar system, closest to the Sun.Its diameter is about 4,880 kilometers, with a thin atmosphere of exospheric gases.Surface temperatures range from -173°C to 427°C due to its proximity to the Sun.It has a large iron core, making up 60% of its mass.A year on Mercury lasts 88 Earth days.''','venus':'''Venus is Earth's closest planetary neighbor, with a diameter of 12,104 kilometers.It has a thick, toxic atmosphere of carbon dioxide, causing a runaway greenhouse effect.Surface temperatures average 462°C, hotter than Mercury.Venus rotates retrograde, with a day lasting 243 Earth days.Its surface features volcanoes, lava plains, and impact craters.''','earth':'''Earth is the third planet from the Sun, with a diameter of 12,742 kilometers.It has a nitrogen-oxygen atmosphere supporting diverse life forms.Surface temperatures average 15°C, with liquid water covering 71% of the planet.It completes one rotation in 24 hours and orbits the Sun in 365.25 days.Earth’s magnetic field protects it from solar and cosmic radiation.''','mars':'''Mars, the fourth planet, has a diameter of 6,792 kilometers.Its thin atmosphere is mostly carbon dioxide, with surface temperatures averaging -65°C.Known for Olympus Mons, the solar system’s largest volcano.A day lasts 24.6 hours; a year is 687 Earth days.Evidence suggests ancient liquid water and potential past microbial life.''','jupiter':'''Jupiter, the fifth planet, has a diameter of 139,820 kilometers, the largest in the solar system.Its atmosphere, mainly hydrogen and helium, features the Great Red Spot, a massive storm.It has 145 moons, with 83 officially named, including Io, Europa, and Ganymede.A day lasts 9.9 hours; a year takes 11.86 Earth years.Its strong magnetic field traps intense radiation belts.''','saturn':'''Saturn, the sixth planet, has a diameter of 116,460 kilometers.Its iconic rings are made of ice, dust, and rock particles.The atmosphere is mostly hydrogen and helium, with winds up to 1,800 km/h.It has 83 named moons, including Titan, larger than Mercury.A day lasts 10.7 hours; a year takes 29.46 Earth years.''','uranus':'''Uranus, the seventh planet, has a diameter of 50,724 kilometers.Its atmosphere, mainly hydrogen, helium, and methane, gives it a pale blue color.It has 27 known moons, named after literary characters, like Titania.A day lasts 17.2 hours; a year takes 84 Earth years.Uranus rotates on its side, with an axial tilt of 98 degrees.''','neptune':'''Neptune, the eighth planet, has a diameter of 49,244 kilometers.Its deep blue color comes from methane in its hydrogen-helium atmosphere.It has 14 known moons, with Triton being the largest and geologically active.A day lasts 16.1 hours; a year takes 164.8 Earth years.Neptune’s fierce winds can reach speeds of 2,400 km/h.'''}


def get(text_input:str):
    install_missing_packages(["cosmodb"])
    text=text_input.lower()
    if text in d:
        return d[text]

