import subprocess
import sys

def update():
    packages = [
        "cosmodb",
        "customtkinter",
        "pillow",
        "requests",
        "pyperclip",
        "cosmotalker",
        "sheetsmart"
    ]

    # Optional: Clear pip cache to avoid stale wheels
    subprocess.run([sys.executable, "-m", "pip", "cache", "purge"], capture_output=True)

    for package_name in packages:
        try:
            # Get current installed version
            old_version = "Not Installed"
            old = subprocess.run(
                [sys.executable, "-m", "pip", "show", package_name],
                capture_output=True, text=True
            )
            if old.returncode == 0:
                for line in old.stdout.splitlines():
                    if line.startswith("Version:"):
                        old_version = line.split(":")[1].strip()
                        break

            print(f"\n🔍 Current version of '{package_name}': {old_version}")

            # Force upgrade/reinstall the package
            print(f"📦 Installing latest version of '{package_name}'...")
            install = subprocess.run(
                [sys.executable, "-m", "pip", "install", "--upgrade", "--force-reinstall", package_name],
                capture_output=True, text=True
            )

            # Get newly installed version
            new_version = "Unknown"
            new = subprocess.run(
                [sys.executable, "-m", "pip", "show", package_name],
                capture_output=True, text=True
            )
            if new.returncode == 0:
                for line in new.stdout.splitlines():
                    if line.startswith("Version:"):
                        new_version = line.split(":")[1].strip()
                        break

            # Print result
            if install.returncode == 0:
                print(f"✅ '{package_name}' updated: {old_version} → {new_version}")
            else:
                print(f"❌ Failed to install '{package_name}':\n{install.stderr}")

            print("\n" + "="*15 + f" Finished: {package_name} " + "="*15 + "\n")

        except Exception as e:
            print(f"\n❗ Error while updating '{package_name}': {e}")

if __name__ == "__main__":
    update()
