import shutil
import os
import sys
import json
import uuid

from renoir import Renoir
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

OUTPUT_FOLDER = "dist"

class HTMLWrapper:
    def __init__(self, val):
        self.val = val

    def __html__(self):
        return str(self.val)


class TemplateReloaderHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        print("building templates...")
        build_templates()


class StaticReloaderHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        print("Copying static resources...")
        copy_static_files()


class ConfigReloaderHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        print("Reloading config...")
        build_templates()

def build_templates():
    build_uuid = uuid.uuid4()
    config = json.loads(open("configs/config.json").read())
    templates = Renoir(path="templates", delimiters=("[[", "]]"))

    for page in config["pages"]:
        with open(os.path.join(OUTPUT_FOLDER, page["template"]), "w") as f:
            f.write(
                templates.render(
                    page["template"],
                    dict(HTMLWrapper=HTMLWrapper, build_uuid=build_uuid, **page["env"]),
                )
            )

def copy_static_files():
    shutil.copytree("content", os.path.join(OUTPUT_FOLDER), dirs_exist_ok=True)

def rebuild():
    shutil.rmtree(OUTPUT_FOLDER, ignore_errors=True)
    os.mkdir(OUTPUT_FOLDER)
    copy_static_files()
    build_templates()


if __name__ == "__main__":
    # Rebuild everything templates on startup, and then watch for changes if --watch is passed
    rebuild()

    if "--watch" in sys.argv:

        template_reloader_handler = TemplateReloaderHandler()
        static_reloader_handler = StaticReloaderHandler()
        config_reloader_handler = ConfigReloaderHandler()

        observer = Observer()
        observer.schedule(template_reloader_handler, "templates", recursive=True)
        observer.schedule(config_reloader_handler, "configs", recursive=True)
        observer.schedule(static_reloader_handler, "content", recursive=True)
        observer.start()

        try:
            while True:
                pass
        except KeyboardInterrupt:
            observer.stop()

        observer.join()
