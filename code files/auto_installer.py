import subprocess
import sys

def auto_installer():
    packages = list(set([
        "cosmodb",
        "sheetsmart",
        "customtkinter",
        "pillow",
        "requests",
        "pyperclip"
    ]))

    for package_name in packages:
        try:
            # Check if the package is already installed
            check = subprocess.run(
                [sys.executable, "-m", "pip", "show", package_name],
                capture_output=True, text=True
            )

            if check.returncode == 0:
                continue  # Already installed, skip all output

            # If not installed, install and show minimal output
            print(f"Please wait, installing {package_name}...")

            install = subprocess.run(
                [sys.executable, "-m", "pip", "install", package_name],
                capture_output=True, text=True
            )

            if install.returncode != 0:
                continue  # Fail silently as per instructions

            # Fetch installed version
            version = "Unknown"
            version_check = subprocess.run(
                [sys.executable, "-m", "pip", "show", package_name],
                capture_output=True, text=True
            )
            if version_check.returncode == 0:
                for line in version_check.stdout.splitlines():
                    if line.startswith("Version:"):
                        version = line.split(":")[1].strip()
                        break

            print(f"Installed version: {version}")

        except Exception:
            pass  # Fully silent on error
auto_installer()

